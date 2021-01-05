import React from 'react';
import ScatterPlot from './ScatterPlot';
import Histogram from './Histogram';
import BarChart from './BarChart';
import Heatmap from './Heatmap';
import './App.css';

// Application:  Side-by-side scatter plots.
const App = () => {
    
    // Return the App.
    return (
        <div className="Column">
            <div className="Description">
                <h1>Applying Shneiderman's Mantra<br/>to Zoom Aggregate Graphs</h1>
                <p>
                Shneiderman taught us all to <a href="http://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf">"Overview first, zoom and filter, then details-on-demand"</a>.
                </p>
                <p>
                For graphs that display individual points, like scatter plots, zooming requires a simple rescaling.  On the Web, a familiar user interface displays plus (+) and minus (-) buttons.  Scroll bars provide both user feedback and one-dimensional zooming.
                </p>
            </div>
            <div className="Graph">
                <ScatterPlot dataSet={ "Cytometry" } />
            </div>
            <div className="Description">
                <h2>Zooming Aggregate Graphs</h2>
                <p>
                For large data sets, we can't display individual points, but must aggregate the data into bins, bars, tiles, or other groupings.
                </p>
                <p>
                Therefore, exploring aggregate graphs requires zooming both the scales and the aggregates.  To maximize the user's flexibility, scales and aggregates must be independently zoomable.
                </p>
                <p>
                A slider control on the axis affords zooming of aggregates.  For continuous data, as in a histogram, users can explore their data by independently zooming scales and bins.
                </p>
            </div>
            <div className="Graph">
                <Histogram dataSet={ "Cytometry" } />
            </div>
            <div className="Description">
                <p>
                Categorical data presents a different problem.  When there are only a few categories, zooming doesn't help.  When there are many, zooming can be done by combining smaller categories into an "Other" category.
                </p>
                <p>
                Adjustable "Other" categories have been available in software for at least fifty years.  With a modern user interface, we can make the adjustment interactive and efficient for the user.  This is particularly useful when exploring "long-tailed" distributions, as in the bar chart below.
                </p>
            </div>
            <div className="Graph">
                <BarChart dataSet={ "Food" } />
            </div>
            <div className="Description">
                <p>
                This user interface extends readily to multiple dimensions.  To minimize distraction from the data display, controls can be displayed only when needed, upon a mouse hover or click event.  The heatmap below demonstrates both features.
                </p>
            </div>
            <div className="Graph">
                <Heatmap dataSet={ "Food" } />
            </div>
            <div className="Description">
                <h2>Why This User Interface</h2>
                <p>
                There are three places one can place a user interface for zooming:  on the data display, on the axis, or somewhere outside the graph.
                </p>
                <p>
                We hypothesized that the third position would be easiest to learn, because the control is more visible and can be labeled, e.g. a slider labeled "Zoom Factor (0-1):", or a numeric entry field labeled "Bin Width:".  However, this position requires additional screen real estate, which may be expensive; or placement in a secondary dialog, which is less efficient for the user.  Shneiderman's Mantra suggests that all four operations (overview, zoom, filter, details on demand) should be easy and efficient for the user to explore their data.
                </p>
                <p>
                Shneiderman also said that direct manipulation is superior to indirect manipulation.  This argues for the first position.  This user interface is implemented in JMP(r) software, using a hand cursor to manipulate histogram bars.  We hypothesized that this position would be most difficult to learn, because manipulating a data display directly is not a familiar action, and a hand cursor displays only a few pixels.
                </p>
                <p>
                These three user interfaces were tested.
                </p>
                <p>
                Display secondary controls in a dialog.
                </p>
            </div>
        </div>
    );
}

export default App;
