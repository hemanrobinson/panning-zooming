import React, { useEffect, useRef, useState }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './Plot.css';

// Scatter plot in an SVG element.
const Plot = ( props ) => {

    // Initialization.
    const width = 400,
        height = 400,
        padding = { top: 20, right: 20, bottom: 20, left: 20 },
        margin = { top: 0, right: 0, bottom: 50, left: 50 };
    let ref = useRef(),
        { dataSet } = props,
        xLabel = Data.getColumnNames( dataSet )[ 2 ],
        yLabel = Data.getColumnNames( dataSet )[ 1 ],
        data = Data.getValues( dataSet ),
        xMin0 = d3.min( data, d => d[ 2 ]),
        xMax0 = d3.max( data, d => d[ 2 ]),
        yMin0 = d3.min( data, d => d[ 1 ]),
        yMax0 = d3.max( data, d => d[ 1 ]),
        xScale,
        yScale,
        symbolScale,
        downLocation = { x: 0, y: 0, isX: false, isY: false, isMin: false, isMax: false };
        
    // Get the scales.
    const [ xDomain, setXDomain ] = useState([ xMin0, xMax0 ]);
    const [ yDomain, setYDomain ] = useState([ yMin0, yMax0 ]);
    xScale = d3.scaleLinear().domain( xDomain ).range([ margin.left + padding.left, width - margin.right - padding.right ]);
    yScale = d3.scaleLinear().domain( yDomain ).range([ height - margin.bottom - padding.bottom, margin.top + padding.top ]);
    symbolScale = d3.scaleOrdinal( data.map( datum => datum[ 0 ]), d3.symbols.map( s => d3.symbol().type( s ).size( 100 )()));
    
    // Zoom in two dimensions.
    let onZoom2D = ( isIn ) => {
        Graph.onZoom2D( isIn, xScale, yScale, xMin0, xMax0, yMin0, yMax0 );
        setXDomain( xScale.domain());
        setYDomain( yScale.domain());
    };
    
    // Zoom in one dimension.
    let onMouseDown = ( event ) => {
        Graph.onMouseDown( event, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, downLocation );
    },
    onMouseUp = ( event ) => {
        if( downLocation.isX || downLocation.isY ) {
            Graph.onMouseUp( event, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, downLocation );
            
            // For mousemove events, just redraw, as they seem to come in too quickly for the React framework...
            if( event.type === "mousemove" ) {
                Plot.draw( ref, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, xLabel, yLabel, dataSet, symbolScale );
            }
            
            // ...for mouseup events, set the state to cause a redraw.
            else {
                setXDomain( xScale.domain());
                setYDomain( yScale.domain());
            }
        }
    };
    
    // Set hook to draw on mounting, or on any other lifecycle update.
    useEffect(() => {
        Plot.draw( ref, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, xLabel, yLabel, dataSet, symbolScale );
    });
    
    // Return the component.
    return <Graph width={width} height={height} margin={margin} padding={padding}
        onZoom={onZoom2D} onMouseDown={onMouseDown} onMouseUp={onMouseUp} ref={ref} />
};
    
// Draws the points.
Plot.draw = ( ref, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, xLabel, yLabel, dataSet, symbolScale ) => {
    
    // Initialization.
    const svg = d3.select( ref.current );
    svg.selectAll( "*" ).remove();
    
    // Draw the points.
    let data = Data.getValues( dataSet );
    data.forEach(( datum ) => {
        svg.append( "path" )
        .attr( "d", symbolScale( datum[ 0 ]))
        .attr( "transform", d => "translate( " + Math.round( xScale( datum[ 2 ])) + ", " + Math.round( yScale( datum[ 1 ])) + " )" )
        .style( "fill", "none" )
        .style( "stroke", "black" );
    });
    
    // Draw the axes and scroll bars.
    Graph.draw( ref, height, width, margin, padding, xScale, yScale, xMin0, xMax0, yMin0, yMax0, xLabel, yLabel );
};

export default Plot;
