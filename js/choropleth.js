var format = function(d) {
    return d3.format(',.02f')(d);
}

function setClickTrigger(){
    d3.select('#map').select('svg').on("click", searchActive)
}

function searchActive(){
    var countriesClass = d3.selectAll('path')
    countriesClass["_groups"][0].forEach(function(active){
        if (active.className.animVal.includes("active")){
            newCountry = active.classList[1].split("-")[1]
            updateLife(newCountry)
        }
    })
}

function generateMap(){
    var map = d3.geomap.choropleth()
        .geofile('/lib/d3-geomap/topojson/world/countries.json')
        .colors(colorbrewer.Greens[8])
        .column('GDP')
        .width(800)
        .format(format)
        .legend(true)
        .unitId('iso3');
    
    d3.csv('../data/Countries.csv', function(error, data) {
        var selection = d3.select('#map').datum(data);
        map.draw(selection);



    });
}

function update(){
    generateMap()
    setTimeout(setClickTrigger, 500) 
}
function updateLife(newCountry){
    updateData1(newCountry)
    updateData2(newCountry)
    updateData3(newCountry)
}

var newCountry = "POR"

update()