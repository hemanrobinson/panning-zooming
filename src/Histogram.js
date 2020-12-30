import React, { useEffect, useRef }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './Histogram.css';

// Histogram in an SVG element.
const Histogram = ( props ) => {
    
    // Initialization.
    const width = 400, height = 400, padding = { top: 20, right: 20, bottom: 0, left: 20 }, margin = { top: 0, right: 0, bottom: 50, left: 50 }, scrollSize = 15;
    let ref = useRef(),
        { dataSet } = props,
        data = Data.getValues( dataSet ),
        xMin0 = d3.min( data, d => d[ 2 ]),
        xMax0 = d3.max( data, d => d[ 2 ]),
        yMin0,
        yMax0,
        xScale = d3.scaleLinear().domain([ xMin0, xMax0 ]).range([ margin.left + padding.left, width - margin.right - padding.right ]),
        yScale,
        histogram,
        bins,
        mouseState = { xDown: 0, yDown: 0, isX: false, isY: false, isMin: false, isMax: false };
    
    // Zoom in two dimensions.
    let onZoom2D = ( isIn ) => {
        Graph.onZoom2D( xScale, yScale, xMin0, xMax0, yMin0, yMax0, isIn );
        Histogram.draw( height, width, margin, padding, scrollSize, ref, xScale, yScale, histogram, bins, xMin0, xMax0, yMin0, yMax0, dataSet, 100 );
    },
    onZoomIn  = () => { onZoom2D( true  ); },
    onZoomOut = () => { onZoom2D( false ); };
    
    // Zoom in one dimension.
    let onMouseDown = ( event ) => {
        Graph.onMouseDown( height, width, margin, padding, scrollSize, xScale, yScale, xMin0, xMax0, yMin0, yMax0, event, mouseState );
    },
    onMouseUp = ( event ) => {
        Graph.onMouseUp( height, width, margin, padding, scrollSize, xScale, yScale, xMin0, xMax0, yMin0, yMax0, event, mouseState );
        if( mouseState.isX || mouseState.isY ) {
            Histogram.draw( height, width, margin, padding, scrollSize, ref, xScale, yScale, histogram, bins, xMin0, xMax0, yMin0, yMax0, dataSet, 100 );
        }
    };
    
    // Calculate the bins.
    let onGroup = ( event, value ) => {

        // Get the histogram bins.
        let nBins = Math.round( 8 + Math.exp( 5 * value / 100 ));
        histogram = d3.histogram()
            .value( d => d[ 2 ])
            .domain([ xMin0, xMax0 ])
            .thresholds( nBins );
        bins = histogram( data );

        // Get the Y scale.
        yMin0 = 0;
        yMax0 = d3.max( bins, d => d.length );
        yScale = d3.scaleLinear()
            .range([ height - margin.bottom - padding.bottom, margin.top + padding.top ])
            .domain([ yMin0, yMax0 ]);
            
        // Draw.  TODO:  Use state variable instead.
        Histogram.draw( height, width, margin, padding, scrollSize, ref, xScale, yScale, histogram, bins, xMin0, xMax0, yMin0, yMax0, dataSet, 100 );
    };
    onGroup( undefined, 0 );
    
    // Set hook to draw on mounting, or on any other lifecycle update.
    useEffect(() => {
        Histogram.draw( height, width, margin, padding, scrollSize, ref, xScale, yScale, histogram, bins, xMin0, xMax0, yMin0, yMax0, dataSet, 100 );
    });
    
    // Return the component.
    return <Graph width={width} height={height} margin={margin} padding={padding}
        onZoomIn={onZoomIn} onZoomOut={onZoomOut}
        onMouseDown={onMouseDown} onMouseUp={onMouseUp} onGroup={onGroup} ref={ref} />
};
    
// Draws the points.
Histogram.draw = ( height, width, margin, padding, scrollSize, ref, xScale, yScale, histogram, bins, xMin0, xMax0, yMin0, yMax0, dataSet, size ) => {
    
    // Initialization.
    const svg = d3.select( ref.current );
    let columnNames = Data.getColumnNames( dataSet );
    svg.selectAll( "*" ).remove();

    // Draw the bars.
    svg.selectAll( "rect" )
        .data( bins )
        .enter()
        .append( "rect" )
        .attr( "x", 1 )
        .attr( "transform", bin => ( "translate( " + xScale( bin.x0 ) + "," + yScale( bin.length ) + " )" ))
        .attr( "width", bin => Math.max( 0, (( bin.x1 === bin.x0 ) ? 0 : ( xScale( bin.x1 ) - xScale( bin.x0 ) - 1 ))))
        .attr( "height", bin => Math.max( 0, ( height - margin.bottom - padding.bottom - yScale( bin.length ))))
        .style( "fill", "#99bbdd" );
    
    // Draw the axes and scroll bars.
    Graph.draw( ref, height, width, margin, padding, scrollSize, xScale, yScale, xMin0, xMax0, yMin0, yMax0, columnNames[ 2 ], "Frequency", size );
};

export default Histogram;
