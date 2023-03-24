import React, { useEffect, useRef }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './Graph.css';

/**
 * Scatter plot in an SVG element.
 *
 * This component is stateless because the zoom can be calculated from the event coordinates and the initial domains.
 *
 * @param  {Object}  props  properties
 * @return component
 */
const ScatterPlot = ( props ) => {

    // Initialization.
    const width = 400,
        height = 400,
        padding = { top: 20, right: 20, bottom: 20, left: 20 },
        margin = { top: 10, right: 10, bottom: 50, left: 50 };
    let ref = useRef(),
        { dataSet } = props,
        xLabel = Data.getColumnNames( dataSet )[ 1 ],
        yLabel = Data.getColumnNames( dataSet )[ 2 ],
        data = Data.getValues( dataSet ),
        xDomain0 = [ d3.min( data, d => d[ 1 ]), d3.max( data, d => d[ 1 ])],
        yDomain0 = [ d3.min( data, d => d[ 2 ]), d3.max( data, d => d[ 2 ])],
        xScale = d3.scaleLinear().domain( xDomain0 ).range([ margin.left + padding.left, width - margin.right - padding.right ]),
        yScale = d3.scaleLinear().domain( yDomain0 ).range([ height - margin.bottom - padding.bottom, margin.top + padding.top ]),
        symbolScale = d3.scaleOrdinal( data.map( datum => datum[ 0 ]), d3.symbolsStroke.map( s => d3.symbol().type( s ).size( 80 )()));
    
    // Zoom in one dimension.
    let onPointerDown = ( event ) => {
        Graph.onPointerDown( event, width, height, margin, padding, false, 0, 0, xScale, yScale, xDomain0, yDomain0 );
    },
    onPointerUp = ( event ) => {
        if( Graph.downLocation.isX || Graph.downLocation.isY ) {
            Graph.onPointerUp( event, width, height, margin, padding, xScale, yScale, xDomain0, yDomain0 );
            ScatterPlot.draw( ref, width, height, margin, padding, true, false, false, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, dataSet, symbolScale );
        }
    };
    
    // Show or hide the controls.
    let onPointerOver = ( event ) => {
        Graph.drawControls( ref, width, height, margin, padding, 0, 0, true, true, false, false, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel );
    };
    let onPointerOut = ( event ) => {
        let xUp = event.nativeEvent.offsetX,
            yUp = event.nativeEvent.offsetY,
            isZooming = (( 0 <= xUp ) && ( xUp < width ) && ( 0 <= yUp ) && ( yUp < height ));
        Graph.drawControls( ref, width, height, margin, padding, 0, 0, isZooming, isZooming, false, false, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel );
    };
    
    // TODO:  Fix "jumping" behavior when zooming in 1D, then in 2D.  The 1D zoom gets suddenly applied to both axes.
    // This does not happen in Fil's https://observablehq.com/@d3/x-y-zoom.
    // I tried to integrate his code, commented out below, but it generates an error in zoom.js:
    //      Cannot read properties of undefined (reading 'baseVal')
    // This may be due to React libraries; I've seen this issue in Jest unit tests:
    //      https://github.com/zcreativelabs/react-simple-maps/issues/245
    // Pragmatic decision for now is to live with this bug in GitHub, and fix it in Observable.
        
    // Create reference scales and transform for scroll wheel.
    const xScale0 = xScale.copy(),
        yScale0 = yScale.copy();
    let transform0 = d3.zoomIdentity;
  
    // center the action (handles multitouch)
//    function center(event, target) {
//        if (event.sourceEvent) {
//            const p = d3.pointers(event, target);
//            return [d3.mean(p, d => d[0]), d3.mean(p, d => d[1])];
//        }
//        return [width / 2, height / 2];
//    }
  
    // Handles the scroll wheel.
    function onZoom( event ) {
    
        // Initialization.
        const sourceEvent = event.sourceEvent,
            offsetX = sourceEvent.offsetX,
            offsetY = sourceEvent.offsetY,
            transform = event.transform,
            k = transform.k / transform0.k;
//        const point = center(event, this);
            
        // Check whether X or Y dimension.
        let isX = false,
            isY = false;
        if( offsetY >= height - margin.bottom ) {
            isX = true;
        } else if( offsetX <= margin.left  ) {
            isY = true;
        } else if(( offsetX <= width - padding.right ) && ( offsetY >= padding.top )) {
            isX = true;
            isY = true;
        }
        
        // Handle X dimension.
        if( isX ) {
            if( k === 1 ) {     // panning
                const domain = xScale.domain(),
                    range = xScale.range(),
                    d = (( domain[ 1 ] - domain[ 0 ]) / ( range[ 1 ] - range[ 0 ])) * ( transform0.x - transform.x );
                if( d ) {
                    xScale.domain([ domain[ 0 ] + d, domain[ 1 ] + d ]);
                    Graph.clampDomain( xScale, xScale0.domain());
                }
            } else {            // zooming
//                ScatterPlot.gx.call(ScatterPlot.zoomX.scaleBy, k, point);
                xScale = transform.rescaleX( xScale0 );
//                Graph.clampDomain( xScale, xScale0.domain());
            }
        }
        
        // Handle Y dimension.
        if( isY ) {
            if( k === 1 ) {     // panning
                const domain = yScale.domain(),
                    range = yScale.range(),
                    d = (( domain[ 1 ] - domain[ 0 ]) / ( range[ 1 ] - range[ 0 ])) * ( transform0.y - transform.y );
                if( d ) {
                    yScale.domain([ domain[ 0 ] + d, domain[ 1 ] + d ]);
                    Graph.clampDomain( yScale, yScale0.domain());
                }
            } else {            // zooming
//                ScatterPlot.gy.call(ScatterPlot.zoomY.scaleBy, k, point);
                yScale = transform.rescaleY( yScale0 );
                Graph.clampDomain( yScale, yScale0.domain());
            }
        }
        
        // Redraw the plot.
        if( isX || isY ) {
            ScatterPlot.draw( ref, width, height, margin, padding, true, false, false, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, dataSet, symbolScale );
        }
        
        // Update the reference transforms for comparison.
        transform0 = transform;
    }
    
    // Set hook invoked upon mounting.
    useEffect(() => {
  
        // Hook up the scroll wheel.
        const svg = d3.select( ref.current.childNodes[ 0 ]);
        svg.call( d3.zoom()
            .extent([[ 0, 0 ], [ width, height ]])
            .scaleExtent([ 1, 4 ])
            .filter( event => { event.preventDefault(); return true; })
            .on( "zoom", onZoom ));
//        ScatterPlot.gx = svg.append("g");
//        ScatterPlot.gy = svg.append("g");
//
//        // set up the ancillary zooms and an accessor for their transforms
//        ScatterPlot.zoomX = d3.zoom().scaleExtent([0.1, 10]);
//        ScatterPlot.zoomY = d3.zoom().scaleExtent([0.2, 5]);
//        const tx = () => d3.zoomTransform(ScatterPlot.gx.node());
//        const ty = () => d3.zoomTransform(ScatterPlot.gy.node());
//        ScatterPlot.gx.call(ScatterPlot.zoomX).attr("pointer-events", "none");
//        ScatterPlot.gy.call(ScatterPlot.zoomY).attr("pointer-events", "none");
        
        // Draw the plot.
        ScatterPlot.draw( ref, width, height, margin, padding, false, false, false, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, dataSet, symbolScale );
    });
    
    // Return the component.
    return <Graph width={width} height={height} margin={margin} padding={padding} onZoom={onZoom}
        onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerOver={onPointerOver} onPointerOut={onPointerOut} ref={ref} />
};

