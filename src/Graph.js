import React from 'react';
import * as d3 from 'd3';
import { Slider } from '@material-ui/core';
import './Graph.css';

// Graph in an SVG element.
//
// React functional components don't support inheritance; this is the recommended pattern:
//    https://reactjs.org/docs/composition-vs-inheritance.html#specialization
const Graph = React.forwardRef(( props, ref ) => {
    
    // Initialization.
    const buttonSize = 30, sliderOffset = 12;
    let { width, height, margin, padding, isZoomable, onMouseOver, onMouseOut, onMouseDown, onMouseUp, onZoom, onXGroup, onYGroup } = props,
        top    = margin.top    + padding.top,
        right  = margin.right  + padding.right,
        bottom = margin.bottom + padding.bottom,
        left   = margin.left   + padding.left;
    isZoomable = ( isZoomable === "false" ) ? false : true;
    
    // Return the component.
    return <div style={{width: width, height: height}} className="parent">
            <svg width={width} height={height} isZoomable={isZoomable} onMouseOver={onMouseOver} onMouseOut={onMouseOut} onMouseDown={onMouseDown} onMouseMove={onMouseUp} onMouseUp={onMouseUp} ref={ref} />
            <input type="button" value="+" onClick={()=>onZoom(true )}
                style={{ width: buttonSize, height: buttonSize, top: ( height + 1 - buttonSize ), left: 1,
                display: ( isZoomable ? "inline" : "none" )}} />
            <input type="button" value="-" onClick={()=>onZoom(false)}
                style={{ width: buttonSize, height: buttonSize, top: ( height + 1 - buttonSize ), left: 1 + buttonSize,
                display: ( isZoomable ? "inline" : "none" )}} />
            <Slider min={0} max={1} step={0.01} defaultValue={0} onChange={onXGroup}
                style={{ width: width - left - right + 1, top: height - margin.bottom - sliderOffset, left: left + 1, position: "absolute",
                display: (( isZoomable && onXGroup ) ? "inline" : "none" )}} />
            <Slider min={0} max={1} step={0.01} defaultValue={0} onChange={onYGroup}  orientation="vertical"
                style={{ height: height - top - bottom + 1, top: top + 1, left: margin.left - sliderOffset - 1, position: "absolute",
                display: (( isZoomable && onYGroup ) ? "inline" : "none" )}} />
       </div>;
});

// Width of scroll bar.
Graph.scrollSize = 15;

// Returns initial and current domains.
Graph.getDomains = ( xDomain0, yDomain0, xDomain, yDomain, isXOrdinal, isYOrdinal ) => {
    let domains = {};
    if( isXOrdinal ) {
        domains.xMin0 = 0;
        domains.xMax0 = xDomain0.length - 1;
        domains.xMin = xDomain0.indexOf( xDomain[ 0 ]);
        domains.xMax = xDomain0.indexOf( xDomain[ xDomain.length - 1 ]);
        domains.xD = 1;
    } else {
        domains.xMin0 = xDomain0[ 0 ];
        domains.xMax0 = xDomain0[ 1 ];
        domains.xMin = xDomain[ 0 ];
        domains.xMax = xDomain[ 1 ];
        domains.xD = 0;
    }
    if( isYOrdinal ) {
        domains.yMin0 = 0;
        domains.yMax0 = yDomain0.length - 1;
        domains.yMin = yDomain0.indexOf( yDomain[ 0 ]);
        domains.yMax = yDomain0.indexOf( yDomain[ yDomain.length - 1 ]);
        domains.yD = 1;
    } else {
        domains.yMin0 = yDomain0[ 0 ];
        domains.yMax0 = yDomain0[ 1 ];
        domains.yMin = yDomain[ 0 ];
        domains.yMax = yDomain[ 1 ];
        domains.yD = 0;
    }
    return domains;
}
    
