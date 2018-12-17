var format = function(d) {
    if (d>100) {return d3.format('.2s')(d)} else
       {return d3.format('.1f')(d)}
    
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

function generateMap(value,color){
    var map = d3.geomap.choropleth()
        .geofile('/lib/d3-geomap/topojson/world/countries.json')
        .colors(color)
        .column(value)
        .width(750)
        .format(format)
        .legend(true)
        .unitId('iso3')
        .duration(2500);
    
    d3.csv('../data/Countries.csv', function(error, data) {
        var selection = d3.select('#map').datum(data);
        map.draw(selection);



    });
}

function update(value, color){
    d3.select('#map').selectAll("svg").remove();
    generateMap(value, color);
    setTimeout(setClickTrigger, 500) 
}
function updateLife(newCountry){
    updateData1(newCountry)
    updateData2(newCountry)
    updateData3(newCountry)
}
$.getJSON('../data/countries.json', function(data) {
    $.each(data, function(key, entry) {
        $('#content').append($('<li>')
                .attr('value', entry.iso3)
                .html(entry.Country)
                .attr('onclick', "updateLife("+"'"+entry.iso3+"'"+")"));;
    })
});
var newCountry = "POR"
function switchIt(){
    if (d3.selectAll("#menu")._groups[0][0].className != 'nav expanded'){
        d3.selectAll("#menu")._groups[0][0].className = "nav expanded"
    } else {
        d3.selectAll("#menu")._groups[0][0].className = "nav"
    }

}
update('GDP', colorbrewer.Greens[6])