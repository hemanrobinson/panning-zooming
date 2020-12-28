import React from 'react';
import * as d3 from 'd3';
import './Graph.css';

// Graph in an SVG element.
const Graph = React.forwardRef(( props, ref ) => {
    
    // Initialization.
    const buttonSize = 30;
    let { width, height, onMouseDown, onMouseUp, onZoomIn, onZoomOut } = props;
    
    // Return the component.
    return <div style={{width: width, height: height}} className="parent">
            <svg width={width} height={height} onMouseDown={onMouseDown} onMouseMove={onMouseUp} onMouseUp={onMouseUp} ref={ref} />
            <input type="button" value="+" onClick={onZoomIn } style={{ width: buttonSize, height: buttonSize, top: ( height + 1 - buttonSize ), left: 1 }} />
            <input type="button" value="-" onClick={onZoomOut} style={{ width: buttonSize, height: buttonSize, top: ( height + 1 - buttonSize ), left: 1 + buttonSize }} />
        </div>;
});
    
// Zooms in two dimensions.
Graph.onZoom2D = ( xScale, yScale, xMin0, xMax0, yMin0, yMax0, isIn ) => {
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
};
    
// Zooms in one dimension.
Graph.onMouseDown = ( height, width, margin, padding, scrollSize, xScale, yScale, xMin0, xMax0, yMin0, yMax0, event, mouseState ) => {
    const endCapSize = 0.8 * scrollSize;
    let x0 = event.nativeEvent.offsetX, y0 = event.nativeEvent.offsetY,
    x = margin.left + padding.left,
    y = margin.top + padding.top,
    w = width - margin.right - padding.right - x + 1,
    h = height - margin.bottom - padding.bottom - y + 1,
    xMin = x + w * ( xScale.domain()[ 0 ] - xMin0 ) / ( xMax0 - xMin0 ),
    xMax = x + w * ( xScale.domain()[ 1 ] - xMin0 ) / ( xMax0 - xMin0 ),
    yMin = y + h * ( 1 - ( yScale.domain()[ 0 ] - yMin0 ) / ( yMax0 - yMin0 )),
    yMax = y + h * ( 1 - ( yScale.domain()[ 1 ] - yMin0 ) / ( yMax0 - yMin0 ));
    mouseState.isX = false;
    mouseState.isY = false;
    mouseState.isMin = false;
    mouseState.isMax = false;
    if(( margin.left + padding.left <= x0 ) && ( x0 <= width - margin.right - padding.right ) && ( height - scrollSize <= y0 ) && ( y0 <= height )) {
        mouseState.xDown = x0;
        mouseState.yDown = y0;
        mouseState.isX = true;
        if( x0 < xMin + endCapSize ) {
            mouseState.isMin = true;
        } else if( x0 > xMax - endCapSize ) {
            mouseState.isMax = true;
        }
    } else if(( 0 <= x0 ) && ( x0 <= scrollSize ) && ( margin.top + padding.top <= y0 ) && ( y0 <= height - margin.bottom - padding.bottom )) {
        mouseState.xDown = x0;
        mouseState.yDown = y0;
        mouseState.isY = true;
        if( y0 < yMax + endCapSize ) {
            mouseState.isMax = true;
        } else if( y0 > yMin - endCapSize ) {
            mouseState.isMin = true;
        }
    }
};
Graph.onMouseUp = ( height, width, margin, padding, scrollSize, xScale, yScale, xMin0, xMax0, yMin0, yMax0, event, mouseState ) => {
    let xUp = event.nativeEvent.offsetX, yUp = event.nativeEvent.offsetY;
    if( mouseState.isX ) {
        let dif = ( xMax0 - xMin0 ) * ( xUp - mouseState.xDown ) / ( width - margin.right - padding.right - margin.left - padding.left + 1 ),
            xMin = xScale.domain()[ 0 ], xMax = xScale.domain()[ 1 ];
        if( mouseState.isMin ) {
            dif = Math.max( dif, xMin0 - xMin );
            xScale.domain([ xMin + dif, xMax ]);
        } else if( mouseState.isMax ) {
            dif = Math.min( dif, xMax0 - xMax );
            xScale.domain([ xMin, xMax + dif ]);
        } else {
            dif = Math.max( dif, xMin0 - xMin );
            dif = Math.min( dif, xMax0 - xMax );
            xScale.domain([ xMin + dif, xMax + dif ]);
        }
    } else if( mouseState.isY ) {
        let dif = ( yMax0 - yMin0 ) * ( mouseState.yDown - yUp ) / ( height - margin.bottom - padding.bottom - margin.top - padding.top + 1 ),
            yMin = yScale.domain()[ 0 ], yMax = yScale.domain()[ 1 ];;
        if( mouseState.isMin ) {
            dif = Math.max( dif, yMin0 - yMin );
            yScale.domain([ yMin + dif, yMax ]);
        } else if( mouseState.isMax ) {
            dif = Math.min( dif, yMax0 - yMax );
            yScale.domain([ yMin, yMax + dif ]);
        } else {
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
Graph.draw = ( ref, height, width, margin, padding, scrollSize, xScale, yScale, xMin0, xMax0, yMin0, yMax0, xLabel, yLabel, size ) => {
    
    // Initialization.
    const svg = d3.select( ref.current ),
        halfScrollSize = scrollSize / 2;
        
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
        .attr( "transform", "translate( " + ( width / 2 ) + " ," + ( height - padding.bottom ) + ")" )
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

export default Graph;
