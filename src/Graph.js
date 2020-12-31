import React from 'react';
import * as d3 from 'd3';
import { Slider } from '@material-ui/core';
import './Graph.css';

// Graph in an SVG element.
//
// React functional components don't support inheritance.
// This is the recommended pattern; see https://reactjs.org/docs/composition-vs-inheritance.html#specialization.
const Graph = React.forwardRef(( props, ref ) => {
    
    // Initialization.
    const buttonSize = 30;
    let { width, height, margin, padding, onMouseDown, onMouseUp, onZoom, onGroup } = props;
    
    // Return the component.
    return <div style={{width: width, height: height}} className="parent">
            <svg width={width} height={height} onMouseDown={onMouseDown} onMouseMove={onMouseUp} onMouseUp={onMouseUp} ref={ref} />
            <input type="button" value="+" onClick={()=>onZoom(true )} style={{ width: buttonSize, height: buttonSize, top: ( height + 1 - buttonSize ), left: 1 }} />
            <input type="button" value="-" onClick={()=>onZoom(false)} style={{ width: buttonSize, height: buttonSize, top: ( height + 1 - buttonSize ), left: 1 + buttonSize }} />
            <Slider min={0} max={1} step={0.01} defaultValue={0} onChange={onGroup} style={{ width: width - margin.left - padding.left - margin.right - padding.right + 1, top: height - margin.bottom - 12, left: margin.left + padding.left + 1, position: "absolute", zIndex: 2, display: ( onGroup ? "inline" : "none" )}} />
        </div>;
});

// Width of scroll bar.
Graph.scrollSize = 15;
    
// Zooms in two dimensions.
Graph.onZoom2D = ( isIn, xScale, yScale, xMin0, xMax0, yMin0, yMax0 ) => {
    const d = 8,
        f = ( d - 1 ) / ( 2 * d );
    let xMin = xScale.domain()[ 0 ],
        xMax = xScale.domain()[ 1 ],
        xRange = xMax - xMin,
        yMin = yScale.domain()[ 0 ],
        yMax = yScale.domain()[ 1 ],
        yRange = yMax - yMin;
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
};
    
