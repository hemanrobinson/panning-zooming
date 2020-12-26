import React, { useRef, useEffect }  from 'react';
//import { Slider } from '@material-ui/core';
import * as d3 from 'd3';
import Data from './Data';
import './Plot.css';

// Scatter plot in an SVG element.
const Plot = ( props ) => {
    
    // Initialization.
    const padding = 20, marginAxis = 50, buttonSize = 30, scrollSize = 15, height = 400, width = 400;
    let { dataSet } = props,
        data = Data.getValues( dataSet ),
        xMin0 = d3.min( data, d => d[ 2 ]),
        xMax0 = d3.max( data, d => d[ 2 ]),
        yMin0 = d3.min( data, d => d[ 1 ]),
        yMax0 = d3.max( data, d => d[ 1 ]),
        xScale = d3.scaleLinear().domain([ xMin0, xMax0 ]).range([ marginAxis + padding, width - padding ]),
        yScale = d3.scaleLinear().domain([ yMin0, yMax0 ]).range([ height - marginAxis - padding, padding ]),
        ref = useRef(),
        xDown, yDown,
        isX = false, isY = false, isMin = false, isMax = false;
    
    // Zoom in two dimensions.
    let onZoom2D = ( isIn ) => {
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
        Plot.draw( height, width, marginAxis, padding, scrollSize, ref, xScale, yScale, xMin0, xMax0, yMin0, yMax0, dataSet, 100 );
    },
    onZoomIn  = () => { onZoom2D( true  ); },
    onZoomOut = () => { onZoom2D( false ); };
    
    // Zoom in one dimension.
    let onMouseDown = ( event ) => {
        const endCapSize = 0.8 * scrollSize;
        let x0 = event.nativeEvent.offsetX, y0 = event.nativeEvent.offsetY,
        x = marginAxis + padding,
        y = padding,
        w = width - padding - x + 1,
        h = height - marginAxis - padding - y + 1,
        xMin = x + w * ( xScale.domain()[ 0 ] - xMin0 ) / ( xMax0 - xMin0 ),
        xMax = x + w * ( xScale.domain()[ 1 ] - xMin0 ) / ( xMax0 - xMin0 ),
        yMin = y + h * ( 1 - ( yScale.domain()[ 0 ] - yMin0 ) / ( yMax0 - yMin0 )),
        yMax = y + h * ( 1 - ( yScale.domain()[ 1 ] - yMin0 ) / ( yMax0 - yMin0 ));
        xDown = undefined;
        yDown = undefined;
        isX = false;
        isY = false;
        isMin = false;
        isMax = false;
        if(( marginAxis + padding <= x0 ) && ( x0 <= width - padding ) && ( height - scrollSize <= y0 ) && ( y0 <= height )) {
            xDown = x0;
            yDown = y0;
            isX = true;
            if( x0 < xMin + endCapSize ) {
                isMin = true;
            } else if( x0 > xMax - endCapSize ) {
                isMax = true;
            }
        } else if(( 0 <= x0 ) && ( x0 <= scrollSize ) && ( padding <= y0 ) && ( y0 <= height - marginAxis - padding )) {
            xDown = x0;
            yDown = y0;
            isY = true;
            if( y0 < yMax + endCapSize ) {
                isMax = true;
            } else if( y0 > yMin - endCapSize ) {
                isMin = true;
            }
        }
    },
    onMouseUp = ( event ) => {
        let xUp = event.nativeEvent.offsetX, yUp = event.nativeEvent.offsetY;
        if( isX ) {
            let x = marginAxis + padding,
                w = width - padding - x + 1,
                dif = ( xUp - xDown ) * ( xScale.domain()[ 1 ] - xScale.domain()[ 0 ]) / ( w - x );
            if( isMin ) {
                xScale.domain([ Math.max( xMin0, xScale.domain()[ 0 ] + dif ), xScale.domain()[ 1 ]]);
            } else if( isMax ) {
                xScale.domain([ xScale.domain()[ 0 ], Math.min( xMax0, xScale.domain()[ 1 ] + dif )]);
            } else {
                xScale.domain([ Math.max( xMin0, xScale.domain()[ 0 ] + dif ), Math.min( xMax0, xScale.domain()[ 1 ] + dif )]);
            }
            Plot.draw( height, width, marginAxis, padding, scrollSize, ref, xScale, yScale, xMin0, xMax0, yMin0, yMax0, dataSet, 100 );
        } else if( isY ) {
            let y = padding,
                h = height - marginAxis - padding - y + 1,
                dif = ( yDown - yUp ) * ( yScale.domain()[ 1 ] - yScale.domain()[ 0 ]) / ( h - y );
            if( isMin ) {
                yScale.domain([ Math.max( yMin0, yScale.domain()[ 0 ] + dif ), yScale.domain()[ 1 ]]);
            } else if( isMax ) {
                yScale.domain([ yScale.domain()[ 0 ], Math.min( yMax0, yScale.domain()[ 1 ] + dif )]);
            } else {
                yScale.domain([ Math.max( yMin0, yScale.domain()[ 0 ] + dif ), Math.min( yMax0, yScale.domain()[ 1 ] + dif )]);
            }
            Plot.draw( height, width, marginAxis, padding, scrollSize, ref, xScale, yScale, xMin0, xMax0, yMin0, yMax0, dataSet, 100 );
        }
        if( event.type === "mouseup" ) {
            isX = false;
            isY = false;
            isMin = false;
            isMax = false;
        } else {
            xDown = xUp;
            yDown = yUp;
        }
    };
    
    // Set hook to draw on mounting, or on any other lifecycle update.
    useEffect(() => {
        Plot.draw( height, width, marginAxis, padding, scrollSize, ref, xScale, yScale, xMin0, xMax0, yMin0, yMax0, dataSet, 100 );
    });
    
    // Return the component.
    return <div style={{width: width, height: height}} className="parent">
            <svg width={width} height={height} ref={ref} onMouseDown={onMouseDown} onMouseMove={onMouseUp} onMouseUp={onMouseUp} />
            <input type="button" value="+" onClick={onZoomIn } style={{ width: buttonSize, height: buttonSize, top: ( height + 1 - buttonSize ), left: 1 }} />
            <input type="button" value="-" onClick={onZoomOut} style={{ width: buttonSize, height: buttonSize, top: ( height + 1 - buttonSize ), left: 1 + buttonSize }} />
        </div>;
};
    
