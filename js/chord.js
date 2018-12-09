////////////////////////////////////////////////////////////
//////////////////////// Set-up ////////////////////////////
////////////////////////////////////////////////////////////
var dataset_c;
var dataset_o;
var artist = [];
var temp_name;
var emptyStroke;
var datamatrix;
var respondents, //Total number of respondents (i.e. the number that make up the total group
    emptyPerc; //What % of the circle should become empty


d3.csv('../data/occurences.csv', function(data) {
    dataset_o = data;


    d3.json('../data/top10.json', function(data) {

        // console.log(dataset_o);
        dataset_c = data;
        
        drawChord("DEU");

    });

    //console.log(artist);


});

function updateData3(newCountry) {
    d3.select('#chord').selectAll("svg").remove();

    //getArtist(newCountry);
   drawChord(newCountry);

}

function transpose(a) {
    return Object.keys(a[0]).map(function(c) {
        return a.map(function(r) { return r[c]; });
    });
}

function getSum(array) {
    result = array.reduce(function(r, a) {
        a.forEach(function(b, i) {
            r[i] = (r[i] || 0) + b;
        });
        return r;
    }, []);
}



function getArtist(country) {

    var temp_country;
    var artist_key = []
    var arr_countries;
    var data_artist = dataset_c.filter(function(d) { return d.country == country });

    var arr_artist = data_artist.map(function(a) { return a.artist });
    var artist_block;
    var country_block;
    var dummy_bottom;
    var dummy_top;
    respondents = 793 * 2; //Total number of respondents (i.e. the number that make up the total group
    emptyPerc = 0.25;

    emptyStroke = Math.round(respondents * emptyPerc);

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

}





