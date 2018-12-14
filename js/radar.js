/* Radar chart design created by Nadieh Bremer - VisualCinnamon.com */

////////////////////////////////////////////////////////////// 
//////////////////////// Set-Up ////////////////////////////// 
////////////////////////////////////////////////////////////// 

var margin_r = { top: 10, right: 10, bottom: 10, left: 10 },
    width_r = 280;
height_r = 280;

////////////////////////////////////////////////////////////// 
////////////////////////// Data ////////////////////////////// 
////////////////////////////////////////////////////////////// 
d3.json('../data/audience.json', function(data) {
    dataset_r = data;
    var data_r = [ //iPhone
        {
            "GDP": 50000,
            "Happiness Score": 2.34,
            "Human Development Index": 4.53,
            "Gender Inequality Index": 2.34,
            "Corruption Perception Index": 4.0,
            "Unemployment Rate": 8
        },
        {
            "GDP": 80000,
            "Happiness Score": 80000,
            "Human Development Index": 80000,
            "Gender Inequality Index": 80000,
            "Corruption Perception Index": 80000,
            "Unemployment Rate": 80000
        }

    ];
    /*[ //Samsung
        { axis: "GDP", value: 0.27 },
        { axis: "Happiness Score", value: 0.16 },
        { axis: "Human Development Index", value: 0.35 },
        { axis: "Gender Inequality Index", value: 0.13 },
        { axis: "Corruption Perception Index", value: 0.20 },
        { axis: "Unemployment Rate", value: 0.13 }
    ],
    [ //Nokia Smartphone
        { axis: "GDP", value: 0.26 },
        { axis: "Happiness Score", value: 0.10 },
        { axis: "Human Development Index", value: 0.30 },
        { axis: "Gender Inequality Index", value: 0.14 },
        { axis: "Corruption Perception Index", value: 0.22 },
        { axis: "Unemployment Rate", value: 0.04 }
    ]*/



    /*var data_r = [
        //iPhone
        {
            "GDP": 500,
            "Happiness Score": 234,
            "Human Development Index": 45,
            "Gender Inequality Index": 234,
            "Corruption Perception Index": 45,
            "Unemployment Rate": 234
        },
         {
            "GDP": 300,
            "Happiness Score": 134,
            "Human Development Index": 125,
            "Gender Inequality Index": 134,
            "Corruption Perception Index": 245,
            "Unemployment Rate": 134
        }
    ];*/
    var radarChartOptions = {
        w: width_r,
        h: height_r,
        margin: margin_r,
        //maxValue: 0.5,
        levels: 2,
        roundStrokes: true,
        color: color
    };
    RadarChart("#RadarChart", data_r, radarChartOptions);
});


/**/
////////////////////////////////////////////////////////////// 
//////////////////// Draw the Chart ////////////////////////// 
////////////////////////////////////////////////////////////// 

var color = d3.scaleOrdinal()
    .range(["#EDC951", "#CC333F", "#00A0B0"]);


//Call function to draw the Radar chart





/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////