// Draws the points.
Plot.draw = ( height, width, marginAxis, padding, scrollSize, ref, xScale, yScale, xMin0, xMax0, yMin0, yMax0, dataSet, size ) => {
    
    // Initialization.
    const svg = d3.select( ref.current ),
        halfScrollSize = scrollSize / 2;
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
        .text( columnNames[ 1 ]);
    
    // Draw the X scrollbar.
    let x = marginAxis + padding,
        w = width - padding - x + 1,
        xMin = x + w * ( xScale.domain()[ 0 ] - xMin0 ) / ( xMax0 - xMin0 ),
        xMax = x + w * ( xScale.domain()[ 1 ] - xMin0 ) / ( xMax0 - xMin0 );
    svg.append( "rect" )
        .attr( "x", x )
        .attr( "y", height - scrollSize )
        .attr( "width", w )
        .attr( "height", scrollSize )
        .style( "fill", "#eeeeee" );
    svg.append( "line" )
        .attr( "x1", xMin + halfScrollSize )
        .attr( "y1", height - halfScrollSize )
        .attr( "x2", xMax - halfScrollSize )
        .attr( "y2", height - halfScrollSize )
        .style( "stroke-width", scrollSize )
        .style( "stroke", "#cccccc" )
        .style( "stroke-linecap", "round" );
    svg.append( "line" )
        .attr( "x1", xMin + halfScrollSize + 1 )
        .attr( "y1", height - scrollSize )
        .attr( "x2", xMin + halfScrollSize + 1 )
        .attr( "y2", height )
        .style( "stroke-width", 1 )
        .style( "stroke", "#ffffff" );
    svg.append( "line" )
        .attr( "x1", xMax - halfScrollSize - 1 )
        .attr( "y1", height - scrollSize )
        .attr( "x2", xMax - halfScrollSize - 1 )
        .attr( "y2", height )
        .style( "stroke-width", 1 )
        .style( "stroke", "#ffffff" );
        
    // Draw the Y scrollbar.
    let y = padding,
        h = height - marginAxis - padding - y + 1,
        yMin = y + h * ( 1 - ( yScale.domain()[ 0 ] - yMin0 ) / ( yMax0 - yMin0 )),
        yMax = y + h * ( 1 - ( yScale.domain()[ 1 ] - yMin0 ) / ( yMax0 - yMin0 ));
    svg.append( "rect" )
        .attr( "x", 0 )
        .attr( "y", y )
        .attr( "width", scrollSize )
        .attr( "height", h )
        .style( "fill", "#eeeeee" );
    svg.append( "line" )
        .attr( "x1", halfScrollSize )
        .attr( "y1", yMax + halfScrollSize )
        .attr( "x2", halfScrollSize )
        .attr( "y2", yMin - halfScrollSize )
        .style( "stroke-width", scrollSize )
        .style( "stroke", "#cccccc" )
        .style( "stroke-linecap", "round" );
    svg.append( "line" )
        .attr( "x1", 0 )
        .attr( "y1", yMax + halfScrollSize + 1 )
        .attr( "x2", scrollSize )
        .attr( "y2", yMax + halfScrollSize + 1 )
        .style( "stroke-width", 1 )
        .style( "stroke", "#ffffff" );
    svg.append( "line" )
        .attr( "x1", 0 )
        .attr( "y1", yMin - halfScrollSize - 1 )
        .attr( "x2", scrollSize )
        .attr( "y2", yMin - halfScrollSize - 1 )
        .style( "stroke-width", 1 )
        .style( "stroke", "#ffffff" );
};

export default Plot;
