import React, { useEffect, useRef }  from 'react';
import * as d3 from 'd3';
import Data from './Data';
import Graph from './Graph';
import './Graph.css';

/**
 * Map in an SVG element.
 *
 * This component is stateless because the zoom can be calculated from the event coordinates and the initial domains.
 *
 * @param  {Object}  props  properties
 * @return component
 */
const Map = ( props ) => {

    // Initialization.
    const width = 400,
        height = 400,
        padding = { top: 20, right: 20, bottom: 20, left: 20 },
        margin = { top: 10, right: 10, bottom: 50, left: 50 };
    let ref = useRef(),
        { dataSet } = props,
        xLabel = Data.getColumnNames( dataSet )[ 1 ],
        yLabel = Data.getColumnNames( dataSet )[ 2 ],
        data = Data.getValues( dataSet ),
        xDomain0 = [ d3.min( data, d => d[ 1 ]), d3.max( data, d => d[ 1 ])],
        yDomain0 = [ d3.min( data, d => d[ 2 ]), d3.max( data, d => d[ 2 ])],
        xScale = d3.scaleLinear().domain( xDomain0 ).range([ margin.left + padding.left, width - margin.right - padding.right ]),
        yScale = d3.scaleLinear().domain( yDomain0 ).range([ height - margin.bottom - padding.bottom, margin.top + padding.top ]),
        symbolScale = d3.scaleOrdinal( data.map( datum => datum[ 0 ]), d3.symbols.map( s => d3.symbol().type( s ).size( 80 )()));
    
    // Zoom in two dimensions.
//    let onZoom2D = ( isIn ) => {
//        Graph.onZoom2D( isIn, xScale, yScale, xDomain0, yDomain0, true, true );
//        Map.draw( ref, width, height, margin, padding, true, false, false, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, dataSet, symbolScale );
//    };
    
    // Zoom in one dimension.
    let onMouseDown = ( event ) => {
        Graph.onMouseDown( event, width, height, margin, padding, true, -1, -1, xScale, yScale, xDomain0, yDomain0 );
    },
    onMouseUp = ( event ) => {
        if( Graph.downLocation.isX || Graph.downLocation.isY ) {
            Graph.onMouseUp( event, width, height, margin, padding, xScale, yScale, xDomain0, yDomain0 );
            Map.draw( ref, width, height, margin, padding, true, false, false, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, dataSet, symbolScale );
        }
    };
    
    // Show or hide the controls.
    let onMouseOver = ( event ) => {
        Graph.drawControls( ref, width, height, margin, padding, -1, -1, false, false, false, false, false, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel );
    };
    let onMouseOut = ( event ) => {
        let xUp = event.nativeEvent.offsetX,
            yUp = event.nativeEvent.offsetY,
            isZooming = (( 0 <= xUp ) && ( xUp < width ) && ( 0 <= yUp ) && ( yUp < height ));
        Graph.drawControls( ref, width, height, margin, padding, -1, -1, false, false, false, false, false, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel );
    };
    
    // Set hook to draw on mounting.
    useEffect(() => {
        Map.draw( ref, width, height, margin, padding, Graph.isZooming.get( ref ), false, false, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, dataSet, symbolScale );
    });
    
    // Return the component.
    return <Graph width={width} height={height} margin={margin} padding={padding}
        onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseOver={onMouseOver} onMouseOut={onMouseOut} ref={ref} />
};

/**
 * Draws the map.
 *
 * @param  {Object}   ref          reference to DIV
 * @param  {number}   width        width, in pixels
 * @param  {number}   height       height, in pixels
 * @param  {Box}      margin       margin
 * @param  {Box}      padding      padding
 * @param  {boolean}  isZooming    true iff drawing zoom controls
 * @param  {boolean}  isXBinning   true iff drawing bin controls in X dimension
 * @param  {boolean}  isYBinning   true iff drawing bin controls in Y dimension
 * @param  {D3Scale}  xScale       X scale
 * @param  {D3Scale}  yScale       Y scale
 * @param  {Array}    xDomain0     Initial X domain
 * @param  {Array}    yDomain0     Initial Y domain
 * @param  {string}   xLabel       X axis label
 * @param  {string}   yLabel       Y axis label
 * @param  {string}   dataSet      data set name
 * @param  {D3Scale}  symbolScale  symbol scale
 */
Map.draw = ( ref, width, height, margin, padding, isZooming, isXBinning, isYBinning, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel, dataSet, symbolScale ) => {
    
    // Initialization.
    const svg = d3.select( ref.current.childNodes[ 0 ]);
    svg.selectAll( "*" ).remove();
    
    // Get the scale and position.
    const xDomain = xScale.domain(),
//        yDomain = yScale.domain(),
        scale = ( width / 1.3 / Math.PI ) * ( xDomain0[ 1 ] - xDomain0[ 0 ]) / ( xDomain[ 1 ] - xDomain[ 0 ]),
        x = width / 2,
        y = height / 2;

//    x +=  width * ( xDomain[ 0 ] - xDomain0[ 0 ]) / ( xDomain0[ 1 ] - xDomain0[ 0 ]);
//    y += height * ( yDomain[ 0 ] - yDomain0[ 0 ]) / ( yDomain0[ 1 ] - yDomain0[ 0 ]);
    
    // Get the projection.
    var projection = d3.geoNaturalEarth1()
        .scale( scale )
        .translate([ x, y ]);

    // Load external data and draw the map.
    // @see https://d3-graph-gallery.com/graph/backgroundmap_basic.html
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then( function(data) {
        svg.append("g")
            .selectAll("path")
            .data(data.features)
            .join("path")
                .attr("fill", "#69b3a2")
                .attr("d", d3.geoPath()
                .projection(projection)
                )
                .style("stroke", "#fff");
    });
    
    // Draw the controls.
    Graph.drawControls( ref, width, height, margin, padding, -1, -1, false, false, false, isXBinning, isYBinning, xScale, yScale, xDomain0, yDomain0, xLabel, yLabel );
};

export default Map;