// Zooms in two dimensions.
Graph.onZoom2D = ( isIn, xScale, yScale, xDomain0, yDomain0 ) => {

    // Initialization.
    const d = 8,
        f = ( d - 1 ) / ( 2 * d );
    let xDomain = xScale.domain(),
        yDomain = yScale.domain(),
        { xMin0, xMax0, yMin0, yMax0, xMin, xMax, yMin, yMax, xD, yD } = Graph.getDomains( xDomain0, yDomain0, xDomain, yDomain, !!xScale.bandwidth, !!yScale.bandwidth );
        
    // Calculate scales for zoom in...
    if( isIn ) {
        xMin = Math.min( xMin0 + ( xMax0 - xMin0 + xD ) * f, xMin + ( xMax - xMin + xD ) / d );
        xMax = Math.max( xMax0 - ( xMax0 - xMin0 + xD ) * f, xMax - ( xMax - xMin + xD ) / d );
        yMin = Math.min( yMin0 + ( yMax0 - yMin0 + yD ) * f, yMin + ( yMax - yMin + yD ) / d );
        yMax = Math.max( yMax0 - ( yMax0 - yMin0 + yD ) * f, yMax - ( yMax - yMin + yD ) / d );
        if( xScale.bandwidth ) {
            xMin = Math.ceil( xMin );
            xMax = Math.floor( xMax );
            if( xMin > xMax ) {
                xMin = xDomain0.indexOf( xDomain[ 0 ]);
                xMax = xMin;
            }
        }
        if( yScale.bandwidth ) {
            yMin = Math.ceil( yMin );
            yMax = Math.floor( yMax );
            if( yMin > yMax ) {
                yMin = yDomain0.indexOf( yDomain[ 0 ]);
                yMax = yMin;
            }
        }
    }
    
    // ...or for zoom out.
    else {
        xMin = Math.max( xMin0, xMin - ( xMax - xMin + xD ) / ( d - 2 ));
        xMax = Math.min( xMax0, xMax + ( xMax - xMin + xD ) / ( d - 2 ));
        yMin = Math.max( yMin0, yMin - ( yMax - yMin + yD ) / ( d - 2 ));
        yMax = Math.min( yMax0, yMax + ( yMax - yMin + yD ) / ( d - 2 ));
        if( xScale.bandwidth ) {
            xMin = Math.floor( xMin );
            xMax = Math.ceil( xMax );
            if( xMax < xMin ) {
                xMax = xDomain0.indexOf( xDomain[ xDomain.length - 1 ]);
                xMin = xMax;
            }
        }
        if( yScale.bandwidth ) {
            yMin = Math.floor( yMin );
            yMax = Math.ceil( yMax );
            if( yMax < yMin ) {
                yMax = yDomain0.indexOf( yDomain[ yDomain.length - 1 ]);
                yMin = yMax;
            }
        }
    }
    
    // Assign the new scales.
    if( xScale.bandwidth ) {
        xScale.domain( xDomain0.slice( xMin, xMax + 1 ));
    } else {
        xScale.domain([ xMin, xMax ]);
    }
    if( yScale.bandwidth ) {
        yScale.domain( yDomain0.slice( yMin, yMax + 1 ));
    } else {
        yScale.domain([ yMin, yMax ]);
    }
};
    
