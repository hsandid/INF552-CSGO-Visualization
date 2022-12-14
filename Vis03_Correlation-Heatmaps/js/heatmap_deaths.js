// set the dimensions of the svg/picture, and csgo's game specific X/Y translation parameters
// Declaring Constants
const ctx = {width : 1024,
  height : 1024,
  startPosX : -2476,
  startPosY :  3239,
  events: "Kills",
  weaponType: "All",
  mapScale : 4.4
};

var set = function(){

  
  ctx.weaponType = document.querySelector('#weaponType').value;
  ctx.events = document.querySelector('#eventType').value;

  visualizeData();
};

function createViz(){
  console.log("Using D3 v"+d3.version);
  // append the svg object to the body of the page
  let svg = d3.select("#main")
.append("svg")
  .attr("width", ctx.width)
  .attr("height", ctx.height)
.append("g")
.attr("id","heatmapData");
  // add background map image
 svg.append('image')
    .attr('xlink:href', 'data/de_dust2.png')
    .attr('width',  ctx.width)
    .attr('height', ctx.height)

   
    visualizeData();

}

function visualizeData()
{
  let promises = [d3.csv("data/kills.csv"),
  d3.csv("data/damages.csv")];

  Promise.all(promises).then(function(data){
  //drawMap(data[0], data[1], data[2], svgEl);
  //loadFlights();

  // Depending on if we want first kills, kills, or damages
  // process the right csv

  // Get the data here

  let processedData;

  //console.log(ctx.events);
  //console.log(ctx.weaponType);

  if(ctx.events=="Kills")
  {
    processedData = data[0];
  }
  else if(ctx.events=="First Kills")
  {
    processedData = data[0].filter(function(d){ return d.isFirstKill == "True"});
  }
  else if(ctx.events=="Trade Kills")
  {
    processedData = data[0].filter(function(d){ return d.isTrade == "True"});
  }
  else if(ctx.events=="Damages")
  {
    processedData = data[1];
  }

  if(ctx.weaponType!="All")
  {
    processedData = processedData.filter(function(d){ return d.weaponClass == ctx.weaponType});
  }
 
  console.log(processedData);
  displayHeatmap(processedData);


  }).catch(function(error){console.log(error)});
}

function displayHeatmap(data)
{
       // Prepare a color palette
        color = d3.scaleLinear()
       .domain([0, 0.002]) // Points per square pixel.
       .range(["#630f3d", "#ffa600"])
     
     
     // compute the density data for attackers
      densityDataDef = d3.contourDensity()
     .x(function(d) {return (parseFloat(d.victimX) - (ctx.startPosX))/ctx.mapScale})
     .y(function(d) {return (ctx.startPosY - parseFloat(d.victimY))/ctx.mapScale })
     .size([ctx.width, ctx.height])
     .bandwidth(17)
     .thresholds(10)
     (data)
     
     //console.log(data);
     let svg = d3.select("#heatmapData")
       .selectAll("path");

      svg.remove();

      d3.select("#heatmapData")
       .selectAll("path")
       .data(densityDataDef)
       //.exit().remove()
       .enter().append("path")
        .attr("d", d3.geoPath())
         .attr("fill", function(d) { return color(d.value); })
       .attr("opacity", 0.3)
}
