var dataset_a;
var strUser = "DEU";

d3.json('../data/top10.json', function(data) {
    dataset_a = data;

    donutChart("DEU")
});

function updateData2(newCountry) {

    d3.select('#AsterChart').selectAll("svg").remove();

    donutChart(newCountry);
}


function donutChart(strUser) {

    d3.select('#AsterChart')
        .datum(dataset_a.filter(function(d) { return d.country == strUser })) // bind data to the div
    // .call(donutChart()); // draw chart in div

    var width_a = 400,
        height_a = 300,
        margin_a = { top: 30, right: 20, bottom: 5, left: 80 },
        colour = d3.scaleOrdinal(d3.schemeCategory10), // colour scheme
        // compare data by
        padAngle = 0.03, // effectively dictates the gap between slices

        cornerRadius = 1; // sets how rounded the corners are on each slice


    var radius = Math.min(width_a, height_a) / 2;

    // creates a new pie generator
    var pie = d3.pie()
        .value(function(d) { return d.Total; })
        .sort(null);

    // contructs and arc generator. This will be used for the donut. The difference between outer and inner
    // radius will dictate the thickness of the donut
    var arc = d3.arc()
        .outerRadius(radius * 0.9)
        .innerRadius(radius * 0.65)
        .cornerRadius(cornerRadius)
        .padAngle(padAngle);

    var svg = d3.select('#AsterChart').append('svg')
        .attr('width', width_a + margin_a.left + margin_a.right)
        .attr('height', height_a + margin_a.top + margin_a.bottom)
        .append('g')
        .attr('transform', 'translate(' + (width_a / 2 + margin_a.left) + ',' + (height_a / 2 - margin_a.bottom) + ')');






    d3.select('#AsterChart').each(function(data) {

            // g elements to keep elements within svg modular
            svg.append('g').attr('class', 'slices');

            // add and colour the donut slices
            var path = svg.select('.slices')
                .datum(data).selectAll('path')
                .data(pie)
                .enter().append('path')
                .on('click',(data)=>{
                    updateData4(data.data.artist)
                })
                //.on('mouseover',(data)=>{
                //    var lista = d3.select("#"+data.data.artist+"")._groups[0][0]
                //   console.log(lista)
                //})
                .attr('class', "slice")
                .attr('fill', "#252525" )//function(d) { return colour(d.data['Pos']); })
                .attr('d', arc)
                .style('stroke', "FFFFF0")
                .style('stroke-width', 2);


  svg.append('circle')
                .attr('class', 'defaultCircle')
                .attr('r', radius * 0.61) // radius of tooltip circle
                .style('fill', '#F1F1F1') // colour based on category mouse is over
                .style('fill-opacity', 0.9)
                .style('stroke', "#252525")
                .style('stroke-width', 4);


            svg.append('text')
                .attr('class', 'defaultCircle')
                .attr('dy', 12) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
                .html('<tspan x="0"> TOP 10 </tspan>') // add text to the circle.
                .style('font-size', '2.5em')
                .style('opacity', 0.9)
                .style('text-anchor', 'middle')
                .style("fill", "#252525"); // centres text in tooltip



          

svg.append('circle')
                .attr('class', 'outline Circle')
                .attr('r', radius * 0.94) // radius of tooltip circle
                .style('fill', 'none') // colour based on category mouse is over
       
                //.style('stroke', "#F1F1F1")
                .style('stroke-width', 0.8);

            // add tooltip to mouse events on slices and labels
            d3.selectAll('.labelName text, .slices path').call(toolTip);

            // function that creates and adds the tool tip to a selected element
            function toolTip(selection) {

                // add tooltip (svg circle element) when mouse enters label or slice
                selection.on('mouseenter', function(data) {
                    d3.selectAll('.defaultCircle').remove();
                    

                    svg.append('circle')
                        .attr('class', 'toolCircle')
                        .attr('r', radius * 0.61) // radius of tooltip circle
                        .style('fill', "#F1F1F1") // colour based on category mouse is over
                        .style('fill-opacity', 0.9)
                        .style('stroke', "#252525")
                        .style('stroke-width', 4);

                        svg.append('text')
                        .attr('class', 'toolCircle')
                        .attr('dy', 0) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
                        .html(toolTipHTML(data)) // add text to the circle.
                        .style('font-size', '1em')
                        .style('opacity', 0.9)
                        .style('text-anchor', 'middle')
                        .style("fill", "#252525"); // centres text in tooltip

                });

                // remove the tooltip when mouse leaves the slice/label
                selection.on('mouseout', function() {

                    d3.selectAll('.toolCircle').remove();

                    

                    svg.append('circle')
                        .attr('class', 'defaultCircle')
                        .attr('r', radius * 0.61) // radius of tooltip circle
                        .style('fill', '#F1F1F1') // colour based on category mouse is over
                        .style('fill-opacity', 0.9)
                        .style('stroke', "#252525")
                        .style('stroke-width', 4);

                        svg.append('text')
                        .attr('class', 'defaultCircle')
                        .attr('dy', 12) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
                        .html('<tspan x="0"> TOP 10 </tspan>') // add text to the circle.
                        .style('font-size', '2.5em')
                        .style('opacity', 0.9)
                        .style('text-anchor', 'middle')
                        .style("fill", "#252525"); // centres text in tooltip

                });
            }

            function toolTipHTML(data) {

                var tip = '',
                    i = 0;

                for (var key in data.data) {
                    var value
                    if (key == "Pos" || key == "artist" || key == "title") {
                        value = data.data[key];

                        if (key == "Pos") { tip += '<tspan font-size="2.5em" x="0" dy="-0.9em">#' + value + '</tspan><tspan x="0" dy="2em">  </tspan>'; } else
                        if (key == "artist") { tip += '<tspan font-size="1.2em" x="0" dy=' + ((i * 6) - 10) + '>' + value + '</tspan>';
                          tip += '<tspan font-size="1.1em" x="0" dy="1em">  </tspan>'} else
                        if (key == "title") { tip += '<tspan font-size="0.8em" x="0" dy=' + ((i * 6) - 12) + '>' + value + '</tspan>'; }                    



                }
                i++;
            }

            return tip;
        }
    });
}