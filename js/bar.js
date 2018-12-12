//dimensions graph
var dataset_b;
var margin_b = { top: 20, right: 20, bottom: 30, left: 40 },
    width_b = 340 - margin_b.left - margin_b.right,
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

    var div = d3.select("body").append("div")
        .attr("class", "tooltip1")
        .style("opacity", 0);


    var graph = svg.selectAll("#barChart")
        .data(dataset_b.filter(function(d) { return d.iso3 == strUser }))
        .enter()


    graph.append("rect")

        .attr("class", "bar1")
        .attr("x", function(d, i) { return 0 })
        .attr("width", x.bandwidth())
        .attr("y", function(d, i) { return y1(d.GDP) })
        .attr("height", function(d, i) { return height_b - y1(d.GDP) })
        .on("mouseover", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html("GDP" + "<br/>" + d.GDP)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });



    graph.append("rect")
        .attr("class", "bar2")
        .attr("x", function(d, i) { return 50 })
        .attr("width", x.bandwidth())
        .attr("y", function(d, i) { return y2(d['Happiness Score']) })
        .attr("height", function(d, i) { return height_b - y2(d['Happiness Score']) })
        .on("mouseover", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html("Happiness Score" + "<br/>" + d['Happiness Score'])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });


    graph.append("rect")
        .attr("class", "bar3")
        .attr("x", function(d, i) { return 100 })
        .attr("width", x.bandwidth())
        .attr("y", function(d, i) { return y3(d['Human Development Index']) })
        .attr("height", function(d, i) { return height_b - y3(d['Human Development Index']) })
        .on("mouseover", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html("Human Development Index" + "<br/>" + d['Human Development Index'])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });

    graph.append("rect")
        .attr("class", "bar4")
        .attr("x", function(d, i) { return 150 })
        .attr("width", x.bandwidth())
        .attr("y", function(d, i) { return y4(d['Gender Inequality Index']) })
        .attr("height", function(d, i) { return height_b - y4(d['Gender Inequality Index']) })
        .on("mouseover", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html("Gender Inequality Index" + "<br/>" + d['Gender Inequality Index'])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });

    graph.append("rect")
        .attr("class", "bar5")
        .attr("x", function(d, i) { return 200 })
        .attr("width", x.bandwidth())
        .attr("y", function(d, i) { return y5(d['Corruption Perception Index']) })
        .attr("height", function(d, i) { return height_b - y5(d['Corruption Perception Index']) })
        .on("mouseover", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html("Corruption Perception Index" + "<br/>" + d['Corruption Perception Index'])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });

    graph.append("rect")
        .attr("class", "bar6")
        .attr("x", function(d, i) { return 250 })
        .attr("width", x.bandwidth())
        .attr("y", function(d, i) { return y6(d['Unemployment Rate']) })
        .attr("height", function(d, i) { return height_b - y6(d['Unemployment Rate']) })
        .on("mouseover", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html("Unemployment Rate" + "<br/>" + d['Unemployment Rate'])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });
};