import React, { useRef, useEffect }  from 'react';
import { Slider } from '@material-ui/core';
import * as d3 from 'd3';
import Data from './Data';
import './Plot.css';

// Scatter plot in an SVG element.
const Plot = ( props ) => {
    
    // Create state.
    let { dataSet } = props,
        data = Data.getValues( dataSet ),
        xMin0 = d3.min( data, d => d[ 2 ]),
        xMax0 = d3.max( data, d => d[ 2 ]),
        yMin0 = d3.min( data, d => d[ 1 ]),
        yMax0 = d3.max( data, d => d[ 1 ]);
    
    // Create reference and scales.
    const padding = 20, marginAxis = 50, buttonSize = 30, height = 400, width = 400;
    let ref = useRef(),
        xScale = d3.scaleLinear().domain([ xMin0, xMax0 ]).range([ marginAxis + padding, width - padding ]),
        yScale = d3.scaleLinear().domain([ yMin0, yMax0 ]).range([ height - marginAxis - padding, padding ]);
    
    // Set hook to draw on mounting, or on any other lifecycle update.
    useEffect(() => {
        Plot.draw( height, width, marginAxis, padding, ref, xScale, yScale, dataSet, 100 );
    });
    
    // Zoom in or out.
    let onZoom = ( isIn ) => {
            const d = 8, f = ( d - 1 ) / ( 2 * d );
            let xDomain = xScale.domain(), xMin = xDomain[ 0 ], xMax = xDomain[ 1 ], xRange = xMax - xMin,
                yDomain = yScale.domain(), yMin = yDomain[ 0 ], yMax = yDomain[ 1 ], yRange = yMax - yMin;
            if( isIn ) {
                xMin = Math.min( xMin0 + ( xMax0 - xMin0 ) * f, xMin + xRange / d );
                xMax = Math.max( xMax0 - ( xMax0 - xMin0 ) * f, xMax - xRange / d );
                yMin = Math.min( yMin0 + ( yMax0 - yMin0 ) * f, yMin + yRange / d );
                yMax = Math.max( yMax0 - ( yMax0 - yMin0 ) * f, yMax - yRange / d );
            } else {
                xMin = Math.max( xMin0, xMin - xRange / ( d - 2 ));
                xMax = Math.min( xMax0, xMax + xRange / ( d - 2 ));
                yMin = Math.max( yMin0, yMin - yRange / ( d - 2 ));
                yMax = Math.min( yMax0, yMax + yRange / ( d - 2 ));
            }
            xScale.domain([ xMin, xMax ]);
            yScale.domain([ yMin, yMax ]);
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
        .call( d3.axisBottom( xScale ).ticks( 3 ).tickFormat(( x ) => { return x.toFixed( 1 )}));
    svg.append( "text" )
        .attr( "transform", "translate( " + ( width / 2 ) + " ," + ( height - padding ) + ")" )
        .style( "text-anchor", "middle" )
        .text( columnNames[ 2 ]);
        
    // Draw the Y axis.
    svg.append( "g" )
        .attr( "class", "axis" )
        .attr( "transform", "translate( " + marginAxis + ", 0 )" )
        .call( d3.axisLeft( yScale ).ticks( 3 ).tickFormat(( x ) => { return x.toFixed( 1 )}));
    svg.append( "text" )
        .attr( "transform", "rotate( -90 )" )
        .attr( "x", -height / 2 )
        .attr( "y", padding * 1.5 )
        .style( "text-anchor", "middle" )
        .text( columnNames[ 1 ]);
};

export default Plot;
