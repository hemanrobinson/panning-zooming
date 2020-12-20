import React from 'react';
import Plot from './Plot';
import './App.css';

// Application:  Side-by-side scatter plots.
const App = () => {
    
    // Return the App.
    return (
        <div className="Column">
            <div className="Description">
                <h1>Implementing Shneiderman's Mantra<br/>for Aggregate Graphs</h1>
                <p>
                Shneiderman taught us all to <a href="http://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf">"Overview first, zoom and filter, then details-on-demand"</a>.  For graphs that display individual points, like scatter plots, zooming requires a simple rescaling.  On the Web, a familiar user interface displays plus (+) and minus (-) buttons with scroll bars.
                </p>
            </div>
            <div className="Graph">
                <Plot dataSet={ "Cytometry" } />
            </div>
            <div className="Description">
                <p>
                For aggregate graphs, which do not display individual points, rescaling is necessary but not sufficient.  For example, in a histogram, users can't explore their data by only adjusting the scale; they must also adjust the bin widths.
                </p>
            </div>
            <div className="Description">
                <h2>Notes</h2>
                <p>
                Display primary controls on hover or click.
                </p>
                <p>
                Display secondary controls in a dialog.
                </p>
                <p>
                It's important that scaling and "bin-zooming" be independent controls.
                </p>
            </div>
        </div>
    );
}

export default App;
