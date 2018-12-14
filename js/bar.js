//dimensions graph



var dataset_b;
var margin_b = { top: 30, right: 10, bottom: 20, left: 70 },
    width_b = 400 - margin_b.left - margin_b.right,
    height_b = 300 - margin_b.top - margin_b.bottom;
// set the ranges
var x = d3.scaleBand()
    .range([0, width_b])
    .padding(0.1);
var y1 = d3.scaleLinear()
    .range([height_b, 0]);
var y2 = d3.scaleLinear()
    .range([height_b, 0]);
var y3 = d3.scaleLinear()
    .range([height_b, 0]);
var y4 = d3.scaleLinear()
    .range([height_b, 0]);
var y5 = d3.scaleLinear()
    .range([height_b, 0]);
var y6 = d3.scaleLinear()
    .range([height_b, 0]);

function updateData1(newCountry) {
    d3.select('#barChart').selectAll("svg").remove();
    drawBar(newCountry);

}
//load data and create vis


d3.json('../data/countries.json', function(data) {
    var strUser = "DEU";
    dataset_b = data;
    var keys = Object.keys(dataset_b[0]).slice(1);
    drawBar(strUser);
});


function drawBar(strUser) {
    var svg = d3.select("#barChart").append("svg")
        .attr("width", width_b + margin_b.left + margin_b.right)
        .attr("height", height_b + margin_b.top + margin_b.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin_b.left + "," + margin_b.top + ")");

    x.domain(['GDP', 'Happiness Score', 'Human Development Index', 'Gender Inequality Index', 'Corruption Perception Index', 'Unemployment Rate']);
    y1.domain([0, d3.max(dataset_b, function(d) { return d.GDP })]);
    y2.domain([0, d3.max(dataset_b, function(d) { return d['Happiness Score'] })]);
    y3.domain([0, d3.max(dataset_b, function(d) { return d['Human Development Index'] })]);
    y4.domain([0, d3.max(dataset_b, function(d) { return d['Gender Inequality Index'] })]);
    y5.domain([0, d3.max(dataset_b, function(d) { return d['Corruption Perception Index'] })]);
    y6.domain([0, d3.max(dataset_b, function(d) { return d['Unemployment Rate'] })]);


 //Container for the gradients
var defs = svg.append("defs");

//Filter for the outside glow
var filter = defs.append("filter")
    .attr("id","glow");
filter.append("feGaussianBlur")
    .attr("stdDeviation","4")
    .attr("result","coloredBlur");
var feMerge = filter.append("feMerge");
feMerge.append("feMergeNode")
    .attr("in","coloredBlur");
feMerge.append("feMergeNode")
    .attr("in","SourceGraphic");


    var div = d3.select("body").append("div")
        .attr("class", "tooltip1")
        .style("opacity", 0);


    var graph = svg.selectAll("#barChart")
        .data(dataset_b.filter(function(d) { return d.iso3 == strUser }))
        .enter()

var formatGDP = d3.format(".2s");

    graph.append("rect")

        .attr("class", "bar1")
        .attr("x", function(d, i) { return 0 })
        .attr("width", (x.bandwidth()-5))
        .attr("y", function(d, i) { return y1(d.GDP) })
        .attr("height", function(d, i) { return height_b - y1(d.GDP) })
        .style("filter", "url(#glow)")
        .on("mouseover", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html("GDP" + "<br/>" + d3.format(".2s")(d.GDP))
                .style("left", (d3.event.pageX-100) + "px")
                .style("top", (d3.event.pageY-50) + "px");

        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });

graph.append("rect")

        .attr("class", "eq")
        .attr("x", function(d, i) { return 0 })
        .attr("width", (x.bandwidth()-5))
        .attr("y", function(d, i) { return (y1(d.GDP)-7.5)})
        .attr("height", function(d, i) { return 5 })
        .style("fill", "FF0009")
         .style("filter", "url(#glow)")
         .style("opacity", "0.9");
   
   



    graph.append("rect")
        .attr("class", "bar2")
        .attr("x", function(d, i) { return 55 })
        .attr("width", (x.bandwidth()-5))
        .attr("y", function(d, i) { return y2(d['Happiness Score']) })
        .attr("height", function(d, i) { return height_b - y2(d['Happiness Score']) })
        .style("opacity", "0.90")
        .style("filter", "url(#glow)")
        .on("mouseover", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html("Happiness Score" + "<br/>" + d3.format(".2f")(d['Happiness Score']))
                .style("left", (d3.event.pageX -100) + "px")
                .style("top", (d3.event.pageY - 50) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });


