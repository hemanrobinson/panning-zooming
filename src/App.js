import React from 'react';
import ScatterPlot from './ScatterPlot';
import './App.css';

// Application:  Learnable Zooming
const App = () => {
    
    // Return the App.
    return (
        <div className="Column">
            <div className="Description">
                <h1>Learnable Zooming</h1>
                <p>
                What is the most easily learned user interface for zooming a graph?
                </p>
                <p>
                The most familiar user interface uses plus (+) and minus (-) buttons, with scroll bars to provide panning and user feedback.  Handles  on the ends of the scroll bars are less familiar, but are useful to support one-dimensional zooming.
                </p>
                <p>
                To minimize distraction from the data display, controls are displayed only when needed.  Hover over the graph to see the zooming controls.
                </p>
            </div>
            <div className="Graph">
                <ScatterPlot dataSet={ "Cytometry" } />
            </div>
            <div className="Description">
                <h2>About This User Interface</h2>
                <p>
                Plus (+) and minus (-) buttons and scrollbars are standard controls.  For these, the user has no learning curve.
                </p>
                <p>
                When a graph displays only one variable, the user rarely changes the dependent scale.  Therefore, it's convenient for the buttons to zoom <em>as many variables as are displayed,</em> e.g. one for a histogram, two for a scatter plot, and so on.
                </p>
                <p>
                There are many design patterns for zooming.
                For zooming in, an efficient design is to drag a rectangle around the objects of interest.  For one-dimensional zooming, the <a href="https://observablehq.com/@d3/focus-context">overview-plus-detail</a> pattern displays an overview instead of a scrollbar.
                </p>
                <p>
                This design does not preclude others; design elements can be combined.  The elements of this design are easily learned because they are familiar.
                </p>
            </div>
            <a href="https://github.com/hemanrobinson/zoom/">Code Shared on GitHub</a>
        </div>
    );
}

export default App;
