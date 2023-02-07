import React from 'react';
import AreaPlot from './AreaPlot';
import ScatterPlot from './ScatterPlot';
import Map from './Map';
import './App.css';
import nielsen from './nielsen.jpg';

// Application:  Learnable Zooming
const App = () => {

    // TODO:  Disable/enable the plus (+) and minus (-) buttons at their limits, and describe those limits in the Design Notes.
    
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
                    <a href="https://www.nngroup.com"><img title="Dr. Jakob Nielsen" alt="Dr. Jakob Nielsen" src={nielsen}/></a>
                </p>
                <p>
                This is why we strive for <i>learnability</i> in our web applications, and the most learnable user interface is one that the users already know.  UX designers emphasize this principle of <i>familiarity</i>:
                </p>
                <ul>
                 <li>"Users spend most of their time on other sites, and they prefer your site to work the same way." (<a href="https://lawsofux.com/jakobs-law/">Jakob's Law</a>) (Yablonski, 2020)</li>
                    <li>"Use common designs that are familiar to most users." (Seeman-Horwitz, Montgomery, Lee, and Ran, 2021)</li>
                    <li>"Performing learned actions is easy.  Performing novel actions is hard." (Johnson, 2014)</li>
                    <li>"Don't make me think!" (Krug, 2014)</li>
                </ul>
                <p>
                For zooming, the most familiar user interface includes plus (+) and minus (-) buttons.  They are standard controls, for which the user has no learning curve.
                </p>
                <p>
                Hover over the graphs below to see the zooming controls.
                </p>
                <h2>Two Dependent Dimensions</h2>
                <p>
                Plus (+) and minus (-) buttons are standard controls for zooming when dimensions are synchronized.  Two-dimensional panning is supported by dragging in the data display.
                </p>
            </div>
            <div className="Graph">
                <Map dataSet={ "World" } />
            </div>
            <div className="Description">
                <p>
                This is how maps work, in Google Maps, Apple Maps, Bing Maps, MapQuest, ArcGIS, OpenStreetMap, and others.This user interface is familiar to everyone.  It is also accessible to people who cannot use a scroll wheel.
                </p>
                <p>
                TODO:  Support scroll wheel.
                </p>
                <h2>Two Independent Dimensions</h2>
                <p>
                Unlike maps, other types of graphs may have independent dimensions; and the drag action in the data display may be needed for other purposes besides panning.
                </p>
                <p>
                Everyone has used scrollbars to pan in independent dimensions.  Handles on the ends of the scrollbars provide affordances for one-dimensional zooming.
                </p>
            </div>
            <div className="Graph">
                <ScatterPlot dataSet={ "Iris" } />
            </div>
            <div className="Description">
                <p>
                TODO:  Support scroll wheel along the axes for one-dimensional zooming.  The scroll wheel is faster for users who know it; but scrollbars are more easily learned, and the handles offer greater precision.
                </p>
                <h2>One Dimension</h2>
                <p>
                These controls are compatible with other design patterns.  One-dimensional zooming often employs the <a href="https://vega.github.io/vega/examples/overview-plus-detail/">Overview Plus Detail pattern</a> (Tidwell 2006) (Cockburn, Karlson, and Bederson, 2008), which combines the scrollbar with an overview of the data.
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
                This design supports advanced features that save steps for the user.  A drag action in the data display can support two-dimensional panning, or zooming in on objects of interest.  These features are less easily learned, because they have no visible affordance; but both could be implemented in separate modes, expressed through menus or a toolbox metaphor.
                </p>
                <p>
                If a drag in the data display supports two-dimensional panning, and the axes are synchronized, then scroll bars are not needed; plus (+) and minus (-) buttons are sufficient.  This is the familiar user experience for maps.
                </p>
                <p>
                This design follows desktop standards.  A mobile design applies the same principle to different standards.  On mobile, rather than plus (+) and minus (-) buttons, pinch and swipe gestures enable zooming and panning.  On mobile, the user can't hover, but scrollbars are unobtrusive:  they grow when the user scrolls, and shrink when they stop.  Because of the pinch gesture, scrollbars don't need handles.  The axes provide natural locations for zooming and panning in one dimension.  As on the desktop, two-dimensional zooming and panning can be supported as advanced features in separate modes.
                </p>
                TODO:  Support mobile devices.
                <p>
                </p>
                <p>
                The user always has some goal, and it's never to learn our user interface (no matter how much we admire it!).  For this reason, our goal must be to get the user value, quickly.  They can learn our advanced features if they have time.
                </p>
                <p>
                We can achieve learnability through familiarity, by following standards.  This ensures that our user interfaces are easily learned, because they are already known.
                </p>
                <br/>
                <h2>References</h2>
                <ul>
                    <li>Cockburn, A., Karlson, A., and Bederson, B. B. (2008).  "A Review of Overview+Detail, Zooming, and Focus+Context Interfaces". ACM Computing Surveys 41, 1. <a href="https://faculty.cc.gatech.edu/~stasko/7450/Papers/cockburn-surveys08.pdf">https://faculty.cc.gatech.edu/~stasko/7450/Papers/cockburn-surveys08.pdf</a>.</li><br/>
                    <li>Johnson, J. (2014). Designing with the Mind in Mind, Second Edition, 136-137. Waltham MA: Elsevier. <a href="https://www.elsevier.com/books/designing-with-the-mind-in-mind/johnson/978-0-12-818202-4">https://www.elsevier.com/books/designing-with-the-mind-in-mind/johnson/978-0-12-818202-4</a>.</li><br/>
                    <li>Krug, S. (2014). Don't Make Me Think!, Second Edition, 11. Berkeley CA: New Riders. <a href="http://sensible.com/dont-make-me-think/">http://sensible.com/dont-make-me-think/</a>.</li><br/>
                    <li>Liu, C., White, R., and Dumais, S. (2010). "Understanding Web Browsing Behaviors through Weibull Analysis of Dwell Time". Proceedings of the 33rd international ACM SIGIR conference on Research and Development in Information Retrieval (SIGIR '10), 379–386. <a href="https://www.microsoft.com/en-us/research/wp-content/uploads/2010/07/DwellTimeModel_sigir2010.pdf">https://www.microsoft.com/en-us/research/wp-content/uploads/2010/07/DwellTimeModel_sigir2010.pdf</a>.</li><br/>
                    <li>Nielsen, J. (2011). "How Long Do Users Stay on Web Pages?". Nielsen Norman Group. <a href="https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/">https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/</a>.</li><br/>
                    <li>Seeman-Horwitz, L., Montgomery, R., Lee, S., and Ran, R. (2021). "Making Content Usable for People with Cognitive and Learning Disabilities". W3C. <a href="https://www.w3.org/TR/coga-usable/#use-a-familiar-hierarchy-and-design-pattern">https://www.w3.org/TR/coga-usable/#use-a-familiar-hierarchy-and-design-pattern</a>.</li><br/>
                    <li>Tidwell, J. (2006). Designing Interfaces, First Edition, 174-175. Sebastopol CA: O'Reilly Media. <a href="https://www.oreilly.com/library/view/designing-interfaces-3rd/9781492051954/">https://www.oreilly.com/library/view/designing-interfaces-3rd/9781492051954/</a>.</li><br/>
                    <li>Yablonski, J. (2020). Laws of UX: Using Psychology to Design Better Products & Services, 1-12. Sebastopol CA: O'Reilly Media. <a href="https://www.oreilly.com/library/view/laws-of-ux/9781492055303/ch01.html">https://www.oreilly.com/library/view/laws-of-ux/9781492055303/ch01.html</a>.</li><br/>
                </ul>
            </div>
            <a href="https://github.com/hemanrobinson/zoom/">Code Shared on GitHub</a>
        </div>
    );
}

export default App;