// Zooms in one dimension.
Graph.onMouseDown = ( event, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, mouseState ) => {
    const scrollSize = Graph.scrollSize,
        endCapSize = 0.8 * scrollSize;
    let xDown = event.nativeEvent.offsetX,
        yDown = event.nativeEvent.offsetY;
    mouseState.isX = false;
    mouseState.isY = false;
    mouseState.isMin = false;
    mouseState.isMax = false;
    if(( margin.left + padding.left <= xDown ) && ( xDown <= width - margin.right - padding.right ) && ( height - scrollSize <= yDown ) && ( yDown <= height )) {
        let w = width - margin.right - padding.right - margin.left - padding.left + 1,
            x0 = margin.left + padding.left + w * ( xScale.domain()[ 0 ] - xMin0 ) / ( xMax0 - xMin0 ),
            x1 = margin.left + padding.left + w * ( xScale.domain()[ 1 ] - xMin0 ) / ( xMax0 - xMin0 );
        mouseState.xDown = xDown;
        mouseState.yDown = yDown;
        mouseState.isX = true;
        if(( x0 <= xDown ) && ( xDown <= x0 + endCapSize )) {
            mouseState.isMin = true;
        } else if(( x1 - endCapSize <= xDown ) && ( xDown <= x1 )) {
            mouseState.isMax = true;
        }
    } else if(( 0 <= xDown ) && ( xDown <= scrollSize ) && ( margin.top + padding.top <= yDown ) && ( yDown <= height - margin.bottom - padding.bottom )) {
        let h = height - margin.bottom - padding.bottom - margin.top - padding.top + 1,
            y0 = margin.top + padding.top + h * ( 1 - ( yScale.domain()[ 0 ] - yMin0 ) / ( yMax0 - yMin0 )),
            y1 = margin.top + padding.top + h * ( 1 - ( yScale.domain()[ 1 ] - yMin0 ) / ( yMax0 - yMin0 ));
        mouseState.xDown = xDown;
        mouseState.yDown = yDown;
        mouseState.isY = true;
        if(( y1 <= yDown ) && ( yDown <= y1 + endCapSize )) {
            mouseState.isMax = true;
        } else if(( y0 - endCapSize <= yDown ) && ( yDown <= y0 )) {
            mouseState.isMin = true;
        }
    }
};
Graph.onMouseUp = ( event, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, mouseState ) => {
    const d = 8;
    let xUp = event.nativeEvent.offsetX,
        yUp = event.nativeEvent.offsetY;
    if( mouseState.isX ) {
        const f = ( xMax0 - xMin0 ) / d;
        let w = width - margin.right - padding.right - margin.left - padding.left + 1,
            dif = ( xMax0 - xMin0 ) * ( xUp - mouseState.xDown ) / w,
            xMin = xScale.domain()[ 0 ],
            xMax = xScale.domain()[ 1 ];
        if( mouseState.isMin ) {
            dif = Math.max( dif, xMin0 - xMin );
            if( dif > xMax - xMin - f ) {
                dif = 0;
            }
            xScale.domain([ xMin + dif, xMax ]);
        } else if( mouseState.isMax ) {
            dif = Math.min( dif, xMax0 - xMax );
            if( dif < f - xMax + xMin ) {
                dif = 0;
            }
            xScale.domain([ xMin, xMax + dif ]);
        } else {
            if( dif === 0 ) {
                let x0 = margin.left + padding.left + w * ( xMin - xMin0 ) / ( xMax0 - xMin0 ),
                    x1 = margin.left + padding.left + w * ( xMax - xMin0 ) / ( xMax0 - xMin0 );
                if( xUp < x0 ) {
                    dif = ( xMax0 - xMin0 ) * ( xUp - x0 ) / w - ( xMax - xMin ) / 2;
                } else if( x1 < xUp ) {
                    dif = ( xMax0 - xMin0 ) * ( xUp - x1 ) / w + ( xMax - xMin ) / 2;
                }
            }
            dif = Math.max( dif, xMin0 - xMin );
            dif = Math.min( dif, xMax0 - xMax );
            xScale.domain([ xMin + dif, xMax + dif ]);
        }
    } else if( mouseState.isY ) {
        const f = ( yMax0 - yMin0 ) / d;
        let h = height - margin.bottom - padding.bottom - margin.top - padding.top + 1,
            dif = ( yMax0 - yMin0 ) * ( mouseState.yDown - yUp ) / h,
            yMin = yScale.domain()[ 0 ],
            yMax = yScale.domain()[ 1 ];
        if( mouseState.isMin ) {
            dif = Math.max( dif, yMin0 - yMin );
            if( dif > yMax - yMin - f ) {
                dif = 0;
            }
            yScale.domain([ yMin + dif, yMax ]);
        } else if( mouseState.isMax ) {
            dif = Math.min( dif, yMax0 - yMax );
            if( dif < f - yMax + yMin ) {
                dif = 0;
            }
            yScale.domain([ yMin, yMax + dif ]);
        } else {
            if( dif === 0 ) {
                let y0 = margin.top + padding.top + h * ( 1 - ( yMin - yMin0 ) / ( yMax0 - yMin0 )),
                    y1 = margin.top + padding.top + h * ( 1 - ( yMax - yMin0 ) / ( yMax0 - yMin0 ));
                if( yUp < y0 ) {
                    dif = ( yMax0 - yMin0 ) * ( y0 - yUp ) / h - ( yMax - yMin ) / 2;
                } else if( y1 < yUp ) {
                    dif = ( yMax0 - yMin0 ) * ( y1 - yUp ) / h + ( yMax - yMin ) / 2;
                }
            }
            dif = Math.max( dif, yMin0 - yMin );
            dif = Math.min( dif, yMax0 - yMax );
            yScale.domain([ yMin + dif, yMax + dif ]);
        }
    }
    if( event.type === "mouseup" ) {
        mouseState.isX = false;
        mouseState.isY = false;
        mouseState.isMin = false;
        mouseState.isMax = false;
    } else {
        mouseState.xDown = xUp;
        mouseState.yDown = yUp;
    }
};
    