// Zooms in one dimension: mousedown event.
Graph.onMouseDown = ( event, height, width, margin, padding, xScale, yScale, xDomain0, yDomain0, downLocation ) => {

    // Initialization.
    const scrollSize = Graph.scrollSize,
        endCapSize = 0.8 * scrollSize;
    let top    = margin.top    + padding.top,
        right  = margin.right  + padding.right,
        bottom = margin.bottom + padding.bottom,
        left   = margin.left   + padding.left,
        xDown = event.nativeEvent.offsetX,
        yDown = event.nativeEvent.offsetY,
        xDomain = xScale.domain(),
        yDomain = yScale.domain(),
        { xMin0, xMax0, yMin0, yMax0, xMin, xMax, yMin, yMax, xD, yD } = Graph.getDomains( xDomain0, yDomain0, xDomain, yDomain, !!xScale.bandwidth, !!yScale.bandwidth );
        
    // Prevent text selection.
    event.preventDefault();
        
    // Reset the mousedown coordinates.
    downLocation.x = xDown;
    downLocation.y = yDown;
    downLocation.xDomain = [];
    downLocation.yDomain = [];
    downLocation.isX = false;
    downLocation.isY = false;
    downLocation.isMin = false;
    downLocation.isMax = false;
    
    // Handle event on X scrollbar...
    if(( left <= xDown ) && ( xDown <= width - right ) && ( height - scrollSize <= yDown ) && ( yDown <= height )) {
        let w = width - right - left + 1,
            x0 = left + w * ( xMin - xMin0      ) / ( xMax0 - xMin0 + xD ),
            x1 = left + w * ( xMax - xMin0 + xD ) / ( xMax0 - xMin0 + xD );
        downLocation.xDomain = xScale.domain();
        downLocation.isX = true;
        if(( x0 <= xDown ) && ( xDown <= x0 + endCapSize )) {
            downLocation.isMin = true;
        } else if(( x1 - endCapSize <= xDown ) && ( xDown <= x1 )) {
            downLocation.isMax = true;
        }
    }
    
    // ...or handle event on Y scrollbar.
    else if(( 0 <= xDown ) && ( xDown <= scrollSize ) && ( top <= yDown ) && ( yDown <= height - bottom )) {
        let h = height - bottom - top + 1,
            y0 = top + h * ( 1 - ( yMin - yMin0      ) / ( yMax0 - yMin0 + yD )),
            y1 = top + h * ( 1 - ( yMax - yMin0 + yD ) / ( yMax0 - yMin0 + yD ));
        downLocation.yDomain = yScale.domain();
        downLocation.isY = true;
        if(( y1 <= yDown ) && ( yDown <= y1 + endCapSize )) {
            downLocation.isMax = true;
        } else if(( y0 - endCapSize <= yDown ) && ( yDown <= y0 )) {
            downLocation.isMin = true;
        }
    }
};
    
