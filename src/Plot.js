import React, { useEffect, useRef }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './Plot.css';

// Scatter plot in an SVG element.
const Plot = ( props ) => {

    // Initialization.
    const width = 400, height = 400, padding = 20, marginAxis = 50, scrollSize = 15;
    let ref = useRef(),
        { dataSet } = props,
        data = Data.getValues( dataSet ),
        xMin0 = d3.min( data, d => d[ 2 ]),
        xMax0 = d3.max( data, d => d[ 2 ]),
        yMin0 = d3.min( data, d => d[ 1 ]),
        yMax0 = d3.max( data, d => d[ 1 ]),
        xScale = d3.scaleLinear().domain([ xMin0, xMax0 ]).range([ marginAxis + padding, width - padding ]),
        yScale = d3.scaleLinear().domain([ yMin0, yMax0 ]).range([ height - marginAxis - padding, padding ]),
        xDown, yDown, isX = false, isY = false, isMin = false, isMax = false;
    
    // Zoom in two dimensions.
    let onZoom2D = ( isIn ) => {
        Graph.onZoom2D( xScale, yScale, xMin0, xMax0, yMin0, yMax0, isIn );
        Plot.draw( ref, height, width, marginAxis, padding, scrollSize, xScale, yScale, xMin0, xMax0, yMin0, yMax0, dataSet, 100 );
    },
    onZoomIn  = () => { onZoom2D( true  ); },
    onZoomOut = () => { onZoom2D( false ); };
    
    // Zoom in one dimension.
    let onMouseDown = ( event ) => {
        let result = Graph.onMouseDown( height, width, marginAxis, padding, scrollSize, xScale, yScale, xMin0, xMax0, yMin0, yMax0, event );
        xDown = result[ 0 ];
        yDown = result[ 1 ];
        isX   = result[ 2 ];
        isY   = result[ 3 ];
        isMin = result[ 4 ];
        isMax = result[ 5 ];
    },
    onMouseUp = ( event ) => {
        let result = Graph.onMouseUp( xDown, yDown, isX, isY, isMin, isMax, height, width, marginAxis, padding, scrollSize, xScale, yScale, xMin0, xMax0, yMin0, yMax0, event );
        if( isX || isY ) {
            Plot.draw( ref, height, width, marginAxis, padding, scrollSize, xScale, yScale, xMin0, xMax0, yMin0, yMax0, dataSet, 100 );
        }
        xDown = result[ 0 ];
        yDown = result[ 1 ];
        isX   = result[ 2 ];
        isY   = result[ 3 ];
        isMin = result[ 4 ];
        isMax = result[ 5 ];
    };
    
    // Set hook to draw on mounting, or on any other lifecycle update.
    useEffect(() => {
        Plot.draw( ref, height, width, marginAxis, padding, scrollSize, xScale, yScale, xMin0, xMax0, yMin0, yMax0, dataSet, 100 );
    });
    
    // Return the component.
    return <Graph width={width} height={height}
        onMouseDown={onMouseDown} onMouseUp={onMouseUp}
        onZoomIn={onZoomIn} onZoomOut={onZoomOut} ref={ref} />
};
    
// Draws the points.
Plot.draw = ( ref, height, width, marginAxis, padding, scrollSize, xScale, yScale, xMin0, xMax0, yMin0, yMax0, dataSet, size ) => {
    
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
    Graph.draw( ref, height, width, marginAxis, padding, scrollSize, xScale, yScale, xMin0, xMax0, yMin0, yMax0, columnNames[ 2 ], columnNames[ 1 ], size );
};

export default Plot;
