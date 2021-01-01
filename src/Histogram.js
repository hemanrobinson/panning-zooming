import React, { useEffect, useRef, useState }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './Histogram.css';

// Histogram in an SVG element.
const Histogram = ( props ) => {
    
    // Initialization.
    const width = 400,
        height = 400,
        padding = { top: 20, right: 20, bottom: 0, left: 20 },
        margin = { top: 0, right: 0, bottom: 50, left: 50 };
    let ref = useRef(),
        { dataSet } = props,
        xLabel = Data.getColumnNames( dataSet )[ 2 ],
        yLabel = "Frequency",
        data = Data.getValues( dataSet ),
        xMin0 = d3.min( data, d => d[ 2 ]),
        xMax0 = d3.max( data, d => d[ 2 ]),
        yMin0,
        yMax0,
        xScale,
        yScale,
        downLocation = { x: 0, y: 0, isX: false, isY: false, isMin: false, isMax: false },
        histogram,
        bins;
        
    // Get the X scale.
    const [ xDomain, setXDomain ] = useState([ xMin0, xMax0 ]);
    xScale = d3.scaleLinear().domain( xDomain ).range([ margin.left + padding.left, width - margin.right - padding.right ]);
    
    // Assign the X scroll value.
    const [ xScroll, setXScroll ] = useState( 0 );
    let onXScroll = ( event, value ) => {
        setXDomain( xScale.domain());
        setXScroll( value );
    };

    // Calculate the histogram bins.
    histogram = d3.histogram()
        .value( d => d[ 2 ])
        .domain([ xMin0, xMax0 ])
        .thresholds( Math.round( 8 + Math.exp( 5 * xScroll )));
    bins = histogram( data );

    // Get the Y scale.
    yMin0 = 0;
    yMax0 = d3.max( bins, d => d.length );
    yScale = d3.scaleLinear()
        .range([ height - margin.bottom - padding.bottom, margin.top + padding.top ])
        .domain([ yMin0, yMax0 ]);
        
    // Zoom in two dimensions.
    let onZoom2D = ( isIn ) => {
        Graph.onZoom2D( isIn, xScale, yScale, xMin0, xMax0, yMin0, yMax0 );
        Histogram.draw( ref, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, xLabel, yLabel, bins );
    };
    
    // Zoom in one dimension.
    let onMouseDown = ( event ) => {
        Graph.onMouseDown( event, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, downLocation );
    },
    onMouseUp = ( event ) => {
        if( downLocation.isX || downLocation.isY ) {
            Graph.onMouseUp( event, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, downLocation );
            Histogram.draw( ref, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, xLabel, yLabel, bins );
        }
    };
    
    // Set hook to draw on mounting, or on any other lifecycle update.
    useEffect(() => {
        Histogram.draw( ref, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, xLabel, yLabel, bins );
    });
    
    // Return the component.
    return <Graph width={width} height={height} margin={margin} padding={padding}
        onZoom={onZoom2D} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onXScroll={onXScroll} ref={ref} />
};
    
// Draws the points.
Histogram.draw = ( ref, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, xLabel, yLabel, bins ) => {
    
    // Initialization.
    const svg = d3.select( ref.current );
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
    
    // Draw the axes and scroll bars.
    Graph.draw( ref, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, xLabel, yLabel );
};

export default Histogram;
