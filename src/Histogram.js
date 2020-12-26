import React, { useRef, useEffect }  from 'react';
//import { Slider } from '@material-ui/core';
import * as d3 from 'd3';
import Data from './Data';
import './Histogram.css';

// Histogram in an SVG element.
const Histogram = ( props ) => {
    
    // Initialization.
    const padding = 20, marginAxis = 50, buttonSize = 30, scrollSize = 15, height = 400, width = 400;
    let { dataSet } = props,
        data = Data.getValues( dataSet ),
        xMin0 = d3.min( data, d => d[ 2 ]),
        xMax0 = d3.max( data, d => d[ 2 ]),
        yMin0 = d3.min( data, d => d[ 1 ]),
        yMax0 = d3.max( data, d => d[ 1 ]),
        xScale = d3.scaleLinear().domain([ xMin0, xMax0 ]).range([ marginAxis + padding, width - padding ]),
        yScale, histogram, bins,
        ref = useRef(),
        xDown, yDown,
        isX = false, isY = false, isMin = false, isMax = false;

    // Create the histogram function.
    histogram = d3.histogram()
        .value( d => d[ 2 ])
        .domain( xScale.domain())
        .thresholds( xScale.ticks( 10 ));

    // Get the bins.
    bins = histogram( data );

    // Get the Y scale.
    yScale = d3.scaleLinear()
        .range([ height - marginAxis, padding ])
        .domain([ 0, d3.max( bins, d => d.length )]);
    
    // Set hook to draw on mounting, or on any other lifecycle update.
    useEffect(() => {
        Histogram.draw( height, width, marginAxis, padding, scrollSize, ref, xScale, yScale, histogram, bins, xMin0, xMax0, yMin0, yMax0, dataSet, 100 );
    });
    
    // Return the component.
    return <div style={{width: width, height: height}} className="parent">
            <svg width={width} height={height} ref={ref} />
        </div>;
};
    
// Draws the points.
Histogram.draw = ( height, width, marginAxis, padding, scrollSize, ref, xScale, yScale, histogram, bins, xMin0, xMax0, yMin0, yMax0, dataSet, size ) => {
    
    // Initialization.
    const svg = d3.select( ref.current ),
        halfScrollSize = scrollSize / 2;
    let data = Data.getValues( dataSet ),
        columnNames = Data.getColumnNames( dataSet );
    svg.selectAll( "*" ).remove();

    // Draw the bars.
    svg.selectAll( "rect" )
        .data( bins )
        .enter()
        .append( "rect" )
        .attr( "x", 1 )
        .attr( "transform", bin => ( "translate( " + xScale( bin.x0 ) + "," + yScale( bin.length ) + " )" ))
        .attr( "width", bin => (( bin.x1 === bin.x0 ) ? 0 : ( xScale( bin.x1 ) - xScale( bin.x0 ) - 1 )))
        .attr( "height", bin => ( height - yScale( bin.length )))
        .style( "fill", "#99bbdd" );
    
    // Draw the X axis.
    svg.append( "rect" )
        .attr( "x", 0 )
        .attr( "y", height - marginAxis )
        .attr( "width", width )
        .attr( "height", marginAxis )
        .style( "fill", "#ffffff" );
    svg.append( "g" )
        .attr( "class", "axis" )
        .attr( "transform", "translate( 0, " + ( height - marginAxis ) + " )" )
        .call( d3.axisBottom( xScale ).ticks( 3 ).tickFormat(( x ) => { return x.toFixed( 1 )}));
    svg.append( "text" )
        .attr( "transform", "translate( " + ( width / 2 ) + " ," + ( height - padding ) + ")" )
        .style( "text-anchor", "middle" )
        .text( columnNames[ 2 ]);
        
    // Draw the Y axis.
    svg.append( "rect" )
        .attr( "x", 0 )
        .attr( "y", 0 )
        .attr( "width", marginAxis )
        .attr( "height", height )
        .style( "fill", "#ffffff" );
    svg.append( "g" )
        .attr( "class", "axis" )
        .attr( "transform", "translate( " + marginAxis + ", 0 )" )
        .call( d3.axisLeft( yScale ).ticks( 3 ).tickFormat(( x ) => { return x.toFixed( 1 )}));
    svg.append( "text" )
        .attr( "x", marginAxis )
        .attr( "y", padding * 0.7 )
        .style( "text-anchor", "middle" )
        .text( "Frequency" );
};

export default Histogram;
