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
                <h1>Applying Shneiderman's Mantra<br/>to Aggregate Graphs</h1>
                <p>
                Shneiderman taught us all to <a href="http://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf">"Overview first, zoom and filter, then details-on-demand"</a>.
                </p>
                <p>
                These operations are straightforward for graphs that display individual points, like the scatter plot below.  For zooming, on the Web, a familiar user interface displays plus (+) and minus (-) buttons.  Scroll bars provide both user feedback and one-dimensional zooming.
                </p>
            </div>
            <div className="Graph">
                <ScatterPlot dataSet={ "Cytometry" } />
            </div>
            <div className="Description">
                <h2>Zooming Aggregate Graphs</h2>
                <p>
                For graphs that display individual points, zooming requires only a simple rescaling.  However, for large data sets, we can't display individual points, but must group the data into bins, bars, tiles, or other aggregates.
                </p>
                <p>
                Therefore, exploring aggregate graphs requires zooming both scales and aggregates; and to maximize the user's flexibility, these must be independently zoomable.
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
                This user interface extends readily to multiple dimensions.  To minimize distraction from the data display, controls can be displayed only when needed, upon a hover or tap event.  The heatmap below demonstrates both features.
                </p>
            </div>
            <div className="Graph">
                <Heatmap dataSet={ "Food" } />
            </div>
            <div className="Description">
                <h2>Why This User Interface</h2>
                <p>
                There are three positions where one can place controls for zooming:  on the data, along the axes, or outside the graph.
                </p>
                <p>
                Usability tests showed that the first position, on the data, was implemented by means of a hand or "grabber" cursor.  This position was most difficult to learn.  This may be because manipulating a data display is not a familiar action, and a hand cursor displays only a few pixels, so it may easily be missed.
                </p>
                <p>
                The third position, outside the graph, was the easiest to learn.  The control can be more visible and labeled, e.g. a slider labeled "Zoom Factor (0-1):", or an entry field labeled "Bin Width:".  However, this position requires additional screen real estate, which may not be available; or placement in a secondary dialog, which is less efficient for the user.
                </p>
                <p>
                The middle choice, a slider along the axis, is less visible than outside the graph.  However, this position was still easily learned, and test participants were able to correctly use the controls.
                </p>
                <p>
                The graphs above are implemented in React and d3, and the source code is available to anyone who wants it.
                </p>
            </div>
        </div>
    );
}

export default App;
