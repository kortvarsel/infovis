////////////////////////////////////////////////////////////
//////////////////////// Set-up ////////////////////////////
////////////////////////////////////////////////////////////
var dataset_c;
var dataset_o;
var artist
var temp_name;
var emptyStroke;
var datamatrix;
var respondents, //Total number of respondents (i.e. the number that make up the total group
    emptyPerc; //What % of the circle should become empty

d3.csv('../data/occurences.csv', function(data) {
    dataset_o = data;
    d3.json('../data/top10.json', function(data) {
        dataset_c = data;

        drawChord("DEU");
    });
});

function updateData3(newCountry) {

    d3.select('#chord').selectAll("svg").remove();

    drawChord(newCountry);
}

function transpose(a) {
    return Object.keys(a[0]).map(function(c) {
        return a.map(function(r) { return r[c]; });
    });
}

function arrSum(arr) {
    var sum = 0;
    // iterate array using forEach, better to use for loop since it have higher performance
    arr.forEach(function(v) {
        // checking array element is an array
        if (typeof v == 'object')
            // if array then getting sum it's element (recursion)
            sum += arrSum(v);
        else
            // else adding the value with sum
            sum += v
    })
    // returning the result
    return sum;
}

function getArtist(country) {

    var temp_country;
    var artist_key = []
    var arr_countries;
    var data_artist = dataset_c.filter(function(d) { return d.country == country });
    artist = [];
    var arr_artist = data_artist.map(function(a) { return a.artist });
    var artist_block;
    var country_block;
    var dummy_bottom;
    var dummy_top;



    var unique_artist = arr_artist.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
    })

    unique_artist.forEach(function(entry) {
        temp_country = dataset_o.filter(function(d) { return d.artist == entry });
        ///////////////////////////// Getting keys -> must customize artist though...
        /*  var temp_artist_key = temp_country[0];
          for (var key in temp_artist_key) {
              if (temp_artist_key[key] > 0) {
                  artist_key.push(key);
              }
          };*/

        var temp_artist_key = temp_country[0];
        for (var key in temp_artist_key) { artist_key.push(key); };
        var temp_artist = Object.values(temp_country[0]);
        temp_artist.shift();
        temp_artist = temp_artist.map(function(d) { return +d }); //to integer
        artist.push(temp_artist); //artist
    })

    //artist matrix
    artist_block = artist;
    country_block = artist;
    country_block = transpose(country_block);
    artist_block.forEach(function(a) {
        var max = a.length + unique_artist.length + 2
        while (a.length < max) {
            a.push(0);
        };
    });



    respondents = arrSum(artist_block) * 2; //Total number of respondents (i.e. the number that make up the total group
    
    emptyPerc = 0.25;

    emptyStroke = Math.round(respondents * emptyPerc);

    country_block.forEach(function(a) {
        var max = artist_block[0].length
        a.push(0)
        while (a.length < max) {
            a.unshift(0);
        };
    });

    ///dummys
    dummy_bottom = [emptyStroke];
    while (dummy_bottom.length < artist_block[0].length) {
        dummy_bottom.unshift(0);
    };

    dummy_top = [emptyStroke];
    while (dummy_top.length < unique_artist[0].length + 1) {
        dummy_top.push(0);
    };
    while (dummy_top.length < artist_block[0].length) {
        dummy_top.unshift(0);
    };

    /////matrix generation

    var datamatrix_temp;
    datamatrix_temp = country_block;
    datamatrix_temp.push(dummy_bottom);
    datamatrix = datamatrix_temp.concat(artist_block);
    datamatrix.push(dummy_top);


    //basiert auf artist country keys
    var country_key = artist_key.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
    })
    country_key.shift();

    //////////////////getting names/////////////
    temp_name = country_key;
    //temp_name.push(country_key);
    temp_name.push("");
    for (i = 0; i < unique_artist.length; i++) {

        temp_name.push(unique_artist[i]);
    }
    temp_name.push("");

};

