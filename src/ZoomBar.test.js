import React from 'react';
import { ReactDOM, render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import * as d3 from 'd3';
import ZoomBar from './ZoomBar';

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

it( "creates a zoom bar", () => {

    // Initialization.
    const scale = d3.scaleLinear()
        .domain([ 1, 5 ])
        .range([ 0, 400 ])
        .nice();

    // Test first render and componentDidMount.
    act(() => {
        render( <ZoomBar width="400" height="400" scale={scale} domain0={[ 1, 5 ]} />, container );
    });

    // Test structure.
    expect( container.childNodes.length ).toBe( 1 );
    let div = container.firstChild;
    expect( div.nodeName ).toBe( "DIV" );
    let svg = div.firstChild;
    expect( svg.nodeName ).toBe( "svg" );
});

it( "returns width of zoom bar", () => {
    expect( ZoomBar.size ).toBe( 15 );
});

it( "returns mousedown location", () => {
    expect( ZoomBar.downLocation ).toEqual({ x: 0, y: 0, domain: undefined, isMin: false, isMax: false });
});

it( "returns initial and current domains", () => {
    expect( ZoomBar.getDomains([ 0, 1 ], [ 0, 1 ], false )).toEqual({ "d": 0, "max": 1, "max0": 1, "min": 0, "min0": 0 });
    expect( ZoomBar.getDomains([ "A", "B", "C" ], [ "A", "B", "C" ], true )).toEqual({ "d": 1, "max": 2, "max0": 2, "min": 0, "min0": 0 });
});

it( "zooms in one dimension: mousedown, mousemove, and mouseup events", () => {

    // Continuous scales.
    let scale = d3.scaleLinear().domain([ 0, 1 ]).range([ 0, 100 ]);
    ZoomBar.onPointerDown({ type: "pointerdown", nativeEvent: { offsetX: 100, offsetY: 390 }, preventDefault: () => {}}, 400, 400, scale, [ 0, 1 ]);
    expect( ZoomBar.downLocation ).toEqual({ x: 100, y: 390, domain: [ 0, 1 ], isMin: true, isMax: false });
    ZoomBar.onPointerUp({ type: "pointerup", nativeEvent: { offsetX: 100, offsetY: 390 }}, 400, 400, scale, [ 0, 1 ]);
    expect( ZoomBar.downLocation ).toEqual({ x: 100, y: 390, domain: undefined, isMin: false, isMax: false });
    ZoomBar.onPointerDown({ type: "pointerdown", nativeEvent: { offsetX: 10, offsetY: 100 }, preventDefault: () => {}}, 400, 400, scale, [ 0, 1 ]);
    expect( ZoomBar.downLocation ).toEqual({ x: 10, y: 100, domain: [ 0, 1 ], isMin: false, isMax: false });
    ZoomBar.onPointerUp({ type: "pointerup", nativeEvent: { offsetX: 100, offsetY: 390 }}, 400, 400, scale, [ 0, 1 ]);
    expect( ZoomBar.downLocation ).toEqual({ x: 10, y: 100, domain: undefined, isMin: false, isMax: false });
    
    // Categorical scales.
    scale = d3.scaleBand().domain( "A", "B", "C" ).range([ 0, 100 ]);
    ZoomBar.onPointerDown({ type: "pointerdown", nativeEvent: { offsetX: 100, offsetY: 390 }, preventDefault: () => {}}, 400, 400, scale, [ "A" ]);
    expect( ZoomBar.downLocation ).toEqual({ x: 100, y: 390, domain: [ "A" ], isMin: true, isMax: false });
    ZoomBar.onPointerUp({ type: "pointerup", nativeEvent: { offsetX: 100, offsetY: 390 }}, 400, 400, scale, [ "A" ]);
    expect( ZoomBar.downLocation ).toEqual({ x: 100, y: 390, domain: undefined, isMin: false, isMax: false });
    ZoomBar.onPointerDown({ type: "pointerdown", nativeEvent: { offsetX: 10, offsetY: 100 }, preventDefault: () => {}}, 400, 400, scale, [ "A" ]);
    expect( ZoomBar.downLocation ).toEqual({ x: 10, y: 100, domain: [ "A" ], isMin: false, isMax: false });
    ZoomBar.onPointerUp({ type: "pointerup", nativeEvent: { offsetX: 100, offsetY: 390 }}, 400, 400, scale, [ "A" ]);
    expect( ZoomBar.downLocation ).toEqual({ x: 10, y: 100, domain: undefined, isMin: false, isMax: false });
    
    // TODO:  Test more cases here.
});

it( "draws the zoom bar", () => {
    let ref = { current: { childNodes: [
            document.createElement( "svg" )
        ]}},
        scale = d3.scaleLinear().domain([ 0, 1 ]).range([ 0, 100 ]),
        svg = d3.select( ref.current.childNodes[ 0 ]);
    ZoomBar.draw( svg, scale, [ 0, 1 ], true, false );
});

