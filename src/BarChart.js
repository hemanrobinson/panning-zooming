import React, { useEffect, useRef, useState }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './BarChart.css';

// Bar Chart in an SVG element.
const BarChart = ( props ) => {
    
    // Initialization.
    const width = 400,
        height = 400,
        padding = { top: 20, right: 20, bottom: 0, left: 20 },
        margin = { top: 0, right: 0, bottom: 50, left: 50 };
    let ref = useRef(),
        { dataSet } = props,
        xLabel = Data.getColumnNames( dataSet )[ 0 ],
        yLabel = "Frequency",
        data = Data.getValues( dataSet ),
        xMin0,
        xMax0,
        yMin0,
        yMax0,
        xScale,
        yScale,
        downLocation = { x: 0, y: 0, isX: false, isY: false, isMin: false, isMax: false },
        bars;
    
    // Assign the X group factor.
    const [ xGroup, setXGroup ] = useState( 0 );
    let onXGroup = ( event, value ) => {
        setXGroup( value );
    };

    // Calculate the bars.
    data = data.slice( 0, 7 );
    bars = Array.from( d3.rollup( data, v => v.length, d => d[ 0 ]));
    bars.sort(( a, b ) => ( b[ 1 ] - a[ 1 ]));
    
    console.log( bars );
        
    // Get the X scale.
    const [ xDomain, setXDomain ] = useState( bars.map( x => x[ 0 ]));
    xScale = d3.scaleBand()
        .domain( xDomain )
        .range([ margin.left + padding.left, width - margin.right - padding.right ])
        .padding( 0.2 );
    
    xMin0 = 0;
    xMax0 = xDomain.length - 1;
    
    // TODO:  Consider passing xDomain rather than min and max.

    // Get the Y scale.
    yMin0 = 0;
    yMax0 = d3.max( bars, d => d.length );
    yMax0 = 10;
    yScale = d3.scaleLinear()
        .domain([ yMin0, yMax0 ])
        .range([ height - margin.bottom - padding.bottom, margin.top + padding.top ]);
        
    // Zoom in two dimensions.
    let onZoom2D = ( isIn ) => {
        Graph.onZoom2D( isIn, xScale, yScale, xMin0, xMax0, yMin0, yMax0 );
        BarChart.draw( ref, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, xLabel, yLabel, bars );
    };
    
    // Zoom in one dimension.
    let onMouseDown = ( event ) => {
        Graph.onMouseDown( event, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, downLocation );
    },
    onMouseUp = ( event ) => {
        if( downLocation.isX || downLocation.isY ) {
            Graph.onMouseUp( event, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, downLocation );
            BarChart.draw( ref, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, xLabel, yLabel, bars );
        }
    };
    
    // Set hook to draw on mounting, or on any other lifecycle update.
    useEffect(() => {
        BarChart.draw( ref, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, xLabel, yLabel, bars );
    });
    
    // Return the component.
    return <Graph width={width} height={height} margin={margin} padding={padding}
        onZoom={onZoom2D} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onXGroup={onXGroup} ref={ref} />
};
    
// Draws the Bar Chart.
BarChart.draw = ( ref, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, xLabel, yLabel, bars ) => {
    
    // Initialization.
    const svg = d3.select( ref.current );
    svg.selectAll( "*" ).remove();

    // Draw the bars.
    svg.selectAll( "rect" )
        .data( bars )
        .enter()
        .append( "rect" )
        .attr( "x", function( d ) { return xScale( d[ 0 ]); })
        .attr( "y", function( d ) { return yScale( d[ 1 ].length ); })
        .attr( "width", xScale.bandwidth())
        .attr( "height", function(d) { return height - yScale( d[ 1 ].length ); })
        .style( "fill", "#99bbdd" );
        
    // Draw the axes and scroll bars.
    Graph.draw( ref, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, xLabel, yLabel );
};

export default BarChart;