function drawChord(country) {

    getArtist(country);

var colour = d3.scaleOrdinal(d3.schemeCategory10);

    /////////
    var screenWidth = $(window).innerWidth(),
        mobileScreen = (screenWidth > 500 ? false : true);

    var margin_c = { left: 80, top: 0, right: 10, bottom: 10 },
        width_c = 420,
        //Math.min(screenWidth, 800) - margin_c.left - margin.right,
        height_c = 420;
    //(mobileScreen ? 300 : Math.min(screenWidth, 800)*5/6) - margin_c.top - margin_c.bottom;

    var svg = d3.select("#chord").append("svg")
        .attr("width", (width_c + margin_c.left + margin_c.right))
        .attr("height", (height_c + margin_c.top + margin_c.bottom));



    var wrapper = svg.append("g").attr("class", "chordWrapper")
        .attr("transform", "translate(" + (width_c / 2 + margin_c.left) + "," + (height_c / 2 + margin_c.top) + ")");;

    var outerRadius = Math.min(width_c, height_c) / 2 - (mobileScreen ? 80 : 50),
        innerRadius = outerRadius * 0.85,
        opacityDefault = 1, //default opacity of chords
        opacityLow = 0.02; //hover opacity of those chords not hovered over

    //How many pixels should the two halves be pulled apart
    var pullOutSize = 20;

    //////////////////////////////////////////////////////
    //////////////////// Titles on top ///////////////////
    //////////////////////////////////////////////////////

    /* var titleWrapper = svg.append("g").attr("class", "chordTitleWrapper"),
         titleOffset = mobileScreen ? 15 : 80,
         titleSeparate = mobileScreen ? 30 : 0;*/

    ////////////////////////////////////////////////////////////
    /////////////////// Animated gradient //////////////////////
    ////////////////////////////////////////////////////////////

    var defs = wrapper.append("defs");
    var linearGradient = defs.append("linearGradient")
        .attr("id", "animatedGradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0")
        .attr("spreadMethod", "reflect");

   linearGradient.append("animate")
        .attr("attributeName", "x1")
        .attr("values", "0%;100%")
        //  .attr("from","0%")
        //  .attr("to","100%")
        .attr("dur", "1.8s")
        .attr("repeatCount", "indefinite");

    linearGradient.append("animate")
        .attr("attributeName", "x2")
        .attr("values", "100%;200%")
        //  .attr("from","100%")
        //  .attr("to","200%")
        .attr("dur", "1.8s")
        .attr("repeatCount", "indefinite");

    linearGradient.append("stop")
        .attr("offset", "5%")
        .attr("stop-color", "#1AAA4D");
    linearGradient.append("stop")
        .attr("offset", "15%")
        .attr("stop-color", "#8E8E8E");
   
 



   /* linearGradient.append("stop")
        .attr("offset", "55%")
        .attr("stop-color", "grey");
    linearGradient.append("stop")
        .attr("offset", "95%")
        .attr("stop-color", "grey");*/

    ////////////////////////////////////////////////////////////
    ////////////////////////// Data ////////////////////////////
    ////////////////////////////////////////////////////////////

    /*var Names = ["Administrative Staff", "Crafts", "Business Management", "Basic Occupations", "Health",
        "IT", "Juridical & Cultural", "Management functions", "Teachers",
        "Salesmen & Service providers", "Caretakers", "Science & Engineering", "Other", "",
        "Engineering", "Education", "Agriculture", "Art, Language & Culture", "Health", "Behavior & Social Sciences", "Economy", ""
    ];*/

    var Names = temp_name;
   

    var matrix = datamatrix;


    //Calculate how far the Chord Diagram needs to be rotated clockwise to make the dummy
    //invisible chord center vertically
    var offset = (2 * Math.PI) * (emptyStroke / (respondents + emptyStroke)) / 4;

    //Custom sort function of the chords to keep them in the original order
    var chord = customChordLayout() //d3.layout.chord()
        .padding(.02)
        .sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
        .matrix(matrix);

    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle) //startAngle and endAngle now include the offset in degrees
        .endAngle(endAngle);

    var path = stretchedChord() //Call the stretched chord function 
        .radius(innerRadius)
        .startAngle(startAngle)
        .endAngle(endAngle)
        .pullOutSize(pullOutSize);

    ////////////////////////////////////////////////////////////
    //////////////////// Draw outer Arcs ///////////////////////
    ////////////////////////////////////////////////////////////

    var g = wrapper.selectAll("g.group")
        .data(chord.groups)
        .enter().append("g")
        .attr("class", "group")
        .on("mouseover", fade(opacityLow))
        .on("mouseout", fade(opacityDefault));

    g.append("path")
        .style("stroke", function(d, i) {return (Names[i] === "" ? "none" : "#252525"); })
        .style("fill", function(d, i) { return (Names[i] === "" ? "none" : "#252525"); })
        .style("pointer-events", function(d, i) { return (Names[i] === "" ? "none" : "auto"); })
        .attr("d", arc)
        .attr("transform", function(d, i) { //Pull the two slices apart
            d.pullOutSize = pullOutSize * (d.startAngle + 0.001 > Math.PI ? -1 : 1);
            return "translate(" + d.pullOutSize + ',' + 0 + ")";
        })


    ////////////////////////////////////////////////////////////
    ////////////////////// Append Names ////////////////////////
    ////////////////////////////////////////////////////////////

    //The text also needs to be displaced in the horizontal directions
    //And also rotated with the offset in the clockwise direction
    g.append("text")
        .each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2) + offset; })
        .attr("dy", ".35em")
        .attr("class", "titles")
        .style("font-size", "0.5em")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d, i) {
            var c = arc.centroid(d);
            return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")" +
                "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
                "translate(" + 20 + ",0)" +
                (d.angle > Math.PI ? "rotate(180)" : "")
        })
        .text(function(d, i) { return Names[i]; })
        .call(wrapChord, 100);

    ////////////////////////////////////////////////////////////
    //////////////////// Draw inner chords /////////////////////
    ////////////////////////////////////////////////////////////

    wrapper.selectAll("path.chord")
        .data(chord.chords)
        .enter().append("path")
        .attr("class", "chord")
        .style("stroke", "none")
        .style("fill", "url(#animatedGradient)") //An SVG Gradient to give the impression of a flow from left to right
        .style("opacity", function(d) { return (Names[d.source.index] === "" ? 0 : opacityDefault); }) //Make the dummy strokes have a zero opacity (invisible)
        .style("pointer-events", function(d, i) { return (Names[d.source.index] === "" ? "none" : "auto"); }) //Remove pointer events from dummy strokes
        .attr("d", path)
        .on("mouseover", fadeOnChord)
        .on("mouseout", fade(opacityDefault));


    ////////////////////////////////////////////////////////////
    ////////////////// Extra Functions /////////////////////////
    ////////////////////////////////////////////////////////////

    //Include the offset in de start and end angle to rotate the Chord diagram clockwise
    function startAngle(d) { return d.startAngle + offset; }

    function endAngle(d) { return d.endAngle + offset; }

    // Returns an event handler for fading a given chord group
    function fade(opacity) {
        return function(d, i) {
            wrapper.selectAll("path.chord")
                .filter(function(d) { return d.source.index !== i && d.target.index !== i && Names[d.source.index] !== ""; })
                .transition()
                .style("opacity", opacity);
        };
    } //fade

    // Fade function when hovering over chord
    function fadeOnChord(d) {
        var chosen = d;
        wrapper.selectAll("path.chord")
            .transition()
            .style("opacity", function(d) {
                return d.source.index === chosen.source.index && d.target.index === chosen.target.index ? opacityDefault : opacityLow;
            });
    } //fadeOnChord

    /*Taken from http://bl.ocks.org/mbostock/7555321
    //Wraps SVG text*/
    function wrapChord(text, width) {
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = 0,
                x = 0,
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width_c) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }
}