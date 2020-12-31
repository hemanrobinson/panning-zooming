import React, { useEffect, useRef, useState }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './Plot.css';

// Scatter plot in an SVG element.
const Plot = ( props ) => {

    // Initialization.
    const width = 400, height = 400, padding = { top: 20, right: 20, bottom: 20, left: 20 }, margin = { top: 0, right: 0, bottom: 50, left: 50 }, scrollSize = 15;
    let ref = useRef(),
        { dataSet } = props,
        data = Data.getValues( dataSet ),
        xMin0 = d3.min( data, d => d[ 2 ]),
        xMax0 = d3.max( data, d => d[ 2 ]),
        yMin0 = d3.min( data, d => d[ 1 ]),
        yMax0 = d3.max( data, d => d[ 1 ]),
        xScale,
        yScale,
        mouseState = { xDown: 0, yDown: 0, isX: false, isY: false, isMin: false, isMax: false };
        
    // Get the scales.
    const [ xDomain, setXDomain ] = useState([ xMin0, xMax0 ]);
    const [ yDomain, setYDomain ] = useState([ yMin0, yMax0 ]);
    xScale = d3.scaleLinear().domain( xDomain ).range([ margin.left + padding.left, width - margin.right - padding.right ]);
    yScale = d3.scaleLinear().domain( yDomain ).range([ height - margin.bottom - padding.bottom, margin.top + padding.top ]);
    
    // Zoom in two dimensions.
    let onZoom2D = ( isIn ) => {
        Graph.onZoom2D( xScale, yScale, xMin0, xMax0, yMin0, yMax0, isIn );
        setXDomain( xScale.domain());
        setYDomain( yScale.domain());
    },
    onZoomIn  = () => { onZoom2D( true  ); },
    onZoomOut = () => { onZoom2D( false ); };
    
    // Zoom in one dimension.
    let onMouseDown = ( event ) => {
        Graph.onMouseDown( height, width, margin, padding, scrollSize, xScale, yScale, xMin0, xMax0, yMin0, yMax0, event, mouseState );
    },
    onMouseUp = ( event ) => {
        let isX = mouseState.isX;
        let isY = mouseState.isY;
        Graph.onMouseUp( height, width, margin, padding, scrollSize, xScale, yScale, xMin0, xMax0, yMin0, yMax0, event, mouseState );
        
        // If either scale changed, redraw or change the state.
        // Mouseup events can change the state, but mousemove events appear too fast for the React framework.
        if( isX || isY ) {
            if( event.type === "mousemove" ) {
                Plot.draw( ref, height, width, margin, padding, scrollSize, xScale, yScale, xMin0, xMax0, yMin0, yMax0, dataSet, 100 );
            } else {
                setXDomain( xScale.domain());
                setYDomain( yScale.domain());
            }
        }
    };
    
    // Set hook to draw on mounting, or on any other lifecycle update.
    useEffect(() => {
        Plot.draw( ref, height, width, margin, padding, scrollSize, xScale, yScale, xMin0, xMax0, yMin0, yMax0, dataSet, 100 );
    });
    
    // Return the component.
    return <Graph width={width} height={height} margin={margin} padding={padding}
        onZoomIn={onZoomIn} onZoomOut={onZoomOut} 
        onMouseDown={onMouseDown} onMouseUp={onMouseUp} ref={ref} />
};
    
// Draws the points.
Plot.draw = ( ref, height, width, margin, padding, scrollSize, xScale, yScale, xMin0, xMax0, yMin0, yMax0, dataSet, size ) => {
    
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
    
    // Draw the axes and scroll bars.
    Graph.draw( ref, height, width, margin, padding, scrollSize, xScale, yScale, xMin0, xMax0, yMin0, yMax0, columnNames[ 2 ], columnNames[ 1 ], size );
};

export default Plot;
