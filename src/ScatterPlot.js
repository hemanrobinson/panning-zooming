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
        
    // Create reference scales and transformation for scroll wheel.
    const xScale0 = xScale.copy(),
        yScale0 = yScale.copy();
    let transform0 = d3.zoomIdentity;
  
    // Handles the scroll wheel.
    function onZoom( event ) {
        const sourceEvent = event.sourceEvent,
            offsetX = sourceEvent.offsetX,
            offsetY = sourceEvent.offsetY,
            transform = event.transform,
            k = transform.k / transform0.k;
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
        if( isX ) {
            if( k === 1 ) {
                const domain = xScale.domain(),
                    range = xScale.range(),
                    d = (( domain[ 1 ] - domain[ 0 ]) / ( range[ 1 ] - range[ 0 ])) * ( transform0.x - transform.x );
                if( d ) {
                    xScale.domain([ domain[ 0 ] + d, domain[ 1 ] + d ]);
                    Graph.clampDomain( xScale, xScale0.domain());
                }
            } else {
                xScale = transform.rescaleX( xScale0 );
                Graph.clampDomain( xScale, xScale0.domain());
            }
        }
        if( isY ) {
            if( k === 1 ) {
                const domain = yScale.domain(),
                    range = yScale.range(),
                    d = (( domain[ 1 ] - domain[ 0 ]) / ( range[ 1 ] - range[ 0 ])) * ( transform0.y - transform.y );
                if( d ) {
                    yScale.domain([ domain[ 0 ] + d, domain[ 1 ] + d ]);
                    Graph.clampDomain( yScale, yScale0.domain());
                }
            } else {
                yScale = transform.rescaleY( yScale0 );
                Graph.clampDomain( yScale, yScale0.domain());
            }
        }
        if( isX || isY ) {
            ScatterPlot.draw( ref, width, height, margin, padding, true, false, false, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, dataSet, symbolScale );
        }
        transform0 = transform;
    }
    
    // Set hook invoked upon mounting.
    useEffect(() => {
  
        // Hook up the scroll wheel.
        const svg = d3.select( ref.current.childNodes[ 0 ]);
        svg.call( d3.zoom()
            .extent([[ 0, 0 ], [ width, height ]])
            .scaleExtent([ 1, 4 ])
            .on( "zoom", onZoom ));
        
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
