import React, { useEffect, useRef }  from 'react';
import * as d3 from 'd3';
import './ZoomBar.css';

/**
 * @typedef  D3Scale  d3 scale
 *
 * @type  {(d3.scaleLinear|d3.scaleBand)}  continuous linear or ordinal scale
 */
 
/**
 * @typedef  Domains  initial and current domains
 *
 * @type  {object}
 * @property  {number}  min0  initial X minimum
 * @property  {number}  max0  initial X maximum
 * @property  {number}  min   current X minimum
 * @property  {number}  max   current X maximum
 * @property  {number}  d     X difference
 */

/**
 * @typedef  EventLocation  event location
 *
 * @type  {object}
 * @property  {number}   x        X coordinate, in pixels
 * @property  {number}   y        Y coordinate, in pixels
 * @property  {Array}    xDomain  current X domain
 * @property  {Array}    yDomain  current Y domain
 * @property  {boolean}  isX      true iff on X zoom bar
 * @property  {boolean}  isY      true iff on Y zoom bar
 * @property  {boolean}  isMin    true iff on minimum
 * @property  {boolean}  isMax    true iff on maximum
 */

/**
 * Zoom bar.
 *
 * The zoom bar is a DIV element containing an SVG element. The SVG element supports an optional overlaid graph.
 *
 * @param  {Object}  props  properties
 * @return component
 */
const ZoomBar = ( props ) => {

    // Initialization.
    let { x, y, width, height, scale, domain0, isZooming, redraw } = props;
    const ref = useRef();
    
    // Zoom in one dimension.
    let onPointerDown = ( event ) => {
        ZoomBar.onPointerDown( event, width, height, scale, domain0 );
        const svg = d3.select( ref.current.childNodes[ 0 ]);
        ZoomBar.draw( svg, scale, domain0, true, true, redraw, true );
    },
    onPointerUp = ( event ) => {
        if( ZoomBar.downLocation.domain ) {
            ZoomBar.onPointerUp( event, width, height, scale, domain0 );
            const svg = d3.select( ref.current.childNodes[ 0 ]);
            ZoomBar.draw( svg, scale, domain0, true, true, redraw, true );
        }
    };
//    document.addEventListener( "pointerdown", ( event ) => {
//        ZoomBar.downLocation.domain = undefined;
//        ZoomBar.downLocation.isMin = false;
//        ZoomBar.downLocation.isMax = false;
//    });
    document.addEventListener( "pointerup", ( event ) => {
        ZoomBar.downLocation.domain = undefined;
        ZoomBar.downLocation.isMin = false;
        ZoomBar.downLocation.isMax = false;
    });
  
    // Handles the scroll wheel.
    const scale0 = scale.copy();    // Create reference scale for scroll wheel
    function onScroll( event ) {
    
        // Transform the scale.
        scale.domain( event.transform.rescaleX( scale0 ).domain());
        ZoomBar.clampDomain( scale, scale0.domain());
        
        // Draw the zoom bar.
        const svg = d3.select( ref.current.childNodes[ 0 ]);
        ZoomBar.draw( svg, scale, domain0, true, true, redraw, true );
    }
    
    // Set hook invoked upon mounting.
    useEffect(() => {
  
        // Hook up the scroll wheel.
        const svg = d3.select( ref.current.childNodes[ 0 ]);
        svg.call( d3.zoom()
            .extent([[ 0, 0 ], [ width, height ]])
            .scaleExtent([ 1, 4 ])
            .filter( event => { event.preventDefault(); return true; })
            .on( "zoom", onScroll ));
        
        // Draw the zoom bar.
        ZoomBar.draw( svg, scale, domain0, isZooming, true, redraw, true );
    });
    
    // Return the component. The svg element does not support a ref attribute, so enclose it in a div.
    return(
        <div ref={ref}>
            <svg style={{top: y, left: x}} width={width} height={height} onPointerDown={onPointerDown} onPointerMove={onPointerUp} onPointerUp={onPointerUp} className="zoomBar" />
        </div>
    );
};

