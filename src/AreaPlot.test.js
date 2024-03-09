import React from 'react';
import { ReactDOM, render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import * as d3 from 'd3';
import Graph from './Graph';
import AreaPlot from './AreaPlot';

let container = null;

// Sets up a DOM element as a render target.
beforeEach(() => {
    window.PointerEvent = MouseEvent;   // PointerEvent is not supported in JSDOM
    container = document.createElement( "div" );
    document.body.appendChild( container );
});

// Cleans up on exit.
afterEach(() => {
    unmountComponentAtNode( container );
    container.remove();
    container = null;
});

it( "creates a AreaPlot element", () => {
    
    // Test first render and componentDidMount.
    act(() => {
        render( <AreaPlot width="400" height="400" />, container );
    });
    
    // Test structure.
    expect( container.childNodes.length ).toBe( 1 );
    let div = container.firstChild;
    expect( div.nodeName ).toBe( "DIV" );
    let svg = div.firstChild;
    expect( svg.nodeName ).toBe( "svg" );
});

it( "draws the AreaPlot", () => {
    let ref = { current: { childNodes: [
            document.createElement( "svg" ),
            document.createElement( "BUTTON" ),
            document.createElement( "BUTTON" ),
            document.createElement( "SPAN" ),
            document.createElement( "SPAN" )
        ]}},
        margin = { top: 0, right: 0, bottom: 50, left: 50 },
        padding = { top: 0, right: 0, bottom: 0, left: 0 },
        xScale = d3.scaleLinear().domain([ 0, 1 ]).range([ 0, 100 ]),
        yScale = d3.scaleLinear().domain([ 0, 1 ]).range([ 0, 100 ]),
        xScale1 = d3.scaleLinear().domain([ 0, 1 ]).range([ 0, 100 ]),
        yScale1 = d3.scaleLinear().domain([ 0, 1 ]).range([ 0, 100 ]),
        symbolScale = d3.scaleOrdinal([ 0, 1 ], d3.symbols.map( s => d3.symbol().type( s ).size( 100 )()));
    AreaPlot.draw( ref, margin, padding, 0, false, xScale, yScale, xScale1, yScale1, [ 0, 1 ], [ 0, 1 ], "X", "Y", "Iris" );
});
