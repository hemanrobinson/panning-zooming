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
                <h1>Zooming Aggregate Graphs</h1>
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
                <h2>Zooming Scales and Aggregates</h2>
                <p>
                For graphs that display individual points, zooming requires only a simple rescaling.  However, for large data sets, we must group the data into bins, bars, tiles, or other aggregates.
                </p>
                <p>
                Therefore, exploring aggregate graphs requires zooming both scales and aggregates.  To maximize the user's flexibility, these must be independently zoomable.
                </p>
                <p>
                A slider control on the axis affords zooming of aggregates.  For continuous data, as in a histogram, users can explore their data by independently zooming scales and bins.
                </p>
            </div>
            <div className="Graph">
                <Histogram dataSet={ "Cytometry" } />
            </div>
            <div className="Description">
                <h2>Categorical Data</h2>
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
                <h2>Multiple Dimensions</h2>
                <p>
                This user interface extends readily to multiple dimensions.  To minimize distraction from the data display, controls can be displayed only when needed, on receiving a hover or tap event.  The heatmap below demonstrates both features.
                </p>
            </div>
            <div className="Graph">
                <Heatmap dataSet={ "Food" } />
            </div>
            <div className="Description">
                <h2>About This User Interface</h2>
                <p>
                On the Web, plus (+) and minus (-) buttons and scrollbars are so familiar, they present the user with a zero learning curve.  The handles on the ends of the scroll bars have no standard appearance; various forms of these are used in graphics applications.
                </p>
                <p>
                When a graph displays only one variable, the user rarely changes the dependent scale, so it's a convenient rule for the buttons to zoom as many variables as are displayed.
                </p>
                <p>
                For zooming aggregates, there are three locations where one can place controls:  on the data, along the axes, or outside the graph.
                </p>
                <p>
                The first location, on the data, can be implemented by a hand or "grabber" cursor.  A cursor does not interfere with the data display, but usability tests showed that this was difficult to learn.  This may be a cursor displays only a few pixels, so  may easily be missed, and because manipulating a data display is not a familiar action.
                </p>
                <p>
                The third location, outside the graph, is easy to learn.  The control can be more visible and labeled, such as a slider or entry field labeled "Bin Width:".  However, this location requires either additional screen real estate, which may not be available; or placement in a secondary dialog, which is less efficient for the user.
                </p>
                <p>
                The second location, a slider along the axis, is not as visible than the third; but manipulating a slider is a familiar action so still easily learned.
                </p>
            </div>
            <a href="https://github.com/hemanrobinson/zoom/">Shared on GitHub</a>
        </div>
    );
}

export default App;