/**
 * Width of zoom bar, in pixels.
 *
 * @const {number}
 */
ZoomBar.size = 15;
    
/**
 * Stores whether each zoom bar displays zooming controls.
 *
 * @type {Map} references keys and boolean values
 */
ZoomBar.isZooming = new Map();
 
/**
 * Down event location.
 *
 * @type {EventLocation}
 */
ZoomBar.downLocation = { x: 0, y: 0, domain: undefined, isMin: false, isMax: false };

/**
 * Returns initial and current domains.
 *
 * @param  {Array}    domain0       initial domain
 * @param  {Array}    domain        current domain
 * @param  {boolean}  isOrdinal     true iff scale is ordinal
 * @return {Domains}  initial and current domains
 */
ZoomBar.getDomains = ( domain0, domain, isOrdinal ) => {
    let domains = {};
    if( isOrdinal ) {
        domains.min0 = 0;
        domains.max0 = domain0.length - 1;
        domains.min = domain0.indexOf( domain[ 0 ]);
        domains.max = domain0.indexOf( domain[ domain.length - 1 ]);
        domains.d = 1;
    } else {
        domains.min0 = domain0[ 0 ];
        domains.max0 = domain0[ 1 ];
        domains.min = domain[ 0 ];
        domains.max = domain[ 1 ];
        domains.d = 0;
    }
    return domains;
}
    
/**
 * Adjusts scale domain to be within original domain.
 *
 * @param {D3Scale}   scale   scale
 * @param {number[]}  domain0 original domain
 */
ZoomBar.clampDomain = ( scale, domain0 ) => {
    const domain = scale.domain().concat();
    if( domain[ 1 ] > domain[ 0 ] + domain0[ 1 ]  - domain0[ 0 ]) {
        domain[ 1 ] = domain[ 0 ] + domain0[ 1 ]  - domain0[ 0 ];
    }
    if( domain[ 0 ] < domain0[ 0 ]) {
        domain[ 1 ] += domain0[ 0 ] - domain[ 0 ];
        domain[ 0 ] = domain0[ 0 ];
    } else if( domain[ 1 ] > domain0[ 1 ]) {
        domain[ 0 ] += domain0[ 1 ] - domain[ 1 ];
        domain[ 1 ] = domain0[ 1 ];
    }
    scale.domain( domain );
}
    
/**
 * Initiates zoom in one dimension.
 *
 * This method modifies ZoomBar.downLocation.
 *
 * @param  {Event}    event         event
 * @param  {number}   width         width, in pixels
 * @param  {number}   height        height, in pixels
 * @param  {D3Scale}  scale         scale
 * @param  {Array}    domain0       initial domain
 */
