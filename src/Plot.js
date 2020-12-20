import React, { useRef, useEffect, useState }  from 'react';
import { Button, Slider } from '@material-ui/core';
import * as d3 from 'd3';
import Data from './Data';
import './Plot.css';

// Scatter plot in an SVG element.
const Plot = ( props ) => {
    
    // Create state.
    let { dataSet } = props,
        data = Data.getValues( dataSet ),
        [ xRange, setXRange ] = useState([ 0, 1 ]),
        [ yRange, setYRange ] = useState([ 0, 1 ]);
    
    // Create reference and scales.
    const padding = 20, marginAxis = 50, buttonSize = 30, height = 400, width = 400;
    let ref = useRef(),
        xScale = d3.scaleLinear().domain([ d3.min( data, d => d[ 2 ]), d3.max( data, d => d[ 2 ])]).range([ marginAxis + padding, width - padding ]),
        yScale = d3.scaleLinear().domain([ d3.min( data, d => d[ 1 ]), d3.max( data, d => d[ 1 ])]).range([ height - marginAxis - padding, padding ]);
    
    // Set hook to draw on mounting, or on any other lifecycle update.
    useEffect(() => {
        Plot.draw( height, width, marginAxis, padding, ref, xScale, yScale, dataSet, 100 );
    });
    
    // Zoom in or out.
    let onZoom = ( isIn ) => {
            let xDomain = xScale.domain(),
                xMin = xDomain[ 0 ],
                xMax = xDomain[ 1 ],
                xRange = xMax - xMin,
                yDomain = yScale.domain(),
                yMin = yDomain[ 0 ],
                yMax = yDomain[ 1 ],
                yRange = yMax - yMin;
            if( isIn ) {
                xScale.domain([ xMin + xRange / 4, xMax - xRange / 4 ]);
                yScale.domain([ yMin + yRange / 4, yMax - yRange / 4 ]);
            } else {
                xScale.domain([ xMin - xRange / 2, xMax + xRange / 2 ]);
                yScale.domain([ yMin - yRange / 2, yMax + yRange / 2 ]);
            }
            Plot.draw( height, width, marginAxis, padding, ref, xScale, yScale, dataSet, 100 );
        },
        onZoomIn  = () => { onZoom( true  ); },
        onZoomOut = () => { onZoom( false ); };
    
    // Return the component.
    return <div style={{width: width, height: height}} className="parent">
            <svg width={width} height={height} ref={ref}></svg>
            <input type="button" value="+" onClick={onZoomIn } style={{ width: buttonSize, height: buttonSize, top: ( height + 1 - buttonSize ), left: 1 }} />
            <input type="button" value="-" onClick={onZoomOut} style={{ width: buttonSize, height: buttonSize, top: ( height + 1 - buttonSize ), left: 1 + buttonSize }} />
        </div>;
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
        .attr( "transform", "translate( " + ( width / 2 ) + " ," + ( height - padding ) + ")" )
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
        .attr( "y", padding * 1.5 )
        .style( "text-anchor", "middle" )
        .text( columnNames[ 1 ]);
};

export default Plot;
