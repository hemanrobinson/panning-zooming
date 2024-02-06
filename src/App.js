import React from 'react';
import AreaPlot from './AreaPlot';
import ScatterPlot from './ScatterPlot';
import './App.css';
import github from './github.svg';
import nielsen from './nielsen.jpg';

// Application:  Discoverable Zooming
const App = () => {
    
    // Return the App.
    return (
        <div className="Column">
            <div className="Description">
                <h1>Discoverable Zooming&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://github.com/hemanrobinson/zoom/"><img className="icon" title="Code Shared on GitHub" alt="Code Shared on GitHub" src={github}/></a></h1>
                <p>
                The one great lesson of web design is:  <i>people surf</i>.
                </p>
                <p>
                Jakob Nielsen recommends engaging the user <a href="https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/">within the first 10 seconds</a> -- because if users don't find value in a web page, quickly, they move on.
                </p>
                <p className="center">
                    <a href="https://www.nngroup.com"><img title="Dr. Jakob Nielsen" alt="Dr. Jakob Nielsen" src={nielsen}/></a>
                </p>
                <p>
                For this reason, we want our user interfaces to achieve <a href="https://www.interaction-design.org/literature/article/make-it-easy-on-the-user-designing-for-discoverability-within-mobile-apps">discoverability</a>:  "the ease at which users can find new features or functions... and learn to use the things that they find."
                </p>
                <p>
                The most easily discovered user interface is one that the users already know.  This is the principle of <a href="https://www.educative.io/answers/what-are-learnability-principles-for-usability">familiarity</a>:
                </p>
                <ul>
                    <li>"Users spend most of their time on other sites, and they prefer your site to work the same way." (<a href="https://lawsofux.com/jakobs-law/">Jakob's Law</a>) (Yablonski, 2020)</li>
                    <li>"Performing learned actions is easy.  Performing novel actions is hard." (Johnson, 2014)</li>
                    <li>"Use common designs that are familiar to most users." (Seeman-Horwitz et. al., 2021)</li>
                </ul>
                <p>
                For zooming, a familiar user interface includes scrollbars, which show the user a) that they can zoom and b) where they have zoomed.
                </p>
                <p>
                For these familiar controls, the user has no learning curve.  Hover or touch the graphs below to see the scrollbars.
                </p>
                <h2>In Two Dimensions</h2>
                <p>
                Scrollbars don't preclude use of the scroll wheel for zooming, or the drag action for panning.  However, these actions have no <a href="https://xd.adobe.com/ideas/principles/web-design/what-is-affordance-design/">affordance</a>.  Not all graphs can be zoomed and panned.  Scrollbars show which ones can.
                </p>
            </div>
            <div className="Graph">
                <ScatterPlot dataSet={ "Iris" } />
            </div>
            <div className="Description">
                <p>
                Also, scrollbars show the result of the scroll wheel or the drag action.  This <a href="https://givegoodux.com/feedback-5-principles-interaction-design-supercharge-ui-5-5/">feedback</a> informs the user of what they've done, and what they can do.
                </p>
                <p>
                Finally, scrollbars are easier for users who don't have a scroll wheel, or have difficulty using one.  Handles on the ends of the scrollbars enable zooming in one dimension.
                </p>
                <h2>In One Dimension</h2>
                <p>
                The <a href="https://vega.github.io/vega/examples/overview-plus-detail/">Overview Plus Detail pattern</a> combines the scrollbar with an overview of the data (Tidwell 2006) (Cockburn et. al., 2008).
                </p>
            </div>
            <div className="Graph">
                <AreaPlot dataSet={ "Stocks" } />
            </div>
            <div className="Description">
                <p>
                Drawing 1D and 2D scrollbars in consistent styles is another way to ease the user's learning curve.  <a href="https://www.nngroup.com/articles/consistency-and-standards/">Consistency</a> enables users to learn how things work in one place, then apply that knowledge in another.
                </p>
                <h2>Usability</h2>
                <p>
                This implementation extends <a href="https://observablehq.com/@d3/x-y-zoom?collection=@d3/d3-zoom">Fil's X-Y Zoom</a>.
                </p>
                <p>
                To minimize distraction from the data display, controls are fully displayed only when they can be used.
                </p>
                <p>
                A drag action in the data display supports 2D panning.  A drag action in the axes supports 1D panning.  This frees the drag action in the data display for other uses, for example to drag a brush.
                </p>
                <p>
                This design can extend to three or more dimensions by displaying scrollbars outside the graph.  Graphs without limits, such as maps of the globe, can be supported by scrollbars that wrap around.
                </p>
                <p>
                For a positive experience, the user must discover how to use our software quickly.  We can achieve discoverability through familiarity.  This ensures that our user interfaces are easily learned, because they are already known.
                </p>
                <h2>Implementation</h2>
                <p>
                This project uses <a href="https://react.dev">React</a>, <a href="https://github.com/mui-org/material-ui">Material-UI</a>, and <a href="https://github.com/d3/d3">d3</a>.
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