ZoomBar.onPointerDown = ( event, width, height, scale, domain0 ) => {
    
    // Initialization.
    const endCapSize = 0.8 * (( event.pointerType === "touch" ) ? 2 : 1 ) * ZoomBar.size,
        domain = scale.domain(),
        { min0, max0, min, max, d } = ZoomBar.getDomains( domain0, domain, !!scale.bandwidth ),
        sourceEvent = event.nativeEvent;
    let xDown, yDown;
    if( sourceEvent.touches ) {
        const touch = sourceEvent.touches[ 0 ];
        xDown = touch.clientX - sourceEvent.currentTarget.getBoundingClientRect().x;
        yDown = touch.clientY - sourceEvent.currentTarget.getBoundingClientRect().y;
    } else {
        xDown = sourceEvent.offsetX;
        yDown = sourceEvent.offsetY;
    }
        
    // Reset the mousedown coordinates.
    ZoomBar.downLocation.x = xDown;
    ZoomBar.downLocation.y = yDown;
    ZoomBar.downLocation.domain = undefined;
    ZoomBar.downLocation.isMin = false;
    ZoomBar.downLocation.isMax = false;
  
    // Stop propagation to document.
    if( event.stopPropagation ) {
        event.stopPropagation();
    }
    
    // Handle the event.
    if(( 0 <= xDown ) && ( xDown <= width ) && ( 0 <= yDown ) && ( yDown <= height )) {
    
        // Handle event on X zoom bar...
        if( width > height ) {
            let w = width + 1,
                x0 = w * ( min - min0     ) / ( max0 - min0 + d ),
                x1 = w * ( max - min0 + d ) / ( max0 - min0 + d );
            if( event.preventDefault ) {
                event.preventDefault();
            }
            ZoomBar.downLocation.domain = scale.domain();
            if(( x0 <= xDown ) && ( xDown <= x0 + endCapSize )) {
                ZoomBar.downLocation.isMin = true;
            } else if(( x1 - endCapSize <= xDown ) && ( xDown <= x1 )) {
                ZoomBar.downLocation.isMax = true;
            }
        }
    
        // ...or handle event on Y zoom bar...
        else {
            let h = height + 1,
                y0 = h * ( 1 - ( min - min0     ) / ( max0 - min0 + d )),
                y1 = h * ( 1 - ( max - min0 + d ) / ( max0 - min0 + d ));
            if( event.preventDefault ) {
                event.preventDefault();
            }
            ZoomBar.downLocation.domain = scale.domain();
            if(( y1 <= yDown ) && ( yDown <= y1 + endCapSize )) {
                ZoomBar.downLocation.isMax = true;
            } else if(( y0 - endCapSize <= yDown ) && ( yDown <= y0 )) {
                ZoomBar.downLocation.isMin = true;
            }
        }
    }
};

/**
 * Completes zoom in one dimension.
 *
 * This method modifies ZoomBar.downLocation.
 *
 * @param  {Event}    event         event
 * @param  {number}   width         width, in pixels
 * @param  {number}   height        height, in pixels
 * @param  {D3Scale}  scale         scale (returned)
 * @param  {Array}    domain0       initial domain
 */
