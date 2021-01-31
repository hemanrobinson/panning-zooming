import React, { useEffect, useRef, useState }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './Graph.css';

/**
 * Histogram in an SVG element.
 *
 * The X domain is stored as a state.  The Y domain is calculated from the X domain.
 *
 * @param  {Object}  props  properties
 * @return component
 */
const Histogram = ( props ) => {
    
    // Initialization.
    const width = 400,
        height = 400,
        padding = { top: 20, right: 20, bottom: 0, left: 20 },
        margin = { top: 0, right: 10, bottom: 50, left: 50 };
    let ref = useRef(),
        { dataSet } = props,
        xLabel = Data.getColumnNames( dataSet )[ 1 ],
        yLabel = "Frequency",
        data = Data.getValues( dataSet ),
        xDomain0 = [ d3.min( data, d => d[ 1 ]), d3.max( data, d => d[ 1 ])],
        yDomain0,
        xScale,
        yScale,
        histogram,
        bins;
        
    // Get the X scale.
    const [ xDomain, setXDomain ] = useState( xDomain0 );
    xScale = d3.scaleLinear().domain( xDomain ).range([ margin.left + padding.left, width - margin.right - padding.right ]);
    
    // Assign the X aggregate factor.
    const [ xAggregate, setXAggregate ] = useState( 0 );
    let onXAggregate = ( event, value ) => {
        setXDomain( xScale.domain());
        setXAggregate( value );
    };

    // Calculate the histogram bins.
    histogram = d3.histogram()
        .value( d => d[ 2 ])
        .domain( xDomain0 )
        .thresholds( Math.round( 8 + Math.exp( 5 * xAggregate )));
    bins = histogram( data );

    // Get the Y scale.
    yDomain0 = [ 0, 1.05 * d3.max( bins, d => d.length )];      // a 5% margin
    yScale = d3.scaleLinear()
        .range([ height - margin.bottom - padding.bottom, margin.top + padding.top ])
        .domain( yDomain0 );
        
    // Zoom in two dimensions.
    let onZoom2D = ( isIn ) => {
        Graph.onZoom2D( isIn, xScale, yScale, xDomain0, yDomain0, true, false );
        Histogram.draw( ref, width, height, margin, padding, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bins );
    };
    
    // Zoom in one dimension.
    let onMouseDown = ( event ) => {
        Graph.onMouseDown( event, width, height, margin, padding, xScale, yScale, xDomain0, yDomain0 );
    },
    onMouseUp = ( event ) => {
        if( Graph.downLocation.isX || Graph.downLocation.isY ) {
            Graph.onMouseUp( ref, event, width, height, margin, padding, xScale, yScale, xDomain0, yDomain0 );
            Histogram.draw( ref, width, height, margin, padding, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bins );
        }
    };
    
    // Set hook to draw on mounting or any state change.
    useEffect(() => {
        Histogram.draw( ref, width, height, margin, padding, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bins );
    });
    
    // Return the component.
    return <Graph width={width} height={height} margin={margin} padding={padding}
        onZoom={onZoom2D} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onXAggregate={onXAggregate} ref={ref} />
};

/**
 * Draws the histogram.
 *
 * @param  {Object}   ref          reference to DIV
 * @param  {number}   width        width, in pixels
 * @param  {number}   height       height, in pixels
 * @param  {Box}      margin       margin
 * @param  {Box}      padding      padding
 * @param  {D3Scale}  xScale       X scale
 * @param  {D3Scale}  yScale       Y scale
 * @param  {Array}    xDomain0     Initial X domain
 * @param  {Array}    yDomain0     Initial Y domain
 * @param  {string}   xLabel       X axis label
 * @param  {string}   yLabel       Y axis label
 * @param  {Array}    bins         bins
 */
Histogram.draw = ( ref, width, height, margin, padding, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bins ) => {
    
    // Initialization.
    const svg = d3.select( ref.current.childNodes[ 0 ]);
    svg.selectAll( "*" ).remove();

    // Draw the bars.
    svg.selectAll( "rect" )
        .data( bins )
        .enter()
        .append( "rect" )
        .attr( "x", 1 )
        .attr( "transform", bin => ( "translate( " + xScale( bin.x0 ) + "," + yScale( bin.length ) + " )" ))
        .attr( "width", bin => Math.max( 0, (( bin.x1 === bin.x0 ) ? 0 : ( xScale( bin.x1 ) - xScale( bin.x0 ) - 1 ))))
        .attr( "height", bin => Math.max( 0, ( height - margin.bottom - padding.bottom - yScale( bin.length ))))
        .style( "fill", "#99bbdd" );
    
    // Draw the axes and the controls.
    Graph.drawAxes(     ref, width, height, margin, padding, true, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel );
    Graph.drawControls( ref, width, height, margin, padding, true, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel );
};

export default Histogram;