graph.append("rect")

        .attr("class", "eq")
        .attr("x", function(d, i) { return 55 })
        .attr("width", (x.bandwidth()-5))
        .attr("y", function(d, i) { return (y2(d['Happiness Score'])-7.5)})
        .attr("height", function(d, i) { return 5 })
        .style("fill", "FF0009")
         .style("filter", "url(#glow)")
         .style("opacity", "0.90");


    graph.append("rect")
        .attr("class", "bar3")
        .attr("x", function(d, i) { return 110 })
        .attr("width", (x.bandwidth()-5))
        .attr("y", function(d, i) { return y3(d['Human Development Index']) })
        .attr("height", function(d, i) { return height_b - y3(d['Human Development Index']) })
        .style("opacity", "0.90")
        .style("filter", "url(#glow)")
        .on("mouseover", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html("Human Development Index" + "<br/>" + d3.format(".2f")(d['Human Development Index']))
                .style("left", (d3.event.pageX -100) + "px")
                .style("top", (d3.event.pageY - 50) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });

        graph.append("rect")

        .attr("class", "eq")
        .attr("x", function(d, i) { return 110 })
        .attr("width", (x.bandwidth()-5))
        .attr("y", function(d, i) { return (y3(d['Human Development Index'])-7.5)})
        .attr("height", function(d, i) { return 5 })
        .style("fill", "FF0009")
         .style("filter", "url(#glow)")
         .style("opacity", "0.90");


    graph.append("rect")
        .attr("class", "bar4")
        .attr("x", function(d, i) { return 165 })
        .attr("width", (x.bandwidth()-5))
        .attr("y", function(d, i) { return y4(d['Gender Inequality Index']) })
        .attr("height", function(d, i) { return height_b - y4(d['Gender Inequality Index']) })
        .style("opacity", "0.90")
        .style("filter", "url(#glow)")
        .on("mouseover", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html("Gender Inequality Index" + "<br/>" + d3.format(".2f")(d['Gender Inequality Index']))
                .style("left", (d3.event.pageX-100) + "px")
                .style("top", (d3.event.pageY - 50) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });

        graph.append("rect")

        .attr("class", "eq")
        .attr("x", function(d, i) { return 165 })
        .attr("width", (x.bandwidth()-5))
        .attr("y", function(d, i) { return (y4(d['Gender Inequality Index'])-7.5)})
        .attr("height", function(d, i) { return 5 })
        .style("fill", "FF0009")
         .style("filter", "url(#glow)")
         .style("opacity", "0.90");



    graph.append("rect")
        .attr("class", "bar5")
        .attr("x", function(d, i) { return 220 })
        .attr("width", (x.bandwidth()-5))
        .attr("y", function(d, i) { return y5(d['Corruption Perception Index']) })
        .attr("height", function(d, i) { return height_b - y5(d['Corruption Perception Index']) })
        .style("opacity", "0.90")
        .style("filter", "url(#glow)")
                 .style("stroke-opacity", "0.90")
        .on("mouseover", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html("Corruption Perception Index" + "<br/>" + d['Corruption Perception Index'])
                .style("left", (d3.event.pageX-100) + "px")
                .style("top", (d3.event.pageY - 50) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });


graph.append("rect")

        .attr("class", "eq")
        .attr("x", function(d, i) { return 220 })
        .attr("width", (x.bandwidth()-5))
        .attr("y", function(d, i) { return (y5(d['Corruption Perception Index'])-7.5)})
        .attr("height", function(d, i) { return 5 })
        .style("fill", "FF0009")
         .style("filter", "url(#glow)")
         .style("opacity", "0.90");


    graph.append("rect")
        .attr("class", "bar6")
        .attr("x", function(d, i) { return 275})
        .attr("width", (x.bandwidth()-5))
        .attr("y", function(d, i) { return y6(d['Unemployment Rate']) })
        .attr("height", function(d, i) { return height_b - y6(d['Unemployment Rate']) })
        .style("opacity", "0.90")
        .style("filter", "url(#glow)")
        .on("mouseover", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html("Unemployment Rate" + "<br/>" + d['Unemployment Rate'])
                .style("left", (d3.event.pageX-100) + "px")
                .style("top", (d3.event.pageY - 50) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });

        graph.append("rect")

        .attr("class", "eq")
        .attr("x", function(d, i) { return 275 })
        .attr("width", (x.bandwidth()-5))
        .attr("y", function(d, i) { return (y6(d['Unemployment Rate'])-7.5)})
        .attr("height", function(d, i) { return 5 })
        .style("fill", "FF0009")
         .style("filter", "url(#glow)")
         .style("opacity", "0.90");

};