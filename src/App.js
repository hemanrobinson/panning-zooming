import React from 'react';
import Plot from './Plot';
import Histogram from './Histogram';
import './App.css';

// Application:  Side-by-side scatter plots.
const App = () => {
    
    // Return the App.
    return (
        <div className="Column">
            <div className="Description">
                <h1>Applying Shneiderman's Mantra<br/>to Aggregate Graphs</h1>
                <p>
                Shneiderman taught us all to <a href="http://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf">"Overview first, zoom and filter, then details-on-demand"</a>.
                </p>
                <p>
                For graphs that display individual points, like scatter plots, zooming requires a simple rescaling.  On the Web, a familiar user interface displays plus (+) and minus (-) buttons.  Scroll bars provide both user feedback and one-dimensional zooming.
                </p>
            </div>
            <div className="Graph">
                <Plot dataSet={ "Cytometry" } />
            </div>
            <div className="Description">
                <p>
                For large data sets, displays of individual points are impractical.  Instead, we use aggregate graphs, which display grouped data.  For aggregate graphs, exploring data requires zooming both the scales and the groups.  To maximize the user's power, scales and groups must be independently adjustable.
                </p>
                <p>
                For example, in a histogram, users can explore their data by zooming both the scales and the bins.
                </p>
            </div>
            <div className="Graph">
                <Histogram dataSet={ "Cytometry" } />
            </div>
            <div className="Description">
                <h2>Notes</h2>
                <p>
                Three user interfaces were tested.
                </p>
                <p>
                Display primary controls on hover or click, so as not to distract from data display.
                </p>
                <p>
                Display secondary controls in a dialog.
                </p>
            </div>
        </div>
    );
}

export default App;
