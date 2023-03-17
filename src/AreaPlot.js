import React, { useEffect, useRef }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './Graph.css';

/**
 * Area plot in an SVG element.
 *
 * This component is stateless because the zoom can be calculated from the event coordinates and the initial domains.
 *
 * @param  {Object}  props  properties
 * @return component
 */
const AreaPlot = ( props ) => {

    // Initialization.
    const width = 650,
        height = 400,
        padding = { top: 20, right: 20, bottom: 0, left: 0 },
        margin = { top: 20, right: 0, bottom: 50, left: 70 },
        overviewPadding = 50;
    let ref = useRef(),
        { dataSet } = props,
        xLabel = Data.getColumnNames( dataSet )[ 0 ],
        yLabel = Data.getColumnNames( dataSet )[ 1 ],
        data = Data.getValues( dataSet ),
        xDomain0 = [ d3.min( data, d => d[ 0 ]), d3.max( data, d => d[ 0 ])],
        yDomain0 = [ d3.min( data, d => d[ 1 ]), d3.max( data, d => d[ 1 ])],
        xScale = d3.scaleLinear().domain( xDomain0 ).range([ margin.left + padding.left, width - margin.right - padding.right ]),
        yScale = d3.scaleLog().domain( yDomain0 ).range([ height - margin.bottom - padding.bottom - overviewPadding, margin.top + padding.top ]),
        xScale1 = d3.scaleLinear().domain( xDomain0 ).range([ margin.left + padding.left, width - margin.right - padding.right ]),
        yScale1 = d3.scaleLog().domain( yDomain0 ).range([ height, height - overviewPadding ]);
    
    // Zoom in two dimensions.
//    let onZoom2D = ( isIn ) => {
//        Graph.onZoom2D( isIn, xScale, yScale, xDomain0, yDomain0, true, false );
//        AreaPlot.draw( ref, width, height, margin, padding, overviewPadding, true, false, false, xScale, yScale, xScale1, yScale1, xDomain0, yDomain0, xLabel, yLabel, dataSet );
//    };
    
    // Zoom in one dimension.
    let onPointerDown = ( event ) => {
        Graph.onPointerDown( event, width, height, margin, padding, false, overviewPadding, -1, xScale, yScale, xDomain0, yDomain0 );
    },
    onPointerUp = ( event ) => {
        if( Graph.downLocation.isX || Graph.downLocation.isY ) {
            Graph.onPointerUp( event, width, height, margin, padding, xScale, yScale, xDomain0, yDomain0 );
            AreaPlot.draw( ref, width, height, margin, padding, overviewPadding, true, false, false, xScale, yScale, xScale1, yScale1, xDomain0, yDomain0, xLabel, yLabel, dataSet );
        }
    };
    
    // Show or hide the controls.
    let onPointerOver = ( event ) => {
        if( !AreaPlot.isOver ) {
            AreaPlot.isOver = true;
            AreaPlot.draw( ref, width, height, margin, padding, overviewPadding, true, false, false, xScale, yScale, xScale1, yScale1, xDomain0, yDomain0, xLabel, yLabel, dataSet );
        }
    };
    let onPointerOut = ( event ) => {
        if( AreaPlot.isOver ) {
            AreaPlot.isOver = false;
            let xUp = event.nativeEvent.offsetX,
                yUp = event.nativeEvent.offsetY,
                isZooming = (( 0 <= xUp ) && ( xUp < width ) && ( 0 <= yUp ) && ( yUp < height ));
            AreaPlot.draw( ref, width, height, margin, padding, overviewPadding, isZooming, false, false, xScale, yScale, xScale1, yScale1, xDomain0, yDomain0, xLabel, yLabel, dataSet );
        }
    };
    
    // Set hook to draw on mounting.
    useEffect(() => {
        AreaPlot.draw( ref, width, height, margin, padding, overviewPadding, Graph.isZooming.get( ref ), false, false, xScale, yScale, xScale1, yScale1, xDomain0, yDomain0, xLabel, yLabel, dataSet );
    });
    
    // Return the component.
    return <Graph width={width} height={height} margin={margin} padding={padding}
        onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerOver={onPointerOver} onPointerOut={onPointerOut} ref={ref} />
};
    
/**
 * Returns whether user event is over the graph.
 *
 * @type {boolean}
 */
AreaPlot.isOver = false;

/**
 * Draws the Area plot.
 *
 * @param  {Object}   ref          reference to DIV
 * @param  {number}   width        width, in pixels
 * @param  {number}   height       height, in pixels
 * @param  {Box}      margin       margin
 * @param  {Box}      padding      padding
 * @param  {number}   overviewPadding  padding for overview
 * @param  {boolean}  isZooming    true iff drawing zoom controls
 * @param  {boolean}  isXBinning   true iff drawing bin controls in X dimension
 * @param  {boolean}  isYBinning   true iff drawing bin controls in Y dimension
 * @param  {D3Scale}  xScale       X scale of detail
 * @param  {D3Scale}  yScale       Y scale of detail
 * @param  {D3Scale}  xScales      X scale of overview
 * @param  {D3Scale}  yScale1      Y scale of overview
 * @param  {Array}    xDomain0     Initial X domain
 * @param  {Array}    yDomain0     Initial Y domain
 * @param  {string}   xLabel       X axis label
 * @param  {string}   yLabel       Y axis label
 * @param  {string}   dataSet      data set name
 */
AreaPlot.draw = ( ref, width, height, margin, padding, overviewPadding, isZooming, isXBinning, isYBinning, xScale, yScale, xScale1, yScale1, xDomain0, yDomain0, xLabel, yLabel, dataSet ) => {
    
    // Initialization.
    const svg = d3.select( ref.current.childNodes[ 0 ]);
    svg.selectAll( "*" ).remove();
    
    // Draw the area.
    let data = Data.getValues( dataSet );
    const g = svg.append( "g" );
    g.append("path")
        .datum( data )
        .attr( "fill", "#99bbdd" )
        .attr( "stroke", "#99bbdd" )
        .attr( "stroke-width", 1.5 )
        .attr( "d", d3.area()
            .x( d => xScale( d[ 0 ]))
            .y0( height - margin.bottom - overviewPadding )
            .y1( d => yScale( d[ 1 ]))
        );
    
    // Draw the axes and the controls.
    Graph.drawAxes( ref, width, height - overviewPadding, margin, padding, overviewPadding, -1, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel );
    g.append("path")
        .datum( data )
        .attr( "fill", "#99bbdd" )
        .attr( "stroke", "#99bbdd" )
        .attr( "stroke-width", 1.5 )
        .attr( "d", d3.area()
            .x( d => xScale1( d[ 0 ]))
            .y0( height )
            .y1( d => yScale1( d[ 1 ]))
        );
    Graph.drawControls( ref, width, height, margin, padding, overviewPadding, -1, false, isZooming, false, isXBinning, isYBinning, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel );
};

export default AreaPlot;
