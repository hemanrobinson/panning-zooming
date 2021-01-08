import { act, render, screen } from '@testing-library/react';
import ReactDOM from 'react-dom';
import App from './App';

let container;

beforeEach(() => {
    container = document.createElement( "div" );
    document.body.appendChild( container );
});

afterEach(() => {
    document.body.removeChild( container );
    container = null;
});

it( "renders App with childnodes", () => {
    
    // Test first render and componentDidMount.
    act(() => {
        ReactDOM.render(<App />, container );
    });
    
    // Test structure.
    const div = container.querySelector( "div" );
    expect( div.className ).toBe( "Column" );
    expect( div.childNodes.length ).toBe( 9 );
    for( let i = 0; ( i < div.childNodes.length - 1 ); i += 2 ) {
        expect( div.childNodes[ i ].className ).toBe( "Description" );
        expect( div.childNodes[ i + 1 ].className ).toBe( "Graph" );
    }
});