ZoomBar.onPointerUp = ( event, width, height, scale, domain0 ) => {

    // Initialization.
    const k = 8;
    let domain = ZoomBar.downLocation.domain,
        { min0, max0, min, max, d } = ZoomBar.getDomains( domain0, domain, !!scale.bandwidth );
    let sourceEvent = event.nativeEvent;
    let xUp, yUp;
    if( sourceEvent.touches ) {
        const touch = sourceEvent.touches[ 0 ];
        xUp = touch.clientX - sourceEvent.currentTarget.getBoundingClientRect().x;
        yUp = touch.clientY - sourceEvent.currentTarget.getBoundingClientRect().y;
    } else {
        xUp = sourceEvent.offsetX;
        yUp = sourceEvent.offsetY;
    }
    
    // Handle event on X zoom bar...
    if( ZoomBar.downLocation.domain && ( width > height )) {
        
        // Prevent default event handling.
        if( event.preventDefault ) {
            event.preventDefault();
        }
    
        // Calculate the difference.
        const f = ( max0 - min0 + d ) / k;
        let w = width + 1,
            dif = ( max0 - min0 + d ) * ( xUp - ZoomBar.downLocation.x ) / w;
        if( scale.bandwidth ) {
            dif = Math.round( dif );
        }
        
        // Handle drag on minimum handle...
        if( ZoomBar.downLocation.isMin ) {
            dif = Math.max( dif, min0 - min );
            if( dif <= max - min + d - f ) {
                if( scale.bandwidth ) {
                    scale.domain( domain0.slice( min + dif, max + d ));
                } else {
                    scale.domain([ min + dif, max ]);
                }
            }
        }
        
        // ...or handle drag on maximum handle...
        else if( ZoomBar.downLocation.isMax ) {
            dif = Math.min( dif, max0 - max );
            if( dif >= f - ( max - min + d )) {
                if( scale.bandwidth ) {
                    scale.domain( domain0.slice( min, max + dif + d ));
                } else {
                    scale.domain([ min, max + dif ]);
                }
            }
        }
        
        // ...or handle drag on thumb or click on track.
        else {
        
            // Adjust for click on track.
            if( dif === 0 ) {
                let x0 = w * ( min - min0     ) / ( max0 - min0 + d ),
                    x1 = w * ( max - min0 + d ) / ( max0 - min0 + d );
                if( xUp < x0 ) {
                    dif = ( max0 - min0 + d ) * ( xUp - x0 ) / w - ( max - min + d ) / 2;
                } else if( x1 < xUp ) {
                    dif = ( max0 - min0 + d ) * ( xUp - x1 ) / w + ( max - min + d ) / 2;
                }
            }
            
            // Handle drag or click.
            dif = Math.max( dif, min0 - min );
            dif = Math.min( dif, max0 - max );
            if( scale.bandwidth ) {
                scale.domain( domain0.slice( min + dif, max + dif + d ));
            } else {
                scale.domain([ min + dif, max + dif ]);
            }
        }
    }
    
    // ...or handle event on Y zoom bar.
    else if( ZoomBar.downLocation.domain && ( height > width )) {
        
        // Prevent default event handling.
        if( event.preventDefault ) {
            event.preventDefault();
        }
    
        // Calculate the difference.
        const f = ( max0 - min0 + d ) / k;
        let h = height + 1,
            dif = ( max0 - min0 + d ) * ( ZoomBar.downLocation.y - yUp ) / h;
        if( scale.bandwidth ) {
            dif = Math.round( dif );
        }
            
        // Handle drag on minimum handle...
        if( ZoomBar.downLocation.isMin ) {
            dif = Math.max( dif, min0 - min );
            if( dif <= max - min + d - f ) {
                if( scale.bandwidth ) {
                    scale.domain( domain0.slice( min + dif, max + d ));
                } else {
                    scale.domain([ min + dif, max ]);
                }
            }
        }
        
        // ...or handle drag on maximum handle...
        else if( ZoomBar.downLocation.isMax ) {
            dif = Math.min( dif, max0 - max );
            if( dif >= f - ( max - min + d )) {
                if( scale.bandwidth ) {
                    scale.domain( domain0.slice( min, max + dif + d ));
                } else {
                    scale.domain([ min, max + dif ]);
                }
            }
        }
        
        // ...or handle drag on thumb or click on track.
        else {
        
            // Adjust for click on track.
            if( dif === 0 ) {
                let y0 = h * ( 1 - ( min - min0     ) / ( max0 - min0 + d )),
                    y1 = h * ( 1 - ( max - min0 + d ) / ( max0 - min0 + d ));
                if( yUp < y0 ) {
                    dif = ( max0 - min0 + d ) * ( y0 - yUp ) / h - ( max - min + d ) / 2;
                } else if( y1 < yUp ) {
                    dif = ( max0 - min0 + d ) * ( y1 - yUp ) / h + ( max - min + d ) / 2;
                }
            }
            
            // Handle drag or click.
            dif = Math.max( dif, min0 - min );
            dif = Math.min( dif, max0 - max );
            if( scale.bandwidth ) {
                scale.domain( domain0.slice( min + dif, max + dif + d ));
            } else {
                scale.domain([ min + dif, max + dif ]);
            }
        }
    }
        
    // Reset the mousedown coordinates.
    if( ZoomBar.downLocation.domain && ( event.type === "pointerup" ) && ( event.pointerType !== "touch" )) {
        ZoomBar.downLocation.domain = undefined;
        ZoomBar.downLocation.isMin = false;
        ZoomBar.downLocation.isMax = false;
    }
};

