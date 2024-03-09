import React from 'react';
import AreaPlot from './AreaPlot';
import ScatterPlot from './ScatterPlot';
import './App.css';
import github from './github.svg';
import nielsen from './nielsen.jpg';

// Application:  Zooming Usability
const App = () => {
    
    // Return the App.
    return (
        <div className="Column">
            <div className="Description">
                <h1>Zooming Usability&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://github.com/hemanrobinson/zooming-usability/"><img className="icon" title="Code Shared on GitHub" alt="Code Shared on GitHub" src={github}/></a></h1>
                <p>
                The one great lesson of web usability is:  <i>people surf</i>.
                </p>
                <p>
                Jakob Nielsen recommends engaging the user <a href="https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/">within the first 10 seconds</a> -- because if users don't find value in a web page quickly, they move on.
                </p>
                <p className="center">
                    <a href="https://www.nngroup.com"><img title="Dr. Jakob Nielsen" alt="Dr. Jakob Nielsen" src={nielsen}/></a>
                </p>
                <p>
                We can deliver value quickly by following the principle of <a href="https://www.educative.io/answers/what-are-learnability-principles-for-usability">familiarity</a>:
                </p>
                <ul>
                    <li>"Users spend most of their time on other sites, and they prefer your site to work the same way." (<a href="https://lawsofux.com/jakobs-law/">Jakob's Law</a>) (Yablonski, 2020)</li>
                    <li>"Performing learned actions is easy.  Performing novel actions is hard." (Johnson, 2014)</li>
                    <li>"Use common designs that are familiar to most users." (Seeman-Horwitz et. al., 2021)</li>
                </ul>
                <p>
                For zooming, a familiar user interface includes scrollbars. Hover or touch the graphs below to see the scrollbars.
                </p>
                <h2>In One Dimension</h2>
                <p>
                The <a href="https://vega.github.io/vega/examples/overview-plus-detail/">Overview Plus Detail pattern</a> is familiar to many users. It combines a scrollbar with an overview of the data (Tidwell 2006) (Cockburn et. al., 2008).
                </p>
            </div>
            <div className="Graph">
                <AreaPlot dataSet={ "Stocks" } />
            </div>
            <div className="Description">
                <p>
                The middle of the scrollbar can be dragged to scroll the graph. Handles on the ends of the scrollbars enable zooming in one dimension.</p>
                <p>
                Many visualizations, including the ones on this page, also support the <a href="https://en.wikipedia.org/wiki/Scroll_wheel#:~:text=A%20scroll%20wheel%20is%20a,around%20an%20internal%20rotary%20encoder.">scroll wheel</a> for zooming, and drag actions on the data display or the axes for scrolling.
                </p>
                <p>
                For all these actions, scrollbars display <a href="https://givegoodux.com/feedback-5-principles-interaction-design-supercharge-ui-5-5/">feedback</a>, showing the user what they've done and what they can do.
                </p>
                <h2>In Two Dimensions</h2>
                <p>
                The familiar scrollbar easily generalizes to two dimensions. It's particularly useful that the scrollbars support one-dimensional zooming, when the scroll wheel does not.
                </p>
            </div>
            <div className="Graph">
                <ScatterPlot dataSet={ "Iris" } />
            </div>
            <div className="Description">
                <p>
                As in the one-dimensional case, the scrollbars give feedback on the user's actions. Whether they use the scrollbars, the scroll wheel, or dragging, the scrollbars show the user what they've done and what they can do.
                </p>
                <h2>User Interface</h2>
                <p>
                This design generalizes to higher dimensions: scrollbars can be placed beside the graph and labeled with the appropriate axis name. This  <a href="https://www.nngroup.com/articles/consistency-and-standards/">consistency</a> enables users to learn how things work in one place, then apply that knowledge in another.
                </p>
                <p>
                Graphs without limits, such as maps of the globe, can be supported by scrollbars that wrap around.
                </p>
                <p>
                Unlike the scroll wheel or the drag action, scrollbars display a visual <a href="https://xd.adobe.com/ideas/principles/web-design/what-is-affordance-design/">affordance</a>. Not all graphs can be zoomed and panned. The presence of scrollbars shows which ones can.
                </p>
                <p>
                Finally, for users who don't have a scroll wheel, or have difficulty using one, scrollbars can support an <a href="https://www.w3.org/WAI/fundamentals/accessibility-principles/">accessible</a> user interface (not implemented here) using Tab, Enter, and other keys to operate the controls.
                </p>
                <p>
                To minimize distraction from the data display, controls are fully displayed only when they can be used. How much of the controls are displayed depends on the purpose of the graph. Similarly, the scrollbars may or may not display histograms, depending on the purpose of the graph.
                </p>
                <p>
                In these examples, a drag action supports scrolling, in the data display, in the axes, or on the scrollbars. In practice, the drag action in the data display (<em>panning</em>) could be used for other purposes, for example to drag a brush.
                </p>
                <p>
                For a positive experience, the user must discover how to use our software quickly.  We can achieve this using the principle of <a href="https://www.goodfirms.co/blog/familiarity-in-product-design-and-marketing">familiarity</a>.  This ensures that our user interfaces are easily learned, because they are already known.
                </p>
                <h2>Implementation</h2>
                <p>
                This project uses <a href="https://react.dev">React</a>, <a href="https://github.com/mui-org/material-ui">Material-UI</a>, and <a href="https://github.com/d3/d3">d3</a>, and extends <a href="https://observablehq.com/@d3/x-y-zoom?collection=@d3/d3-zoom">Fil's X-Y Zoom</a>.
                </p>
                <h2>Further Reading</h2>
                <ul>
                    <li>Cockburn, A., Karlson, A., and Bederson, B. B. (2008).  "A Review of Overview+Detail, Zooming, and Focus+Context Interfaces". ACM Computing Surveys 41, 1. <a href="https://faculty.cc.gatech.edu/~stasko/7450/Papers/cockburn-surveys08.pdf">https://faculty.cc.gatech.edu/~stasko/7450/Papers/cockburn-surveys08.pdf</a>.</li><br/>
                    <li>Johnson, J. (2014). Designing with the Mind in Mind, Second Edition, 136-137. Waltham MA: Elsevier. <a href="https://www.elsevier.com/books/designing-with-the-mind-in-mind/johnson/978-0-12-818202-4">https://www.elsevier.com/books/designing-with-the-mind-in-mind/johnson/978-0-12-818202-4</a>.</li><br/>
                    <li>Liu, C., White, R., and Dumais, S. (2010). "Understanding Web Browsing Behaviors through Weibull Analysis of Dwell Time". Proceedings of the 33rd international ACM SIGIR conference on Research and Development in Information Retrieval (SIGIR '10), 379–386. <a href="https://www.microsoft.com/en-us/research/wp-content/uploads/2010/07/DwellTimeModel_sigir2010.pdf">https://www.microsoft.com/en-us/research/wp-content/uploads/2010/07/DwellTimeModel_sigir2010.pdf</a>.</li><br/>
                    <li>Nielsen, J. (2011). "How Long Do Users Stay on Web Pages?". Nielsen Norman Group. <a href="https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/">https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/</a>.</li><br/>
                    <li>Seeman-Horwitz, L., Montgomery, R., Lee, S., and Ran, R. (2021). "Making Content Usable for People with Cognitive and Learning Disabilities". W3C. <a href="https://www.w3.org/TR/coga-usable/#use-a-familiar-hierarchy-and-design-pattern">https://www.w3.org/TR/coga-usable/#use-a-familiar-hierarchy-and-design-pattern</a>.</li><br/>
                    <li>Tidwell, J. (2006). Designing Interfaces, First Edition, 174-175. Sebastopol CA: O'Reilly Media. <a href="https://www.oreilly.com/library/view/designing-interfaces-3rd/9781492051954/">https://www.oreilly.com/library/view/designing-interfaces-3rd/9781492051954/</a>.</li><br/>
                    <li>Yablonski, J. (2020). Laws of UX: Using Psychology to Design Better Products & Services, 1-12. Sebastopol CA: O'Reilly Media. <a href="https://www.oreilly.com/library/view/laws-of-ux/9781492055303/ch01.html">https://www.oreilly.com/library/view/laws-of-ux/9781492055303/ch01.html</a>.</li><br/>
                </ul>
            </div>
        </div>
    );
}

export default App;
