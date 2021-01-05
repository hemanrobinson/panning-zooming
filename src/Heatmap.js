import React, { useEffect, useRef, useState }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './Heatmap.css';

// Heat map in an SVG element.
const Heatmap = ( props ) => {
    
    // Initialization.
    const width = 600,
        height = 400,
        padding = { top: 20, right: 20, bottom: 0, left: 0 },
        margin = { top: 0, right: 0, bottom: 50, left: 80 };
    let ref = useRef(),
        { dataSet } = props,
        xLabel = Data.getColumnNames( dataSet )[ 1 ],
        yLabel = Data.getColumnNames( dataSet )[ 0 ],
        data = Data.getValues( dataSet ),
        xDomain0 = [ d3.min( data, d => d[ 1 ]), d3.max( data, d => d[ 1 ])],
        yDomain0,
        xScale,
        yScale,
        downLocation = { x: 0, y: 0, xDomain: [], yDomain: [], isX: false, isY: false, isMin: false, isMax: false },
        histogram,
        bins,
        tiles;
        
    // Get the X scale.
    const [ xDomain, setXDomain ] = useState( xDomain0 );
    xScale = d3.scaleLinear().domain( xDomain ).range([ margin.left + padding.left, width - margin.right - padding.right ]);
        
    // Get the unique values.
    let values = data.map( datum => datum[ 0 ]);
    yDomain0 = values.filter(( item, index ) => ( values.indexOf( item ) === index ));
        
    // Get the Y scale.
    const [ yDomain, setYDomain ] = useState( yDomain0 );
    yScale = d3.scaleBand().domain( yDomain ).range([ height - margin.bottom - padding.bottom, margin.top + padding.top ]);
    
    // Assign the X group factor.
    const [ xGroup, setXGroup ] = useState( 0 );
    let onXGroup = ( event, value ) => {
        setXDomain( xScale.domain());
        setXGroup( value );
    };
    
    // Assign the Y group factor.
    const [ yGroup, setYGroup ] = useState( 0 );
    let onYGroup = ( event, value ) => {
        setYDomain( yScale.domain());
        setYGroup( value );
    };

    // Calculate the bins.
    histogram = d3.histogram()
        .value( d => d[ 1 ])
        .domain( xDomain0 )
        .thresholds( Math.round( 8 + Math.exp( 5 * xGroup )));
    bins = histogram( data );
    
    // Count the number of values in each bin.
    tiles = [];
    bins.forEach(( bin ) => {
        let t = [];
        for( let i = 0; ( i < yDomain0.length ); i++ ) {
            t[ i ] = { y: yDomain[ i ], count: 0 };
        }
        bin.forEach(( b ) => {
            let k = yDomain0.indexOf( b[ 0 ]);
            t[ k ].count++;
            t[ k ].x0 = bin.x0;
            t[ k ].x1 = bin.x1;
        })
        tiles = tiles.concat( t );
    });
        
    // Zoom in two dimensions.
    let onZoom2D = ( isIn ) => {
        Graph.onZoom2D( isIn, xScale, yScale, xDomain0, yDomain0 );
        Heatmap.draw( ref, height, width, margin, padding, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bins, tiles );
    };
    
    // Zoom in one dimension.
    let onMouseDown = ( event ) => {
        Graph.onMouseDown( event, height, width, margin, padding, xScale, yScale, xDomain0, yDomain0, downLocation );
    },
    onMouseUp = ( event ) => {
        if( downLocation.isX || downLocation.isY ) {
            Graph.onMouseUp( event, height, width, margin, padding, xScale, yScale, xDomain0, yDomain0, downLocation );
            Heatmap.draw( ref, height, width, margin, padding, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bins, tiles );
        }
    };
    
    // Set hook to draw on mounting, or on any other lifecycle update.
    useEffect(() => {
        Heatmap.draw( ref, height, width, margin, padding, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bins, tiles );
    });
    
    // Return the component.
    return <Graph width={width} height={height} margin={margin} padding={padding}
        onZoom={onZoom2D} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onXGroup={onXGroup} onYGroup={onYGroup} ref={ref} />
};
    
// Draws the Bar Chart.
Heatmap.draw = ( ref, height, width, margin, padding, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bins, tiles ) => {
    
    // Initialization.
    const svg = d3.select( ref.current );
    svg.selectAll( "*" ).remove();
    
    // Get the color scale.
    let colorScale = d3.scaleLinear().domain([ 0, d3.max( tiles, t => t.count )]).range([ "#99bbdd", "#ff0000" ]);

    // Draw the tiles.
    let w = xScale( tiles[ 0 ].x1 ) - xScale( tiles[ 0 ].x0 ) - 1,
        h = yScale.bandwidth() - 1;
    svg.selectAll( "rect" )
        .data( tiles )
        .enter()
        .append( "rect" )
        .attr( "x", ( d ) => xScale( d.x0 ))
        .attr( "y", ( d ) => yScale( d.y ) + 1 )
        .attr( "width", w )
        .attr( "height", h )
        .style( "fill", ( d ) => colorScale( d.count ));
        
    // Draw the axes and scroll bars.
    Graph.draw( ref, height, width, margin, padding, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel );
};

export default Heatmap;