/**
 * Draws the scatter plot.
 *
 * @param  {Object}   ref          reference to DIV
 * @param  {number}   width        width, in pixels
 * @param  {number}   height       height, in pixels
 * @param  {Box}      margin       margin
 * @param  {Box}      padding      padding
 * @param  {boolean}  isZooming    true iff drawing zoom controls
 * @param  {boolean}  isXBinning   true iff drawing bin controls in X dimension
 * @param  {boolean}  isYBinning   true iff drawing bin controls in Y dimension
 * @param  {D3Scale}  xScale       X scale
 * @param  {D3Scale}  yScale       Y scale
 * @param  {Array}    xDomain0     Initial X domain
 * @param  {Array}    yDomain0     Initial Y domain
 * @param  {string}   xLabel       X axis label
 * @param  {string}   yLabel       Y axis label
 * @param  {string}   dataSet      data set name
 * @param  {D3Scale}  symbolScale  symbol scale
 */
ScatterPlot.draw = ( ref, width, height, margin, padding, isZooming, isXBinning, isYBinning, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, dataSet, symbolScale ) => {
    
    // Initialization.
    const svg = d3.select( ref.current.childNodes[ 0 ]);
    svg.selectAll( "*" ).remove();
    
    // Draw the points.
    const g = svg.append( "g" );
    let data = Data.getValues( dataSet );
    data.forEach(( datum ) => {
        g.append( "path" )
        .attr( "d", symbolScale( datum[ 0 ]))
        .attr( "transform", d => "translate( " + Math.round( xScale( datum[ 1 ])) + ", " + Math.round( yScale( datum[ 2 ])) + " )" )
        .style( "fill", "none" )
        .style( "stroke", "black" );
    });
    
    // Draw the axes and the controls.
    Graph.drawAxes(     ref, width, height, margin, padding, 0, 0, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel );
    Graph.drawControls( ref, width, height, margin, padding, 0, 0, isZooming, isZooming, isXBinning, isYBinning, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel );
};

export default ScatterPlot;
