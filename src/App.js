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
                The one great lesson of web design is:  <i>people surf</i>.
                </p>
                <p>
                If users don't get value from a web page, quickly -- they move on.  For this reason, Jakob Nielsen recommends engaging the user <a href="https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/">within the first 10 seconds</a>.
                </p>
                <p className="center">
                    <a href="https://www.nngroup.com"><img alt="Dr. Jakob Nielsen" src={nielsen}/></a>
                </p>
                <p>
                This is why we strive for <i>learnability</i> in our web applications.
                </p>
                <p>
                For zooming, the most familiar user interface includes plus (+) and minus (-) buttons and scroll bars.  These are standard controls, for which the user has no learning curve.
                </p>
                <p>
                Hover over the graphs below to see the zooming controls.  Use the buttons and scrollbars to adjust the bins.
                </p>
            </div>
            <div className="Description">
                <h2>Two Dimensions</h2>
                <p>
                Plus (+) and minus (-) buttons and scrollbars are sufficient for the user to zoom in on any objects of interest.  The handles on the ends of the scrollbars require some learning curve, but provide visible affordances for one-dimensional zooming and fine-grained adjustments.
                </p>
            </div>
            <div className="Graph">
                <ScatterPlot dataSet={ "Iris" } />
            </div>
            <div className="Description">
                <h2>One Dimension</h2>
                <p>
                Plus (+) and minus (-) buttons and scrollbars are compatible with other design patterns.  One-dimensional zooming often employs the <a href="https://observablehq.com/@d3/focus-context">overview-plus-detail</a> pattern, which combines the scrollbar with an overview of the data.
                </p>
            </div>
            <div className="Graph">
                <AreaPlot dataSet={ "Stocks" } />
            </div>
            <div className="Description">
                <h2>Design Notes</h2>
                <p>
                To minimize distraction from the data display, controls are fully displayed only when they can be used.  Controls are discoverable by hovering over the graph.
                </p>
                <p>
                This design supports advanced features that save steps for the user.  A drag action in the data display can support two-dimensional panning, or zooming in on objects of interest.  These features are less easily learned, because they have no visible affordance.  But either can be implemented, and separate modes could support both.
                </p>
                <p>
                This design is for desktops; a mobile design follows the same principles.  On mobile, plus (+) and minus (-) buttons are not standard; instead, the pinch and swipe gestures support zooming and panning.  On mobile, the user can't hover, but scrollbars are unobtrusive:  they grow when the user scrolls, and shrink when they stop.  The axes are natural locations for pinching and swiping, with scrollbars, to support zooming and panning in one dimension.  In two dimensions, separate modes can eliminate confusion between zooming and panning the data display versus the whole page.
                </p>
                <p>
                The user's goal is not to learn our user interface.  For this reason, our goal is to get the user value, quickly.  They can learn our advanced features if they have time.
                </p>
                <p>
                We can achieve learnability by following standards.  This makes our user interfaces easily learned, because they are familiar.
                </p>
                <br/>
                <h2>References</h2>
                <ul>
                    <li><a href="https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/">Nielsen, Jakob. (2011). "How Long Do Users Stay on Web Pages?". Nielsen Norman Group</a><br/>Nielsen's recommendation, based on research by Liu et. al.</li>
                    <li><a href="https://www.microsoft.com/en-us/research/wp-content/uploads/2010/07/DwellTimeModel_sigir2010.pdf">Liu, C., White, R., and Dumais, S. (2010). "Understanding Web Browsing Behaviors through Weibull Analysis of Dwell Time". Proceedings of the 33rd international ACM SIGIR conference on Research and Development in Information Retrieval (SIGIR '10).</a><br/>Original research by Liu et. al.</li>
                    <li><a href="https://www.oreilly.com/library/view/laws-of-ux/9781492055303/ch01.html">Yablonski, J. (2020). Laws of UX: Using Psychology to Design Better Products & Services. Sebastopol CA: O'Reilly Media.</a><br/>Jakob's Law: "Users spend most of their time on other sites, and they prefer your site to work the same way as all the other sites they already know."</li>
                </ul>
            </div>
            <a href="https://github.com/hemanrobinson/zoom/">Code Shared on GitHub</a>
        </div>
    );
}

export default App;