// Zooms in one dimension: mousemove and mouseup events.
Graph.onMouseUp = ( event, height, width, margin, padding, xScale, yScale, xDomain0, yDomain0, downLocation ) => {

    // Initialization.
    const d = 8;
    let top    = margin.top    + padding.top,
        right  = margin.right  + padding.right,
        bottom = margin.bottom + padding.bottom,
        left   = margin.left   + padding.left,
        xUp = event.nativeEvent.offsetX,
        yUp = event.nativeEvent.offsetY,
        xDomain = downLocation.xDomain,
        yDomain = downLocation.yDomain,
        { xMin0, xMax0, yMin0, yMax0, xMin, xMax, yMin, yMax, xD, yD } = Graph.getDomains( xDomain0, yDomain0, xDomain, yDomain, !!xScale.bandwidth, !!yScale.bandwidth );
    
    // Handle event on X scrollbar...
    if( downLocation.isX ) {
    
        // Calculate the difference.
        const f = ( xMax0 - xMin0 + xD ) / d;
        let w = width - right - left + 1,
            dif = ( xMax0 - xMin0 + xD ) * ( xUp - downLocation.x ) / w;
        if( xScale.bandwidth ) {
            dif = Math.round( dif );
        }
        
        // Handle drag on minimum handle...
        if( downLocation.isMin ) {
            dif = Math.max( dif, xMin0 - xMin );
            if( dif <= xMax - xMin + xD - f ) {
                if( xScale.bandwidth ) {
                    xScale.domain( xDomain0.slice( xMin + dif, xMax + xD ));
                } else {
                    xScale.domain([ xMin + dif, xMax ]);
                }
            }
        }
        
        // ...or handle drag on maximum handle...
        else if( downLocation.isMax ) {
            dif = Math.min( dif, xMax0 - xMax );
            if( dif >= f - ( xMax - xMin + xD )) {
                if( xScale.bandwidth ) {
                    xScale.domain( xDomain0.slice( xMin, xMax + dif + xD ));
                } else {
                    xScale.domain([ xMin, xMax + dif ]);
                }
            }
        }
        
        // ...or handle drag on thumb or click on track.
        else {
        
            // Adjust for click on track.
            if( dif === 0 ) {
                let x0 = left + w * ( xMin - xMin0      ) / ( xMax0 - xMin0 + xD ),
                    x1 = left + w * ( xMax - xMin0 + xD ) / ( xMax0 - xMin0 + xD );
                if( xUp < x0 ) {
                    dif = ( xMax0 - xMin0 + xD ) * ( xUp - x0 ) / w - ( xMax - xMin + xD ) / 2;
                } else if( x1 < xUp ) {
                    dif = ( xMax0 - xMin0 + xD ) * ( xUp - x1 ) / w + ( xMax - xMin + xD ) / 2;
                }
            }
            
            // Handle drag or click.
            dif = Math.max( dif, xMin0 - xMin );
            dif = Math.min( dif, xMax0 - xMax );
            if( xScale.bandwidth ) {
                xScale.domain( xDomain0.slice( xMin + dif, xMax + dif + xD ));
            } else {
                xScale.domain([ xMin + dif, xMax + dif ]);
            }
        }
    }
    
    // ...or handle event on Y scrollbar.
    else if( downLocation.isY ) {
    
        // Calculate the difference.
        const f = ( yMax0 - yMin0 + yD ) / d;
        let h = height - bottom - top + 1,
            dif = ( yMax0 - yMin0 + yD ) * ( downLocation.y - yUp ) / h;
        if( yScale.bandwidth ) {
            dif = Math.round( dif );
        }
            
        // Handle drag on minimum handle...
        if( downLocation.isMin ) {
            dif = Math.max( dif, yMin0 - yMin );
            if( dif <= yMax - yMin + yD - f ) {
                if( yScale.bandwidth ) {
                    yScale.domain( yDomain0.slice( yMin + dif, yMax + yD ));
                } else {
                    yScale.domain([ yMin + dif, yMax ]);
                }
            }
        }
        
        // ...or handle drag on maximum handle...
        else if( downLocation.isMax ) {
            dif = Math.min( dif, yMax0 - yMax );
            if( dif >= f - ( yMax - yMin + yD )) {
                if( yScale.bandwidth ) {
                    yScale.domain( yDomain0.slice( yMin, yMax + dif + yD ));
                } else {
                    yScale.domain([ yMin, yMax + dif ]);
                }
            }
        }
        
        // ...or handle drag on thumb or click on track.
        else {
        
            // Adjust for click on track.
            if( dif === 0 ) {
                let y0 = top + h * ( 1 - ( yMin - yMin0      ) / ( yMax0 - yMin0 + yD )),
                    y1 = top + h * ( 1 - ( yMax - yMin0 + yD ) / ( yMax0 - yMin0 + yD ));
                if( yUp < y0 ) {
                    dif = ( yMax0 - yMin0 + yD ) * ( y0 - yUp ) / h - ( yMax - yMin + yD ) / 2;
                } else if( y1 < yUp ) {
                    dif = ( yMax0 - yMin0 + yD ) * ( y1 - yUp ) / h + ( yMax - yMin + yD ) / 2;
                }
            }
            
            // Handle drag or click.
            dif = Math.max( dif, yMin0 - yMin );
            dif = Math.min( dif, yMax0 - yMax );
            if( yScale.bandwidth ) {
                yScale.domain( yDomain0.slice( yMin + dif, yMax + dif + yD ));
            } else {
                yScale.domain([ yMin + dif, yMax + dif ]);
            }
        }
    }
        
    // Reset the mousedown coordinates.
    if(( downLocation.isX || downLocation.isY ) && ( event.type === "mouseup" )) {
        downLocation.isX = false;
        downLocation.isY = false;
        downLocation.isMin = false;
        downLocation.isMax = false;
    }
};
    
