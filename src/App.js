import React from 'react';
import AreaPlot from './AreaPlot';
import ScatterPlot from './ScatterPlot';
import './App.css';
import nielsen from './nielsen.jpg';

// Application:  Learnable Zooming
const App = () => {
    
    // Return the App.
    return (
        <div className="Column">
            <div className="Description">
                <h1>Learnable Zooming</h1>
                <p>
                One great principle of web design is:  <i>people surf</i>.
                </p>
                <p>
                If users don't get value from a web page, quickly -- they move on.  Jakob Nielsen recommends engaging the user within <a href="https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/">10 seconds</a>.
                </p>
                <p className="center">
                    <a href="https://www.nngroup.com"><img alt="Dr. Jakob Nielsen" src={nielsen}/></a>
                </p>
                <p>
                For this reason, we should all be concerned with the <i>learnability</i> of our user interfaces.
                </p>
                <p>
                For zooming, the most easily learned user interface includes plus (+) and minus (-) buttons and scroll bars.  Handles on the ends of the scroll bars enable one-dimensional zooming.
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
                <p>
                Some user interfaces provide a way to zoom in by dragging a rectangle around objects of interest.  This feature is not highly learnable and is not implemented here.  However, it's an efficient way to zoom in, and is compatible with this design.  Dragging a rectangle has no clear inverse, but the minus (-) button provides an easy way to invert.
                </p>
            </div>
            <div className="Description">
                <h2>Design Notes</h2>
                <p>
                To minimize distraction from the data display, controls are displayed only when they can be used.  Controls are discoverable simply by hovering over the graph.
                </p>
                <p>
                Plus (+) and minus (-) buttons and scrollbars are standard controls, so the user has no learning curve. This design is the most easily learned because it is the most familiar.
                </p>
            </div>
            <a href="https://github.com/hemanrobinson/zoom/">Code Shared on GitHub</a>
        </div>
    );
}

export default App;
