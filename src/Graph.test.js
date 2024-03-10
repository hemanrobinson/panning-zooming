import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Graph from './Graph';

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

it( "creates a Graph element", () => {
    
    // Test first render and componentDidMount.
    act(() => {
        ReactDOM.render(<Graph width={ 400 } height={ 400 } margin={{ top: 0, right: 0, bottom: 0, left:0 }} padding={{ top: 0, right: 0, bottom: 0, left:0 }} />, container );
    });
    
    // Test structure.
    const div = container.querySelector( "div" );
    expect( div.childNodes.length ).toBe( 1 );
    expect( div.childNodes[ 0 ].nodeName ).toBe( "svg" );
});

it( "draws the axes", () => {
    let ref = { current: { childNodes: [
            document.createElement( "svg" )
        ]}},
        margin = { top: 0, right: 0, bottom: 50, left: 50 },
        padding = { top: 0, right: 0, bottom: 0, left: 0 },
        xScale = d3.scaleLinear().domain([ 0, 1 ]).range([ 0, 100 ]),
        yScale = d3.scaleLinear().domain([ 0, 1 ]).range([ 0, 100 ]);
    Graph.drawAxes( d3.select( ref.current.childNodes[ 0 ]), margin, padding, 0, 0, xScale, yScale, [ 0, 1 ], [ 0, 1 ], "X", "Y" );
});