/**
 * Draws the zoom bar.
 *
 * @param  {Element}            svg         SVG element
 * @param  {D3Scale}            scale       scale
 * @param  {Array}              domain0     initial domain
 * @param  {boolean}            isZooming   true iff drawing the zoom bar, otherwise erasing
 * @param  {boolean}            isHandles   true iff drawing the handles
 * @param  {Function|undefined} redraw      callback to draw graph, or none iff undefined
 * @param  {boolean|undefined}  isDetail    true iff drawing detail view, or false iff undefined
 */
ZoomBar.draw = ( svg, scale, domain0, isZooming, isHandles, redraw, isDetail ) => {
    
    // Initialization.
    const width = +svg.attr( "width" ),
        height = +svg.attr( "height" ),
        halfSize = ZoomBar.size / 2,
        quarterSize = ZoomBar.size / 4,
        colorLight = "#ebeeef",
        colorLine = "#cbd2d7",
        opacity = 0.7,
        domain = scale.domain(),
        { min0, max0, min, max, d } = ZoomBar.getDomains( domain0, domain, !!scale.bandwidth );
    svg.selectAll( "*" ).remove();
    
    // Draw the zoom bar...
    if( isZooming ) {
        
        // Draw the track.
        svg.append( "rect" )
            .attr( "x", 0 )
            .attr( "y", 0 )
            .attr( "width", width )
            .attr( "height", height )
            .style( "fill", "#ffffff" );
            
        // Redraw the graph if requested.
        if( redraw ) {
            redraw( svg, isDetail );
        }
            
        // Draw the X zoom bar.
        let x1 = Math.round( width * ( min - min0     ) / ( max0 - min0 + d )),
            x2 = Math.round( width * ( max - min0 + d ) / ( max0 - min0 + d ));
        if(( width > height ) && ( x2 > x1 )) {
            
            // Draw the zoom bar.
            svg.append( "rect" )
                .attr( "x", x1 )
                .attr( "y", 0 )
                .attr( "width", x2 - x1 )
                .attr( "height", height )
                .attr( "rx", halfSize )
                .attr( "opacity", opacity )
                .style( "fill", colorLine );
            
            // Draw the handles.
            if( isHandles ) {
                svg.append( "line" )
                    .attr( "x1", x1 + halfSize + 1 )
                    .attr( "y1", 0 )
                    .attr( "x2", x1 + halfSize + 1 )
                    .attr( "y2", height )
                    .attr( "opacity", opacity )
                    .style( "stroke-width", 1 )
                    .style( "stroke", "#ffffff" )
                    .style( "stroke-linecap", "butt" );
                svg.append( "line" )
                    .attr( "x1", x2 - halfSize - 1 )
                    .attr( "y1", 0 )
                    .attr( "x2", x2 - halfSize - 1 )
                    .attr( "y2", height )
                    .attr( "opacity", opacity )
                    .style( "stroke-width", 1 )
                    .style( "stroke", "#ffffff" )
                    .style( "stroke-linecap", "butt" );
                svg.append( "line" )
                    .attr( "x1", x1 + quarterSize - 1 )
                    .attr( "y1", height / 2 - quarterSize )
                    .attr( "x2", x1 + quarterSize - 1 )
                    .attr( "y2", height / 2 + quarterSize )
                    .style( "stroke-width", 1 )
                    .style( "stroke", "#000000" )
                    .style( "stroke-linecap", "butt" );
                svg.append( "line" )
                    .attr( "x1", x1 + quarterSize + 1 )
                    .attr( "y1", height / 2 - quarterSize )
                    .attr( "x2", x1 + quarterSize + 1 )
                    .attr( "y2", height / 2 + quarterSize )
                    .style( "stroke-width", 1 )
                    .style( "stroke", "#000000" )
                    .style( "stroke-linecap", "butt" );
                svg.append( "line" )
                    .attr( "x1", x2 - quarterSize + 1 )
                    .attr( "y1", height / 2 - quarterSize )
                    .attr( "x2", x2 - quarterSize + 1 )
                    .attr( "y2", height / 2 + quarterSize )
                    .style( "stroke-width", 1 )
                    .style( "stroke", "#000000" )
                    .style( "stroke-linecap", "butt" );
                svg.append( "line" )
                    .attr( "x1", x2 - quarterSize - 1 )
                    .attr( "y1", height / 2 - quarterSize )
                    .attr( "x2", x2 - quarterSize - 1 )
                    .attr( "y2", height / 2 + quarterSize )
                    .style( "stroke-width", 1 )
                    .style( "stroke", "#000000" )
                    .style( "stroke-linecap", "butt" );
            }
        }
        
        // Draw the Y zoom bar.
        let y1 = height * ( 1 - ( min - min0     ) / ( max0 - min0 + d )),
            y2 = height * ( 1 - ( max - min0 + d ) / ( max0 - min0 + d ));
        if(( height > width ) && ( y1 > y2 )) {
            
            // Draw the zoom bar.
            svg.append( "rect" )
                .attr( "x", 0 )
                .attr( "y", y2 )
                .attr( "width", width )
                .attr( "height", y1 - y2 )
                .attr( "rx", halfSize )
                .attr( "opacity", opacity )
                .style( "fill", colorLine );
                
            // Draw the handles.
            if( isHandles ) {
                svg.append( "line" )
                    .attr( "x1", halfSize )
                    .attr( "y1", y2 + halfSize + 1 )
                    .attr( "x2", halfSize )
                    .attr( "y2", y1 - halfSize - 1 )
                    .attr( "opacity", opacity )
                    .style( "stroke-width", width )
                    .style( "stroke", "#ffffff" )
                    .style( "stroke-linecap", "butt" );
                svg.append( "line" )
                    .attr( "x1", halfSize )
                    .attr( "y1", y2 + halfSize + 2 )
                    .attr( "x2", halfSize )
                    .attr( "y2", y1 - halfSize - 2 )
                    .attr( "opacity", opacity )
                    .style( "stroke-width", width )
                    .style( "stroke", colorLine )
                    .style( "stroke-linecap", "butt" );
                svg.append( "line" )
                    .attr( "x1", width / 2 - quarterSize )
                    .attr( "y1", y1 - quarterSize )
                    .attr( "x2", width / 2 + quarterSize )
                    .attr( "y2", y1 - quarterSize )
                    .style( "stroke-width", 1 )
                    .style( "stroke", "#000000" )
                    .style( "stroke-linecap", "butt" );
                svg.append( "line" )
                    .attr( "x1", width / 2 - quarterSize )
                    .attr( "y1", y1 - quarterSize - 2 )
                    .attr( "x2", width / 2 + quarterSize )
                    .attr( "y2", y1 - quarterSize - 2 )
                    .style( "stroke-width", 1 )
                    .style( "stroke", "#000000" )
                    .style( "stroke-linecap", "butt" );
                svg.append( "line" )
                    .attr( "x1", width / 2 - quarterSize )
                    .attr( "y1", y2 + quarterSize )
                    .attr( "x2", width / 2 + quarterSize )
                    .attr( "y2", y2 + quarterSize )
                    .style( "stroke-width", 1 )
                    .style( "stroke", "#000000" )
                    .style( "stroke-linecap", "butt" );
                svg.append( "line" )
                    .attr( "x1", width / 2 - quarterSize )
                    .attr( "y1", y2 + quarterSize + 2 )
                    .attr( "x2", width / 2 + quarterSize )
                    .attr( "y2", y2 + quarterSize + 2 )
                    .style( "stroke-width", 1 )
                    .style( "stroke", "#000000" )
                    .style( "stroke-linecap", "butt" );
            }
        }
    }
    
    // ...or hide the zoom bar.
    else {
        svg.append( "rect" )
            .attr( "x", 0 )
            .attr( "y", 0 )
            .attr( "width", width )
            .attr( "height", height )
            .style( "fill", colorLight );
    }
    
    // Record the new state.
//    ZoomBar.isZooming.set( ref, isZooming );
};

export default ZoomBar;