// Draws the graph.
Graph.draw = ( ref, height, width, margin, padding, isZoomable, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel ) => {
    
    // Initialization.
    const svg = d3.select( ref.current ),
        scrollSize = Graph.scrollSize,
        halfSize = scrollSize / 2;
    let xDomain = xScale.domain(),
        yDomain = yScale.domain(),
        { xMin0, xMax0, yMin0, yMax0, xMin, xMax, yMin, yMax, xD, yD } = Graph.getDomains( xDomain0, yDomain0, xDomain, yDomain, !!xScale.bandwidth, !!yScale.bandwidth );
        
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
        .attr( "class", ( margin.bottom > 50 ) ? "axisRotated" : "axis" )
        .attr( "transform", "translate( 0, " + ( height - margin.bottom ) + " )" )
        .call( d3.axisBottom( xScale ).ticks( 3 ));
    svg.append( "text" )
        .attr( "transform", "translate( " + ( width / 2 ) + " ," + ( height - 1.5 * scrollSize ) + ")" )
        .style( "text-anchor", "middle" )
        .text( xLabel );
        
    // Draw the Y axis.
    svg.append( "g" )
        .attr( "class", "axis" )
        .attr( "transform", "translate( " + margin.left + ", 0 )" )
        .call( d3.axisLeft( yScale ).ticks( 3 ));
    svg.append( "text" )
        .attr( "x", margin.left )
        .attr( "y", margin.top + padding.top * 0.7 )
        .style( "text-anchor", "middle" )
        .text( yLabel );
    
    // If zoomable, draw the scrollbars.
    if( isZoomable ) {
    
        // Draw the X scrollbar.
        let x = margin.left + padding.left,
            w = width - margin.right - padding.right - x + 1,
            x1 = x + w * ( xMin - xMin0      ) / ( xMax0 - xMin0 + xD ),
            x2 = x + w * ( xMax - xMin0 + xD ) / ( xMax0 - xMin0 + xD );
        svg.append( "rect" )
            .attr( "x", x )
            .attr( "y", height - scrollSize )
            .attr( "width", w )
            .attr( "height", scrollSize )
            .style( "fill", "#eeeeee" );
        svg.append( "line" )
            .attr( "x1", x1 + halfSize )
            .attr( "y1", height - halfSize )
            .attr( "x2", x2 - halfSize )
            .attr( "y2", height - halfSize )
            .style( "stroke-width", scrollSize )
            .style( "stroke", "#cccccc" )
            .style( "stroke-linecap", "round" );
        svg.append( "line" )
            .attr( "x1", x1 + halfSize + 1 )
            .attr( "y1", height - scrollSize )
            .attr( "x2", x1 + halfSize + 1 )
            .attr( "y2", height )
            .style( "stroke-width", 1 )
            .style( "stroke", "#ffffff" );
        svg.append( "line" )
            .attr( "x1", x2 - halfSize - 1 )
            .attr( "y1", height - scrollSize )
            .attr( "x2", x2 - halfSize - 1 )
            .attr( "y2", height )
            .style( "stroke-width", 1 )
            .style( "stroke", "#ffffff" );
        
        // Draw the Y scrollbar.
        let y = margin.top + padding.top,
            h = height - margin.bottom - padding.bottom - y + 1,
            y1 = y + h * ( 1 - ( yMin - yMin0      ) / ( yMax0 - yMin0 + yD )),
            y2 = y + h * ( 1 - ( yMax - yMin0 + yD ) / ( yMax0 - yMin0 + yD ));
        svg.append( "rect" )
            .attr( "x", 0 )
            .attr( "y", y )
            .attr( "width", scrollSize )
            .attr( "height", h )
            .style( "fill", "#eeeeee" );
        svg.append( "line" )
            .attr( "x1", halfSize )
            .attr( "y1", y2 + halfSize )
            .attr( "x2", halfSize )
            .attr( "y2", y1 - halfSize )
            .style( "stroke-width", scrollSize )
            .style( "stroke", "#cccccc" )
            .style( "stroke-linecap", "round" );
        svg.append( "line" )
            .attr( "x1", 0 )
            .attr( "y1", y2 + halfSize + 1 )
            .attr( "x2", scrollSize )
            .attr( "y2", y2 + halfSize + 1 )
            .style( "stroke-width", 1 )
            .style( "stroke", "#ffffff" );
        svg.append( "line" )
            .attr( "x1", 0 )
            .attr( "y1", y1 - halfSize - 1 )
            .attr( "x2", scrollSize )
            .attr( "y2", y1 - halfSize - 1 )
            .style( "stroke-width", 1 )
            .style( "stroke", "#ffffff" );
    }
};

export default Graph;
