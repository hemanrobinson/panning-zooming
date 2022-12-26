import React from 'react';
import AreaPlot from './AreaPlot';
import ScatterPlot from './ScatterPlot';
import './App.css';

// Application:  Discoverable Zooming
const App = () => {
    
    // Return the App.
    return (
        <div className="Column">
            <div className="Description">
                <h1>Discoverable Zooming</h1>
                <p>
                What is the most easily learned user interface for zooming a graph?
                </p>
                <p>
                The most familiar user interface uses plus (+) and minus (-) buttons, with scroll bars to provide panning and user feedback.  Handles  on the ends of the scroll bars support one-dimensional zooming.
                </p>
                <p>
                Hover over the graphs below to see the zooming controls.  Use the buttons and scrollbars to adjust the bins.
                </p>
            </div>
            <div className="Graph">
                <ScatterPlot dataSet={ "Cytometry" } />
            </div>
            <div className="Description">
                <p>
                This design can be combined with other patterns.  One-dimensional zooming often employs the <a href="https://observablehq.com/@d3/focus-context">overview-plus-detail</a> pattern, which combines the scrollbar with an overview of the data.
                </p>
            </div>
            <div className="Graph">
                <AreaPlot dataSet={ "S&P 500" } />
            </div>
            <div className="Description">
                <h2>About this Design</h2>
                <p>
                Affordances are visible.  The user can see the zooming controls.
                </p>
                <p>
                To minimize distraction from the data display, controls are displayed only when they can be used.
                </p>
                <p>
                Plus (+) and minus (-) buttons and scrollbars are standard controls, so the user has no learning curve. This design is the most easily learned because it is the most familiar.
                </p>
                <p>
                Some user interfaces implement zooming in by dragging a rectangle around the area of interest.  This feature is not implemented here, but is compatible with this design.  Dragging a rectangle is the most efficient way to zoom in on a cluster of points.  
                </p>
            </div>
            <a href="https://github.com/hemanrobinson/zoom/">Code Shared on GitHub</a>
        </div>
    );
}

export default App;