// Draws the graph.
Graph.draw = ( ref, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, xLabel, yLabel ) => {
    
    // Initialization.
    const svg = d3.select( ref.current ),
        scrollSize = Graph.scrollSize,
        halfSize = scrollSize / 2;
        
    // Clear the margins.
    svg.append( "rect" )
        .attr( "x", 0 )
        .attr( "y", 0 )
        .attr( "width", width )
        .attr( "height", margin.top )
        .style( "fill", "#ffffff" );
    svg.append( "rect" )
        .attr( "x", width - margin.right )
        .attr( "y", 0 )
        .attr( "width", margin.right )
        .attr( "height", height )
        .style( "fill", "#ffffff" );
    svg.append( "rect" )
        .attr( "x", 0 )
        .attr( "y", height - margin.bottom )
        .attr( "width", width )
        .attr( "height", margin.bottom )
        .style( "fill", "#ffffff" );
    svg.append( "rect" )
        .attr( "x", 0 )
        .attr( "y", 0 )
        .attr( "width", margin.left )
        .attr( "height", height )
        .style( "fill", "#ffffff" );
    
    // Draw the X axis.
    svg.append( "g" )
        .attr( "class", "axis" )
        .attr( "transform", "translate( 0, " + ( height - margin.bottom ) + " )" )
        .call( d3.axisBottom( xScale ).ticks( 3 ).tickFormat(( x ) => { return x.toFixed( 1 )}));
    svg.append( "text" )
        .attr( "transform", "translate( " + ( width / 2 ) + " ," + ( height - 1.5 * scrollSize ) + ")" )
        .style( "text-anchor", "middle" )
        .text( xLabel );
        
    // Draw the Y axis.
    svg.append( "g" )
        .attr( "class", "axis" )
        .attr( "transform", "translate( " + margin.left + ", 0 )" )
        .call( d3.axisLeft( yScale ).ticks( 3 ).tickFormat(( x ) => { return x.toFixed( 1 )}));
    svg.append( "text" )
        .attr( "x", margin.left )
        .attr( "y", margin.top + padding.top * 0.7 )
        .style( "text-anchor", "middle" )
        .text( yLabel );
    
    // Draw the X scrollbar.
    let x = margin.left + padding.left,
        w = width - margin.right - padding.right - x + 1,
        xMin = x + w * ( xScale.domain()[ 0 ] - xMin0 ) / ( xMax0 - xMin0 ),
        xMax = x + w * ( xScale.domain()[ 1 ] - xMin0 ) / ( xMax0 - xMin0 );
    svg.append( "rect" )
        .attr( "x", x )
        .attr( "y", height - scrollSize )
        .attr( "width", w )
        .attr( "height", scrollSize )
        .style( "fill", "#eeeeee" );
    svg.append( "line" )
        .attr( "x1", xMin + halfSize )
        .attr( "y1", height - halfSize )
        .attr( "x2", xMax - halfSize )
        .attr( "y2", height - halfSize )
        .style( "stroke-width", scrollSize )
        .style( "stroke", "#cccccc" )
        .style( "stroke-linecap", "round" );
    svg.append( "line" )
        .attr( "x1", xMin + halfSize + 1 )
        .attr( "y1", height - scrollSize )
        .attr( "x2", xMin + halfSize + 1 )
        .attr( "y2", height )
        .style( "stroke-width", 1 )
        .style( "stroke", "#ffffff" );
    svg.append( "line" )
        .attr( "x1", xMax - halfSize - 1 )
        .attr( "y1", height - scrollSize )
        .attr( "x2", xMax - halfSize - 1 )
        .attr( "y2", height )
        .style( "stroke-width", 1 )
        .style( "stroke", "#ffffff" );
        
    // Draw the Y scrollbar.
    let y = margin.top + padding.top,
        h = height - margin.bottom - padding.bottom - y + 1,
        yMin = y + h * ( 1 - ( yScale.domain()[ 0 ] - yMin0 ) / ( yMax0 - yMin0 )),
        yMax = y + h * ( 1 - ( yScale.domain()[ 1 ] - yMin0 ) / ( yMax0 - yMin0 ));
    svg.append( "rect" )
        .attr( "x", 0 )
        .attr( "y", y )
        .attr( "width", scrollSize )
        .attr( "height", h )
        .style( "fill", "#eeeeee" );
    svg.append( "line" )
        .attr( "x1", halfSize )
        .attr( "y1", yMax + halfSize )
        .attr( "x2", halfSize )
        .attr( "y2", yMin - halfSize )
        .style( "stroke-width", scrollSize )
        .style( "stroke", "#cccccc" )
        .style( "stroke-linecap", "round" );
    svg.append( "line" )
        .attr( "x1", 0 )
        .attr( "y1", yMax + halfSize + 1 )
        .attr( "x2", scrollSize )
        .attr( "y2", yMax + halfSize + 1 )
        .style( "stroke-width", 1 )
        .style( "stroke", "#ffffff" );
    svg.append( "line" )
        .attr( "x1", 0 )
        .attr( "y1", yMin - halfSize - 1 )
        .attr( "x2", scrollSize )
        .attr( "y2", yMin - halfSize - 1 )
        .style( "stroke-width", 1 )
        .style( "stroke", "#ffffff" );
};

export default Graph;
