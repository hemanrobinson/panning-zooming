import React from 'react';
import * as d3 from 'd3';
import './Graph.css';
import ZoomBar from './ZoomBar';

/**
 * @typedef  Box  distances around an object
 *
 * @type  {object}
 * @property  {number}  top     top distance, in pixels
 * @property  {number}  right   right distance, in pixels
 * @property  {number}  bottom  bottom distance, in pixels
 * @property  {number}  left    left distance, in pixels
 */

/**
 * Graph in an SVG element.
 *
 * This component contains code common to the different types of graphs.
 *
 * React functional components don't support inheritance; this is the recommended pattern:
 *    https://reactjs.org/docs/composition-vs-inheritance.html#specialization
 *
 * @param  {Object}  props  properties
 * @param  {Object}  ref    reference to DIV
 * @return component
 */
const Graph = React.forwardRef(( props, ref ) => {
    
    // Initialization.
    let { width, height, onPointerDown, onPointerUp, onPointerOver, onPointerOut } = props;
    
    // Return the component.
    return <div style={{width: width, height: height}} className="parent" ref={ref}>
        <svg width={width} height={height} onPointerDown={onPointerDown} onPointerMove={onPointerUp} onPointerUp={onPointerUp} onPointerOver={onPointerOver} onPointerOut={onPointerOut}/>
    </div>;
});
    
/**
 * Draws the axes.
 *
 * @param  {Object}   ref           reference to DIV
 * @param  {number}   width         width, in pixels
 * @param  {number}   height        height, in pixels
 * @param  {Box}      margin        margin
 * @param  {Box}      padding       padding
 * @param  {number}   xScrollSize   scroll size in the X dimension, or <0 if not supported, or 0 for default
 * @param  {number}   yScrollSize   scroll size in the Y dimension, or <0 if not supported, or 0 for default
 * @param  {D3Scale}  xScale        X scale
 * @param  {D3Scale}  yScale        Y scale
 * @param  {Array}    xDomain0      Initial X domain
 * @param  {Array}    yDomain0      Initial Y domain
 * @param  {string}   xLabel        X axis label
 * @param  {string}   yLabel        Y axis label
 * @param  {number[]} xThresholds   bin thresholds in the X dimension, or undefined for none
 * @param  {number[]} yThresholds   bin thresholds in the Y dimension, or undefined for none
 */
Graph.drawAxes = ( ref, width, height, margin, padding, xScrollSize, yScrollSize, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, xThresholds, yThresholds ) => {
    
    // Initialization.
    const svg = d3.select( ref.current.childNodes[ 0 ]),
        size = ZoomBar.size,
        colorLight = "#ebeeef";
        
    // Clear the margins.
    svg.append( "rect" )
        .attr( "x", 0 )
        .attr( "y", 0 )
        .attr( "width", width )
        .attr( "height", padding.top )
        .style( "fill", colorLight );
    svg.append( "rect" )
        .attr( "x", width - padding.right )
        .attr( "y", 0 )
        .attr( "width", padding.right )
        .attr( "height", height + xScrollSize )
        .style( "fill", colorLight );
    svg.append( "rect" )
        .attr( "x", 0 )
        .attr( "y", height - margin.bottom )
        .attr( "width", width )
        .attr( "height", margin.bottom )
        .style( "fill", colorLight );
    svg.append( "rect" )
        .attr( "x", 0 )
        .attr( "y", 0 )
        .attr( "width", margin.left )
        .attr( "height", height + xScrollSize )
        .style( "fill", colorLight );

    // Get the tick values and format.
    const s = d3.formatSpecifier( "f" );    // for this data
    s.precision = 0;                        // for this data
    let xTickValues = null,
        xTickFormat = d3.format( s );
    let yTickValues = null,
        yTickFormat = d3.format( s );
    
    // Draw the X axis.
    svg.append( "g" )
        .attr( "class", ( margin.bottom > 50 ) ? "axisRotated" : "axis" )
        .attr( "transform", "translate( 0, " + ( height - margin.bottom ) + " )" )
        .call( d3.axisBottom( xScale ).tickSizeOuter( 0 ).ticks( 3 ).tickValues( xTickValues ).tickFormat( xTickFormat ));
    svg.append( "text" )
        .attr( "transform", "translate( " + ( width / 2 ) + " ," + ( height - 1.5 * size ) + ")" )
        .style( "text-anchor", "middle" )
        .text( xLabel );
        
    // Draw the Y axis.
    svg.append( "g" )
        .attr( "class", "axis" )
        .attr( "transform", "translate( " + margin.left + ", 0 )" )
        .call( d3.axisLeft( yScale ).tickSizeOuter( 0 ).ticks( 3 ).tickValues( yTickValues ).tickFormat( yTickFormat ));
    svg.append( "text" )
        .attr( "x", margin.left )
        .attr( "y", margin.top + padding.top * 0.7 )
        .style( "text-anchor", "middle" )
        .text( yLabel );
};

export default Graph;
