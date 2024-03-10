import React, { useEffect, useRef }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './Graph.css';
import ZoomBar from './ZoomBar';

/**
 * Area plot in an SVG element.
 *
 * This component is stateless because the zoom can be calculated from the event coordinates and the initial domains.
 *
 * @param  {Object}  props  properties
 * @return component
 */
const AreaPlot = ( props ) => {

    // Initialization.
    const width = 650,
        height = 400,
        padding = { top: 20, right: 20, bottom: 0, left: 0 },
        margin = { top: 20, right: 0, bottom: 50, left: 70 },
        overviewPadding = 50;
    let ref = useRef(),
        { dataSet } = props,
        xLabel = Data.getColumnNames( dataSet )[ 0 ],
        yLabel = Data.getColumnNames( dataSet )[ 1 ],
        data = Data.getValues( dataSet ),
        xDomain0 = [ d3.min( data, d => d[ 0 ]), d3.max( data, d => d[ 0 ])],
        yDomain0 = [ d3.min( data, d => d[ 1 ]), d3.max( data, d => d[ 1 ])],
        xScale = d3.scaleLinear().domain( xDomain0 ).range([ margin.left + padding.left, width - margin.right - padding.right ]),
        yScale = d3.scaleLog().domain( yDomain0 ).range([ height - margin.bottom - padding.bottom - overviewPadding, margin.top + padding.top ]),
        xScale1 = d3.scaleLinear().domain( xDomain0 ).range([ 0, width - margin.left - padding.left - margin.right - padding.right ]),
        yScale1 = d3.scaleLog().domain( yDomain0 ).range([ overviewPadding, 0 ]);
  
    // Redraws the graph.
    function redraw( overviewSVG, isDrawDetail ) {
        if( overviewSVG ) {
            AreaPlot.drawOverview( overviewSVG, xScale1, yScale1, dataSet );
        }
        if( isDrawDetail ) {
            AreaPlot.draw( ref, margin, padding, overviewPadding, true, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, dataSet );
        }
    }
    
    // Show or hide the zoom bar.
    let onPointerOver = ( event ) => {
        if( !AreaPlot.isOver ) {
            AreaPlot.isOver = true;
            ZoomBar.draw( d3.select( ref.current.childNodes[ 1 ].childNodes[ 0 ]), xScale, xDomain0, true, true, redraw, false );
        }
    };
    let onPointerOut = ( event ) => {
        if( AreaPlot.isOver && ( event.pointerType !== "touch" )) {
            AreaPlot.isOver = false;
            ZoomBar.draw( d3.select( ref.current.childNodes[ 1 ].childNodes[ 0 ]), xScale, xDomain0, true, false, redraw, false );
        }
    };
//    document.addEventListener( "pointerdown", ( event ) => {
//        if( AreaPlot.isOver ) {
//            AreaPlot.isOver = false;
//            const overviewSVG = d3.select( ref.current.childNodes[ 1 ].childNodes[ 0 ]);
//            ZoomBar.draw( overviewSVG, xScale, xDomain0, true, false, redraw, false );
//        }
//    });
  
    // Handles the scroll wheel.
    const xScale0 = xScale.copy();    // Create reference scale for scroll wheel
    function onScroll( event ) {
    
        // Transform the scale.
        xScale.domain( event.transform.rescaleX( xScale0 ).domain());
        ZoomBar.clampDomain( xScale, xScale0.domain());
        
        // Draw the plot.
        ZoomBar.draw( d3.select( ref.current.childNodes[ 1 ].childNodes[ 0 ]), xScale, xDomain0, true, false, redraw, true );
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
        
        // Draw the graph.
        ZoomBar.draw( d3.select( ref.current.childNodes[ 1 ].childNodes[ 0 ]), xScale, xDomain0, true, false, redraw, true );
    });
    
    // Return the component.
    return(
        <div style={{width: width, height: height}} onPointerOver={onPointerOver} onPointerOut={onPointerOut} className="parent" ref={ref}>
            <svg width={width} height={height}/>
            <ZoomBar x={margin.left + padding.left} y={height - margin.bottom} width={width - margin.left - padding.left - margin.right - padding.right + 1} height={margin.bottom + 1} scale={xScale} domain0={xDomain0} isZooming={true} redraw={redraw} />
        </div>
    );
};
    
/**
 * Returns whether user event is over the graph.
 *
 * @type {boolean}
 */
AreaPlot.isOver = false;

/**
 * Draws the Area plot.
 *
 * @param  {Object}   ref          reference to DIV
 * @param  {Box}      margin       margin
 * @param  {Box}      padding      padding
 * @param  {number}   overviewPadding  padding for overview
 * @param  {boolean}  isZooming    true iff drawing zoom controls
 * @param  {D3Scale}  xScale       X scale of detail
 * @param  {D3Scale}  yScale       Y scale of detail
 * @param  {Array}    xDomain0     Initial X domain
 * @param  {Array}    yDomain0     Initial Y domain
 * @param  {string}   xLabel       X axis label
 * @param  {string}   yLabel       Y axis label
 * @param  {string}   dataSet      data set name
 */
AreaPlot.draw = ( ref, margin, padding, overviewPadding, isZooming, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, dataSet ) => {

    // Initialization.
    const svg = d3.select( ref.current.childNodes[ 0 ]),
        height = +svg.attr( "height" ),
        data = Data.getValues( dataSet );
    
    // Draw the area.
    svg.selectAll( "*" ).remove();
    const g = svg.append( "g" );
    g.append( "path" )
        .datum( data )
        .attr( "fill", "#99bbdd" )
        .attr( "stroke", "#99bbdd" )
        .attr( "stroke-width", 1.5 )
        .attr( "d", d3.area()
            .x( d => xScale( d[ 0 ]))
            .y0( height - overviewPadding - margin.bottom )
            .y1( d => yScale( d[ 1 ]))
        );
    
    // Draw the axes.
    Graph.drawAxes( svg, margin, padding, overviewPadding, -1, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel );
};

/**
 * Draws the zoom bar.
 *
 * @param  {number}   svg       svg element for overview
 * @param  {D3Scale}  xScale1   X scale of overview
 * @param  {D3Scale}  yScale1   Y scale of overview
 * @param  {string}   dataSet   data set name
 */
AreaPlot.drawOverview = ( svg, xScale1, yScale1, dataSet ) => {

    // Initialization.
    const height = +svg.attr( "height" ),
        data = Data.getValues( dataSet );

    // Draw the overview.
    const g = svg.append( "g" );
    g.append( "path" )
        .datum( data )
        .attr( "fill", "#99bbdd" )
        .attr( "stroke", "#99bbdd" )
        .attr( "stroke-width", 1.5 )
        .attr( "d", d3.area()
            .x( d => xScale1( d[ 0 ]))
            .y0( height )
            .y1( d => yScale1( d[ 1 ]))
        );
};

export default AreaPlot;
