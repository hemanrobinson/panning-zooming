import React, { useEffect, useRef, useState }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './BarChart.css';

// Bar Chart in an SVG element.
const BarChart = ( props ) => {
    
    // Initialization.
    const width = 600,
        height = 400,
        padding = { top: 20, right: 20, bottom: 0, left: 20 },
        margin = { top: 0, right: 0, bottom: 80, left: 50 };
    let ref = useRef(),
        { dataSet } = props,
        xLabel = Data.getColumnNames( dataSet )[ 0 ],
        yLabel = "Frequency",
        data = Data.getValues( dataSet ),
        xDomain0,
        yDomain0,
        xScale,
        yScale,
        downLocation = { x: 0, y: 0, xDomain: [], yDomain: [], isX: false, isY: false, isMin: false, isMax: false },
        bars;
        
    // Get the X scale.
    const [ xDomain, setXDomain ] = useState([]);
    xScale = d3.scaleBand().domain( xDomain ).range([ margin.left + padding.left, width - margin.right - padding.right ]).padding( 0.2 );
    
    // Assign the X group factor.
    const [ xGroup, setXGroup ] = useState( 0 );
    let onXGroup = ( event, value ) => {
        setXDomain( xScale.domain());
        setXGroup( value );
    };

    // Calculate the bars.
    bars = Array.from( d3.rollup( data, v => v.length, d => d[ 0 ]));
    bars.sort(( a, b ) => ( b[ 1 ] - a[ 1 ]));
    
    // Combine bars if requested.
    let n = Math.round( xGroup * bars.length );
    if( 0 < n ) {
        let total = 0;
        for( let i = 0; ( i < n ); i++ ) {
            total += bars[ bars.length - i - 1 ][ 1 ];
        }
        bars.splice( bars.length - n, n );
        bars.push([ "Other", total ]);
    }
    
    // Set the X domain.
    xDomain0 = bars.map( x => x[ 0 ]);
    xScale.domain( xDomain0 );

    // Get the Y scale.
    yDomain0 = [ 0, d3.max( bars, d => d[ 1 ])];
    yScale = d3.scaleLinear()
        .domain( yDomain0 )
        .range([ height - margin.bottom - padding.bottom, margin.top + padding.top ]);
        
    // Zoom in two dimensions.
    let onZoom2D = ( isIn ) => {
        Graph.onZoom2D( isIn, xScale, yScale, xDomain0, yDomain0 );
        BarChart.draw( ref, height, width, margin, padding, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bars );
    };
    
    // Zoom in one dimension.
    let onMouseDown = ( event ) => {
        Graph.onMouseDown( event, height, width, margin, padding, xScale, yScale, xDomain0, yDomain0, downLocation );
    },
    onMouseUp = ( event ) => {
        if( downLocation.isX || downLocation.isY ) {
            Graph.onMouseUp( event, height, width, margin, padding, xScale, yScale, xDomain0, yDomain0, downLocation );
            BarChart.draw( ref, height, width, margin, padding, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bars );
        }
    };
    
    // Set hook to draw on mounting, or on any other lifecycle update.
    useEffect(() => {
        BarChart.draw( ref, height, width, margin, padding, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bars );
    });
    
    // Return the component.
    return <Graph width={width} height={height} margin={margin} padding={padding}
        onZoom={onZoom2D} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onXGroup={onXGroup} ref={ref} />
};
    
// Draws the Bar Chart.
BarChart.draw = ( ref, height, width, margin, padding, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bars ) => {
    
    // Initialization.
    const svg = d3.select( ref.current );
    svg.selectAll( "*" ).remove();

    // Draw the bars.
    svg.selectAll( "rect" )
        .data( bars )
        .enter()
        .append( "rect" )
        .attr( "x", ( d ) => xScale( d[ 0 ]))
        .attr( "y", ( d ) => yScale( d[ 1 ]))
        .attr( "width", xScale.bandwidth())
        .attr( "height", ( d ) => (( xScale.domain().indexOf( d[ 0 ]) >= 0 ) ? Math.max( 0, height - yScale( d[ 1 ])) : 0 ))
        .style( "fill", "#99bbdd" );
        
    // Draw the axes and scroll bars.
    Graph.draw( ref, height, width, margin, padding, true, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel );
};

export default BarChart;