function RadarChart(id, data, options) {
    var cfg = {
        w: 20, //Width of the circle
        h: 20, //Height of the circle
        margin_r: { top: 10, right: 10, bottom: 10, left: 10 }, //The margins of the SVG
        levels: 3, //How many levels or inner circles should there be drawn
        //maxValue: 0, //What is the value that the biggest circle will represent
        labelFactor: 1, //How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
        opacityArea: 0.35, //The opacity of the area of the blob
        dotRadius: 4, //The size of the colored circles of each blog
        opacityCircles: 0.1, //The opacity of the circles of each blob
        strokeWidth: 1, //The width of the stroke around each blob
        // roundStrokes: false, //If true the area and stroke will follow a round path (cardinal-closed)
        color: d3.schemeCategory10 //Color function
    };

    //Put all of the options into a variable called cfg
    if ('undefined' !== typeof options) {
        for (var i in options) {
            if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
        } //for i
    } //if

    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    var maxValue1 = d3.max(data, function(d) { return d.GDP }),
        maxValue2 = d3.max(data, function(d) { return d['Happiness Score'] }),
        maxValue3 = d3.max(data, function(d) { return d['Human Development Index'] }),
        maxValue4 = d3.max(data, function(d) { return d['Gender Inequality Index'] }),
        maxValue5 = d3.max(data, function(d) { return d['Corruption Perception Index'] }),
        maxValue6 = d3.max(data, function(d) { return d['Unemployment Rate'] });



    var allAxis = ['GDP', 'Happiness Score', 'Human Development Index', 'Gender Inequality Index', 'Corruption Perception Index', 'Unemployment Rate'], //Names of each axis
        total = allAxis.length, //The number of different axes
        radius = Math.min(cfg.w / 2, cfg.h / 2), //Radius of the outermost circle
        //Format = d3.format('%'), //Percentage formatting
        angleSlice = Math.PI * 2 / total; //The width in radians of each "slice"


    //Scale for the radius
    var rScale1 = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue1]);

    var rScale2 = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue2]);

    var rScale3 = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue3]);

    var rScale4 = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue4]);

    var rScale5 = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue5]);

    var rScale6 = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue6]);


    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////

    //Remove whatever chart with the same id/class was present before
    d3.select(id).select("svg").remove();

    //Initiate the radar chart SVG
    var svg = d3.select(id).append("svg")
        .attr("width", cfg.w + cfg.margin_r.left + cfg.margin_r.right)
        .attr("height", cfg.h + cfg.margin_r.top + cfg.margin_r.bottom)
        .attr("class", "radar" + id);
    //Append a g element    
    var g = svg.append("g")
        .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin_r.left) + "," + (cfg.h / 2 + cfg.margin_r.top) + ")");

    /////////////////////////////////////////////////////////
    ////////// Glow filter for some extra pizzazz ///////////
    /////////////////////////////////////////////////////////

    //Filter for the outside glow
    var filter = g.append('defs').append('filter').attr('id', 'glow'),
        feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
        feMerge = filter.append('feMerge'),
        feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
        feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////

    //Wrapper for the grid & axes
    var axisGrid = g.append("g").attr("class", "axisWrapper");

    //Draw the background circles
    axisGrid.selectAll(".levels")
        .data(d3.range(1, (cfg.levels + 1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function(d, i) { return radius / cfg.levels * d; })
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter", "url(#glow)");

    //Text indicating at what % each level is
    axisGrid.selectAll(".axisLabel")
        .data(d3.range(1, (cfg.levels + 1)).reverse())
        .enter().append("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", function(d) { return -d * radius / cfg.levels; })
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text(function(d, i) { return maxValue1 * d / cfg.levels; });

    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////

    //Create the straight lines radiating outward from the center
    var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
    //Append the lines
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function(d, i) {
            if (d == 'GDP') { return rScale1(maxValue1 * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); } else
            if (d == 'Happiness Score') { return rScale2(maxValue2 * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); } else
            if (d == 'Human Development Index') { return rScale3(maxValue3 * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); } else
            if (d == 'Gender Inequality Index') { return rScale4(maxValue4 * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); } else
            if (d == 'Corruption Perception Index') { return rScale5(maxValue5 * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); } else
            if (d == 'Unemployment Rate') { return rScale6(maxValue6 * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); };
        })
        .attr("y2", function(d, i) {

            if (d == 'GDP') { return rScale1(maxValue1 * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); } else
            if (d == 'Happiness Score') { return rScale2(maxValue2 * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); } else
            if (d == 'Human Development Index') { return rScale3(maxValue3 * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); } else
            if (d == 'Gender Inequality Index') { return rScale4(maxValue4 * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); } else
            if (d == 'Corruption Perception Index') { return rScale5(maxValue5 * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); } else
            if (d == 'Unemployment Rate') { return rScale6(maxValue6 * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); };
        })
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function(d, i) { return rScale1(maxValue1 * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("y", function(d, i) { return rScale1(maxValue1 * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2); })
        .text(function(d) { return d })
        .call(wrap, cfg.wrapWidth);

    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////

    //The radial line function
    var radarLine = d3.lineRadial()
        .curve(d3.curveCardinalClosed)
        .radius(function(d) {
          console.log("hej")
            if (i == 0) { return rScale1(d.GDP) } else
            if (i == 1) { return rScale2(d['Happiness Score']) } else
            if (i == 2) { return rScale3(d['Human Development Index']) } else
            if (i == 3) { return rScale4(d['Gender Inequality Index']) } else
            if (i == 4) { return rScale5(d['Corruption Perception Index']) } else
            if (i == 5) { return rScale6(d['Unemployment Rate']) }
        })
        .angle(function(d, i) { return i * angleSlice; });

        console.log(radarLine(function(d){return rScale1(d.GDP)}))
        console.log(rScale1(data[0].GDP))
    //console.log(radarLine(data.GDP));

    //Create a wrapper for the blobs  
    var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");

    //Append the backgrounds  
    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function(d){console.log(d); return radarLine(d)})
        .style("fill", function(d, i) { return cfg.color(i); })
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function(d, i) {
            //Dim all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", 0.1);
            //Bring back the hovered over blob
            d3.select(this)
                .transition().duration(200)
                .style("fill-opacity", 0.7);
        })
        .on('mouseout', function() {
            //Bring back all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", cfg.opacityArea);
        });

    //Create the outlines 
    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function(d, i) { return radarLine(d); })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function(d, i) { return cfg.color(i); })
        .style("fill", "none")
        .style("filter", "url(#glow)");

    //Append the circles
    blobWrapper.selectAll(".radarCircle")
        .data(function(d, i) { return d; })
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", function(d, i) { return rScale1(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("cy", function(d, i) { return rScale1(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
        .style("fill", function(d, i, j) { return cfg.color(j); })
        .style("fill-opacity", 0.8);

    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////

    //Wrapper for the invisible circles on top
    var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");

    //Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(function(d, i) { return d; })
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius * 1.5)
        .attr("cx", function(d, i) { return rScale1(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("cy", function(d, i) { return rScale1(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function(d, i) {
            newX = parseFloat(d3.select(this).attr('cx')) - 10;
            newY = parseFloat(d3.select(this).attr('cy')) - 10;

            tooltip
                .attr('x', newX)
                .attr('y', newY)
                .text(d.value)
                .transition().duration(200)
                .style('opacity', 1);
        })
        .on("mouseout", function() {
            tooltip.transition().duration(200)
                .style("opacity", 0);
        });

    //Set up the small tooltip for when you hover over a circle
    var tooltip = g.append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);

    /////////////////////////////////////////////////////////
    /////////////////// Helper Function /////////////////////
    /////////////////////////////////////////////////////////

    //Taken from http://bl.ocks.org/mbostock/7555321
    //Wraps SVG text  
    function wrap(text, width) {
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width_r) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    } //wrap 
}