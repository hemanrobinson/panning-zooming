import React, { useEffect, useRef, useState }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './Heatmap.css';

// Heat map in an SVG element.
const Heatmap = ( props ) => {
    
    // Initialization.
    const width = 400,
        height = 600,
        padding = { top: 20, right: 20, bottom: 10, left: 10 },
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
        
    // Assign state for display of zoom controls.
    const [ isZoomable, setIsZoomable ] = useState( false );
    let onIsZoomable = ( isZoomable ) => {
        setIsZoomable( isZoomable );
        setXDomain( xScale.domain());
        setYDomain( yScale.domain());
    };
        
    // Get the X scale.
    const [ xDomain, setXDomain ] = useState( xDomain0 );
    xScale = d3.scaleLinear().domain( xDomain ).range([ margin.left + padding.left, width - margin.right - padding.right ]);
    
    // Get the unique Y values.
    let values = Array.from( d3.rollup( data, v => v.length, d => d[ 0 ]));
    values.sort(( a, b ) => ( b[ 1 ] - a[ 1 ]));
    yDomain0 = values.map( x => x[ 0 ]);
        
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

    // Calculate the X bins.
    histogram = d3.histogram()
        .value( d => d[ 1 ])
        .domain( xDomain0 )
        .thresholds( Math.round( 8 + Math.exp( 5 * xGroup )));
    bins = histogram( data );
    
    // Count the number of values in each tile.
    tiles = [];
    bins.forEach(( bin ) => {
        let t = [];
        for( let i = 0; ( i < yDomain0.length ); i++ ) {
            t[ i ] = 0;
        }
        bin.forEach(( b ) => {
            let k = yDomain0.indexOf( b[ 0 ]);
            t[ k ]++;
        })
        tiles = tiles.concat( t );
    });
    
    // Combine tiles if requested.
    let n = Math.round( yGroup * yDomain0.length );
    if( 0 < n ) {
        for( let j = bins.length - 1; ( j >= 0 ); j-- ) {
            let total = 0;
            for( let i = 0; ( i < n ); i++ ) {
                total += tiles[ j * yDomain0.length - i - 1 ];
            }
            tiles.splice( j * yDomain0.length - n, n, total );
        }
        yDomain0.splice( yDomain0.length - n, n, "Other" );
    }
    
    // Assign the Y domain.
    yScale.domain( yDomain0 );
        
    // Zoom in two dimensions.
    let onZoom2D = ( isIn ) => {
        Graph.onZoom2D( isIn, xScale, yScale, xDomain0, yDomain0 );
        Heatmap.draw( ref, height, width, margin, padding, isZoomable, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bins, tiles );
    };
    
    // Zoom in one dimension.
    let onMouseDown = ( event ) => {
        Graph.onMouseDown( event, height, width, margin, padding, xScale, yScale, xDomain0, yDomain0, downLocation );
    },
    onMouseUp = ( event ) => {
        if( downLocation.isX || downLocation.isY ) {
            Graph.onMouseUp( event, height, width, margin, padding, xScale, yScale, xDomain0, yDomain0, downLocation );
            Heatmap.draw( ref, height, width, margin, padding, isZoomable, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bins, tiles );
        }
    };
    
    // Set hook to draw on mounting, or on any other lifecycle update.
    useEffect(() => {
        Heatmap.draw( ref, height, width, margin, padding, isZoomable, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bins, tiles );
    });
    
    // Return the component.
    return <Graph width={width} height={height} margin={margin} padding={padding}
        isZoomable={isZoomable.toString()} onMouseOver={() => { onIsZoomable( true )}} onMouseOut={() => { onIsZoomable( false )}}
        onZoom={onZoom2D} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onXGroup={onXGroup} onYGroup={onYGroup} ref={ref} />
};
    
// Draws the Bar Chart.
Heatmap.draw = ( ref, height, width, margin, padding, isZoomable, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bins, tiles ) => {
    
    // Initialization.
    const svg = d3.select( ref.current );
    svg.selectAll( "*" ).remove();
    
    // Get the color scale.
    let colorScale = d3.scaleLinear().domain([ 0, d3.max( tiles, t => t )]).range([ "#99bbdd", "#ff0000" ]);

    // Draw the tiles.
    const nY = yDomain0.length;
    svg.selectAll( "rect" )
        .data( tiles )
        .enter()
        .append( "rect" )
        .attr( "x", ( d, i ) => xScale( bins[( i / nY ) >> 0 ].x0 ))
        .attr( "y", ( d, i ) => yScale( yDomain0[ i % nY ]) + 1 )
        .attr( "width", ( d, i ) => xScale( bins[( i / nY ) >> 0 ].x1 ) - xScale( bins[( i / nY ) >> 0 ].x0 ) - 1 )
        .attr( "height", ( d ) => ( d > 0 ) ? yScale.bandwidth() - 1 : 0 )
        .style( "fill", ( d ) => colorScale( d ));
        
    // Draw the axes and scroll bars.
    Graph.draw( ref, height, width, margin, padding, isZoomable, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel );
};

export default Heatmap;
