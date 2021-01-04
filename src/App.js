import React from 'react';
import Plot from './Plot';
import Histogram from './Histogram';
import BarChart from './BarChart';
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
                For large data sets, we can't display individual points, but must aggregate the data into bins, bars, tiles, or other groupings.  So for aggregate graphs, exploring data requires zooming both the scales and the aggregates.  To maximize the user's flexibility, scales and aggregates must be independently zoomable.
                </p>
                <p>
                Continuous data are typically grouped into bins, as in a histogram.  Users can explore their data by zooming both the scales and the bins.
                </p>
            </div>
            <div className="Graph">
                <Histogram dataSet={ "Cytometry" } />
            </div>
            <div className="Description">
                <p>
                Categorical data presents a different problem.  When there are only a few categories, there is no need to zoom.  When there are many, the equivalent of zooming can be done by combining smaller categories into an "Other" group.
                </p>
                <p>
                Adjustable "Other" groups have been available in software for at least fifty years.  With a modern user interface, we can make the adjustment interactive and efficient for the user.  This is particularly useful when exploring "long-tailed" distributions as in the bar chart below.
                </p>
            </div>
            <div className="Graph">
                <BarChart dataSet={ "Food" } />
            </div>
            <div className="Description">
                <p>
                This user interface extends readily to multiple dimensions.
                </p>
            </div>
            <div className="Graph">
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