function drawChord(country) {

    getArtist(country);

    var screenWidth = $(window).innerWidth(),
        mobileScreen = (screenWidth > 500 ? false : true);

    var margin = { left: 50, top: 10, right: 50, bottom: 10 },
        width_c = 500,
        //Math.min(screenWidth, 800) - margin.left - margin.right,
        height_c = 400;
    //(mobileScreen ? 300 : Math.min(screenWidth, 800)*5/6) - margin.top - margin.bottom;

    var svg = d3.select("#chord").append("svg")
        .attr("width", (width_c + margin.left + margin.right))
        .attr("height", (height_c + margin.top + margin.bottom));

    var wrapper = svg.append("g").attr("class", "chordWrapper")
        .attr("transform", "translate(" + (width_c / 2 + margin.left) + "," + (height_c / 2 + margin.top) + ")");;

    var outerRadius = Math.min(width_c, height_c) / 2 - (mobileScreen ? 80 : 50),
        innerRadius = outerRadius * 0.85,
        opacityDefault = 0.7, //default opacity of chords
        opacityLow = 0.02; //hover opacity of those chords not hovered over

    //How many pixels should the two halves be pulled apart
    var pullOutSize = 15;

    //////////////////////////////////////////////////////
    //////////////////// Titles on top ///////////////////
    //////////////////////////////////////////////////////

    var titleWrapper = svg.append("g").attr("class", "chordTitleWrapper"),
        titleOffset = mobileScreen ? 15 : 40,
        titleSeparate = mobileScreen ? 30 : 0;

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
        .attr("dur", "7s")
        .attr("repeatCount", "indefinite");

    linearGradient.append("animate")
        .attr("attributeName", "x2")
        .attr("values", "100%;200%")
        //  .attr("from","100%")
        //  .attr("to","200%")
        .attr("dur", "7s")
        .attr("repeatCount", "indefinite");

    linearGradient.append("stop")
        .attr("offset", "5%")
        .attr("stop-color", "#E8E8E8");
    linearGradient.append("stop")
        .attr("offset", "45%")
        .attr("stop-color", "#A3A3A3");
    linearGradient.append("stop")
        .attr("offset", "55%")
        .attr("stop-color", "#A3A3A3");
    linearGradient.append("stop")
        .attr("offset", "95%")
        .attr("stop-color", "#E8E8E8");

    ////////////////////////////////////////////////////////////
    ////////////////////////// Data ////////////////////////////
    ////////////////////////////////////////////////////////////

    /*var Names = ["Administrative Staff", "Crafts", "Business Management", "Basic Occupations", "Health",
        "IT", "Juridical & Cultural", "Management functions", "Teachers",
        "Salesmen & Service providers", "Caretakers", "Science & Engineering", "Other", "",
        "Engineering", "Education", "Agriculture", "Art, Language & Culture", "Health", "Behavior & Social Sciences", "Economy", ""
    ];*/

    var Names = temp_name;
    //var Names = ["Country1", "Country2", "Country3", "Country4", "", "Artist1", "Artist2", "Artist3", ""];
    //17533


    /* var matrix = [
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 232, 65, 44, 57, 39, 123, 1373, 0], //Administratief personeel
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 11, 0, 0, 24, 0], //Ambachtslieden
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 173, 43, 52, 55, 36, 125, 2413, 0], //Bedrijfsbeheer (vak)specialisten
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 16, 13, 23, 10, 37, 54, 0], //Elementaire beroepen
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 161, 24, 17, 0, 2089, 85, 60, 0], //Gezondheidszorg (vak)specialisten
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 510, 0, 0, 57, 0, 0, 251, 0], //IT (vak)specialisten
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 118, 10, 454, 99, 1537, 271, 0], //Juridisch en culturele (vak)specialisten
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 76, 21, 10, 15, 125, 41, 261, 0], //Leidinggevende functies
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 2206, 37, 292, 32, 116, 76, 0], //Onderwijsgevenden
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 74, 43, 116, 51, 135, 752, 0], //Verkopers en verleners persoonlijke diensten
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 34, 0, 22, 27, 156, 36, 0], //Verzorgend personeel
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1141, 0, 111, 291, 0, 0, 48, 0], //Wetenschap en techniek (vak)specialisten
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 36, 0, 39, 0, 0, 20, 109, 0], //Other
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, emptyStroke], //dummyBottom
         [232, 32, 173, 32, 161, 510, 16, 76, 32, 96, 15, 1141, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0], //Techniek
         [65, 0, 43, 16, 24, 0, 118, 21, 2206, 74, 34, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //Onderwijs
         [44, 0, 52, 13, 17, 0, 10, 10, 37, 43, 0, 111, 39, 0, 0, 0, 0, 0, 0, 0, 0, 0], //Landbouw
         [57, 11, 55, 23, 0, 57, 454, 15, 292, 116, 22, 291, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //Kunst, Taal en Cultuur
         [39, 0, 36, 10, 2089, 0, 99, 125, 32, 51, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //Gezondheidszorg
         [123, 0, 125, 37, 85, 0, 1537, 41, 116, 135, 156, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0], //Gedrag & Maatschappij
         [1373, 24, 2413, 54, 60, 251, 271, 261, 76, 752, 36, 48, 109, 0, 0, 0, 0, 0, 0, 0, 0, 0], //Economie
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, emptyStroke, 0, 0, 0, 0, 0, 0, 0, 0] //dummyTop

     ];*/

    /* var matrix = [
         [0, 0, 0, 0, 0, 1, 3, 4, 0], //country1
         [0, 0, 0, 0, 0, 4, 5, 2, 0], //country2
         [0, 0, 0, 0, 0, 1, 4, 3, 0], //country3
         [0, 0, 0, 0, 0, 0, 3, 4, 0], //country4
         [0, 0, 0, 0, 0, 0, 0, 0, emptyStroke], //dummy
         [1, 4, 1, 0, 0, 0, 0, 0, 0], //artist1
         [3, 5, 4, 3, 0, 0, 0, 0, 0], //artist2
         [4, 2, 3, 4, 0, 0, 0, 0, 0], //artist3
         [0, 0, 0, 0, emptyStroke, 0, 0, 0, 0] //dummy
     ]*/

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
        .style("stroke", function(d, i) { return (Names[i] === "" ? "none" : "#00A1DE"); })
        .style("fill", function(d, i) { return (Names[i] === "" ? "none" : "#00A1DE"); })
        .style("pointer-events", function(d, i) { return (Names[i] === "" ? "none" : "auto"); })
        .attr("d", arc)
        .attr("transform", function(d, i) { //Pull the two slices apart
            d.pullOutSize = pullOutSize * (d.startAngle + 0.001 > Math.PI ? -1 : 1);
            return "translate(" + d.pullOutSize + ',' + 0 + ")";
        });

    ////////////////////////////////////////////////////////////
    ////////////////////// Append Names ////////////////////////
    ////////////////////////////////////////////////////////////

    //The text also needs to be displaced in the horizontal directions
    //And also rotated with the offset in the clockwise direction
    g.append("text")
        .each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2) + offset; })
        .attr("dy", ".35em")
        .attr("class", "titles")
        .style("font-size", mobileScreen ? "8px" : "10px")
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
//wrapChord}