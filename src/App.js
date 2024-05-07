import React from 'react';
import AreaPlot from './AreaPlot';
import ScatterPlot from './ScatterPlot';
import './App.css';
import github from './github.svg';
import shneiderman from './shneiderman.jpg';
import airbnb from './airbnb.png';

// Application:  Zooming Usability
const App = () => {
    
    // Return the App.
    return (
        <div className="Column">
            <div className="Description">
                <h1>Zooming Usability&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://github.com/hemanrobinson/zooming-usability/"><img className="icon" title="Code Shared on GitHub" alt="Code Shared on GitHub" src={github}/></a></h1>
                <p>
                A Zoom Bar is a range slider that supports panning and zooming. Zoom Bars were developed in 1996 at the <a href="https://hcil.umd.edu">University of Maryland’s Human-Computer Interaction Laboratory</a> by <a href="https://en.wikipedia.org/wiki/Ben_Shneiderman">Dr. Ben Shneiderman</a> and his team.
                </p>
                <p className="center">
                    <a href="https://en.wikipedia.org/wiki/Ben_Shneiderman"><img title="Dr. Ben Shneiderman" alt="Dr. Ben Shneiderman" src={shneiderman}/></a>
                </p>
                <h2>Examples</h2>
                <p>
                In one dimension, the Zoom Bar is a familiar part of the <a href="https://vega.github.io/vega/examples/overview-plus-detail/">Overview Plus Detail pattern</a> (Tidwell 2006) (Cockburn et. al., 2008). Drag the handles on the ends of the Zoom Bar to zoom in or out; drag the "thumb" in the middle to pan the graph.
                </p>
            </div>
            <div className="Graph">
                <AreaPlot dataSet={ "Stocks" } />
            </div>
            <div className="Description">
                <p>
                Zoom Bars were originally used in two dimensions (Jog, 1995). In the scatter plot below, Zoom Bars are displayed along the axes when the user hovers over the plot.
                </p>
            </div>
            <div className="Graph">
                <ScatterPlot dataSet={ "Iris" } />
            </div>
            <div className="Description">
                <p>
                In higher dimensions, it helps to decorate the range sliders with histograms. This mitigates the usability problem of applying a linear control to a non-linear distribution (Willett, 2007). AirBnB, which supports multi-dimensional queries, has open-sourced a nice <a href="https://github.com/airbnb/rheostat">example</a>:
                <p className="center">
                    <a href="https://github.com/airbnb/rheostat"><img title="AirBnB Slider" alt="AirBnB Slider" src={airbnb}/></a>
                </p>
                </p>
                <h2>User Interface</h2>
                <p>
                Why use Zoom Bars?
                </p>
                <p>
                <strong><em>Familiarity:</em></strong> <a href="https://lawsofux.com/jakobs-law/">Familiarity</a> eases the user’s learning curve, which is particularly important in web applications. <a href="https://www.nngroup.com/people/jakob-nielsen/">Jakob Nielsen</a> recommends engaging the user <a href="https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/">within the first 10 seconds</a> -- because on the web, if users don't find value quickly, they surf elsewhere (Nielsen, 2011). Zoom Bars are familiar controls, used in commercial products from <a href="https://spectrum.adobe.com/page/scroll-zoom-bar/">Adobe</a>, <a href="https://community.amazonquicksight.com/t/zoom-level-in-a-bar-chart/8179">Amazon</a>, <a href="https://www.ibm.com/docs/en/cognos-analytics/11.2.0?topic=dashboards-zoom-bar-in-area-line-bar-visualizations">IBM</a>, <a href="https://powerbi.microsoft.com/en-us/blog/power-bi-november-2020-feature-summary/#_Toc55467056">Microsoft</a>, <a href="https://docs.tibco.com/pub/spotfire/6.5.1/doc/html/vis/vis_zoom_sliders.htm">Tibco</a>,
                and others.
                </p>
                <p>
                <strong><em>Flexibility:</em></strong> Zoom Bars can be displayed persistently or transiently, inside or outside, depending on the graph. In the one-dimensional example above, it's assumed that the user wants to see both overview and detail. In the two-dimensional example above, to minimize distraction, the Zoom Bars are hidden until they can be used. In higher dimensions, it's convenient to display the Zoom Bars persistently outside the graph.
                </p>
                <p>
                <strong><em>Control:</em></strong> The scroll wheel is powerful, enabling the user to zoom in multiple dimensions simultaneously. Zoom Bars give the user <em>fine-grained</em> control, enabling them to zoom in one dimension at a time.
                </p>
                <p>
                <strong><em>Affordance:</em></strong> Some graphics applications use the scroll wheel for its original purpose of scrolling. Some use it for zooming. Some do neither, because not all graphs can be zoomed. In contrast, the Zoom Bar always shows the results of both scrolling and zooming, and its presence or absence shows whether or not a graph can be zoomed. The Zoom Bar thus provides clear <a href="https://uxplanet.org/ux-design-glossary-how-to-use-affordances-in-user-interfaces-393c8e9686e4">affordance</a>: it shows the user
                <ul>
                <li>whether they can zoom,</li>
                <li>where they have zoomed, and</li>
                <li>where they can zoom.</li>
                </ul>
                </p>
                <p>
                For all these reasons, we should use Zoom Bars in all our zoomable visualizations.
                </p>
                <h2>Implementation</h2>
                <p>
                This project uses <a href="https://react.dev">React</a>, <a href="https://github.com/mui-org/material-ui">Material-UI</a>, and <a href="https://github.com/d3/d3">d3</a>, and extends <a href="https://observablehq.com/@d3/x-y-zoom?collection=@d3/d3-zoom">Fil's X-Y Zoom</a>.
                </p>
                <h2>Further Reading</h2>
                <ul>
                    <li>Cockburn, A., Karlson, A., and Bederson, B. B. (2008).  "A Review of Overview+Detail, Zooming, and Focus+Context Interfaces". ACM Computing Surveys 41, 1. <a href="https://faculty.cc.gatech.edu/~stasko/7450/Papers/cockburn-surveys08.pdf">https://faculty.cc.gatech.edu/~stasko/7450/Papers/cockburn-surveys08.pdf</a>.</li><br/>
                    <li>Jog, N. and Shneiderman, B. (1995). "Starfield visualization with interactive smooth zooming". In: Spaccapietra, S., Jain, R. (eds) Visual Database Systems 3. VDB 1995. IFIP — The International Federation for Information Processing. Springer, Boston, MA.  <a href="https://doi.org/10.1007/978-0-387-34905-3_1">https://doi.org/10.1007/978-0-387-34905-3_1</a>.</li><br/>
                    <li>Nielsen, J. (2011). "How Long Do Users Stay on Web Pages?". Nielsen Norman Group. <a href="https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/">https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/</a>.</li><br/>
                    <li>Tidwell, J. (2006). Designing Interfaces, First Edition, 174-175. Sebastopol CA: O'Reilly Media. <a href="https://www.oreilly.com/library/view/designing-interfaces-3rd/9781492051954/">https://www.oreilly.com/library/view/designing-interfaces-3rd/9781492051954/</a>.</li><br/>
                    <li>Willett, W., Heer, J., and Agrawala, M. (2007). "Scented Widgets: Improving Navigation Cues with Embedded Visualizations". IEEE Transactions on Visualization and Computer Graphics 13, 6, 1129–1136. <a href="https://doi.org/10.1109/TVCG.2007.70589">https://doi.org/10.1109/TVCG.2007.70589</a>.</li><br/>
                </ul>
            </div>
        </div>
    );
}

export default App;
