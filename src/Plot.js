import React, { useRef, useEffect }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import './Plot.css';

// Scatter plot in an SVG element.
const Plot = ( props ) => {
    
    // Create reference and scales.
    const padding = 20, marginAxis = 40, height = 400, width = 400;
    let ref = useRef(),
        { dataSet, size } = props,
        data = Data.getValues( dataSet ),
        xScale = d3.scaleLinear().domain([ d3.min( data, d => d[ 2 ]), d3.max( data, d => d[ 2 ])]).range([ marginAxis + padding, width - padding ]),
        yScale = d3.scaleLinear().domain([ d3.min( data, d => d[ 1 ]), d3.max( data, d => d[ 1 ])]).range([ height - marginAxis - padding, padding ]);
    
    // Hook to draw on mounting, or on any other lifecycle update.
    useEffect(() => {
        Plot.draw( height, width, marginAxis, padding, ref, xScale, yScale, dataSet, 100 );
    });
    
    // Return the component.
    return <svg width={width} height={height} ref={ref}></svg>;
};
    
// Draws the points.
Plot.draw = ( height, width, marginAxis, padding, ref, xScale, yScale, dataSet, size ) => {
    
    // Initialization.
    const svg = d3.select( ref.current );
    let data = Data.getValues( dataSet ),
        columnNames = Data.getColumnNames( dataSet ),
        symbolScale = d3.scaleOrdinal( data.map( datum => datum[ 0 ]), d3.symbols.map( s => d3.symbol().type( s ).size( size )()));
    svg.selectAll( "*" ).remove();
    
    // Draw the points.
    data.forEach(( datum ) => {
        svg.append( "path" )
        .attr( "d", symbolScale( datum[ 0 ]))
        .attr( "transform", d => "translate( " + Math.round( xScale( datum[ 2 ])) + ", " + Math.round( yScale( datum[ 1 ])) + " )" )
        .style( "fill", "none" )
        .style( "stroke", "black" );
    });
    
    // Draw the X axis.
    svg.append( "g" )
        .attr( "class", "axis" )
        .attr( "transform", "translate( 0, " + ( height - marginAxis ) + " )" )
        .call( d3.axisBottom( xScale ).ticks( 2.5 ).tickFormat(( x ) => { return x.toFixed( 0 )}));
    svg.append( "text" )
        .attr( "transform", "translate( " + ( width / 2 ) + " ," + ( height - padding / 2 ) + ")" )
        .style( "text-anchor", "middle" )
        .text( columnNames[ 2 ]);
        
    // Draw the Y axis.
    svg.append( "g" )
        .attr( "class", "axis" )
        .attr( "transform", "translate( " + marginAxis + ", 0 )" )
        .call( d3.axisLeft( yScale ).ticks( 3 ).tickFormat(( x ) => { return x.toFixed( 0 )}));
    svg.append( "text" )
        .attr( "transform", "rotate( -90 )" )
        .attr( "x", -height / 2 )
        .attr( "y", padding * 0.75 )
        .style( "text-anchor", "middle" )
        .text( columnNames[ 1 ]);
};

export default Plot;
