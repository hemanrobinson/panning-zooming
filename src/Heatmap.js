import React, { useEffect, useRef, useState }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './Graph.css';

/**
 * Heat map in an SVG element.
 *
 * The X and Y domains are both stored as states.
 *
 * The X and Y aggregate factors, which determine how the tiles are aggregated, are also stored as states.
 *
 * @param  {Object}  props  properties
 * @return component
 */
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
        histogram,
        bins,
        tiles;
        
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
    
    // Assign the X aggregate factor.
    const [ xAggregate, setXAggregate ] = useState( 0.5 );
    let onXAggregate = ( event, value ) => {
        setXDomain( xScale.domain());
        setXAggregate( value );
    };
    
    // Assign the Y aggregate factor.
    const [ yAggregate, setYAggregate ] = useState( 0 );
    let onYAggregate = ( event, value ) => {
        setYDomain( yScale.domain());
        setYAggregate( value );
    };

    // Calculate the X bins.
    histogram = d3.histogram()
        .value( d => d[ 1 ])
        .domain( xDomain0 )
        .thresholds( Math.round( Math.exp( 4 * xAggregate )));
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
    let n = Math.round( yAggregate * yDomain0.length );
    if( 0 < n ) {
        for( let j = bins.length; ( j > 0 ); j-- ) {
            let total = 0;
            for( let i = 1; ( i <= n ); i++ ) {
                total += tiles[ j * yDomain0.length - i ];
            }
            tiles.splice( j * yDomain0.length - n, n, total );
        }
        yDomain0.splice( yDomain0.length - n, n, "Other" );
    }
    
    // Assign the Y domain.
    yScale.domain( yDomain0 );
        
    // Zoom in two dimensions.
    let onZoom2D = ( isIn ) => {
        Graph.onZoom2D( isIn, xScale, yScale, xDomain0, yDomain0, true, true );
        Heatmap.draw( ref, width, height, margin, padding, true, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bins, tiles );
    };
    
    // Zoom in one dimension.
    let onMouseDown = ( event ) => {
        Graph.onMouseDown( event, width, height, margin, padding, xScale, yScale, xDomain0, yDomain0 );
    },
    onMouseUp = ( event ) => {
    
        // Initialization.
        let xUp = event.nativeEvent.offsetX,
            yUp = event.nativeEvent.offsetY,
            isZoomable = (( 0 <= xUp ) && ( xUp < width ) && ( 0 <= yUp ) && ( yUp < height ));
        
        // Handle the mouse up event...
        if( Graph.downLocation.isX || Graph.downLocation.isY ) {
            Graph.onMouseUp( ref, event, width, height, margin, padding, xScale, yScale, xDomain0, yDomain0 );
            Heatmap.draw( ref, width, height, margin, padding, isZoomable, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bins, tiles );
        }
    
        // ...or show or hide the controls.
        else {
            Graph.drawControls( ref, width, height, margin, padding, isZoomable, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel );
        }
    };
    
    // Set hook to draw on mounting or any state change.
    useEffect(() => {
        Heatmap.draw( ref, width, height, margin, padding, Graph.isVisibleControls( ref ), xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bins, tiles );
    });
    
    // Return the component.
    return <Graph width={width} height={height} margin={margin} padding={padding} isZoomable="false"
        onZoom={onZoom2D} onMouseDown={onMouseDown} onMouseUp={onMouseUp} xAggregate={0.5} yAggregate={0} onXAggregate={onXAggregate} onYAggregate={onYAggregate} ref={ref} />
};

/**
 * Draws the heat map.
 *
 * @param  {Object}    ref       reference to DIV
 * @param  {number}    width     width, in pixels
 * @param  {number}    height    height, in pixels
 * @param  {Box}       margin    margin
 * @param  {Box}       padding   padding
 * @param  {D3Scale}   xScale    X scale
 * @param  {D3Scale}   yScale    Y scale
 * @param  {Array}     xDomain0  Initial X domain
 * @param  {Array}     yDomain0  Initial Y domain
 * @param  {string}    xLabel    X axis label
 * @param  {string}    yLabel    Y axis label
 * @param  {Array}     bins      bins
 * @param  {number[]}  tiles     tiles
 */
Heatmap.draw = ( ref, width, height, margin, padding, isZoomable, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, bins, tiles ) => {
    
    // Initialization.
    const svg = d3.select( ref.current.childNodes[ 0 ]);
    svg.selectAll( "*" ).remove();

    // Draw the tiles.
    const nY = yDomain0.length;
    let colorScale = d3.scaleLinear().domain([ 0, d3.max( tiles, t => t )]).range([ "#99bbdd", "#ff0000" ]);
    svg.selectAll( "rect" )
        .data( tiles )
        .enter()
        .append( "rect" )
        .attr( "x", ( d, i ) => xScale( bins[( i / nY ) >> 0 ].x0 ))
        .attr( "y", ( d, i ) => yScale( yDomain0[ i % nY ]) + 1 )
        .attr( "width", ( d, i ) => xScale( bins[( i / nY ) >> 0 ].x1 ) - xScale( bins[( i / nY ) >> 0 ].x0 ) - 1 )
        .attr( "height", ( d ) => ( d > 0 ) ? yScale.bandwidth() - 1 : 0 )
        .style( "fill", ( d ) => colorScale( d ));
        
    // Draw the axes and the controls.
    Graph.drawAxes(     ref, width, height, margin, padding, isZoomable, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel );
    Graph.drawControls( ref, width, height, margin, padding, isZoomable, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel );
};

export default Heatmap;
