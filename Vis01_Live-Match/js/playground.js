// 2D LIVE
// #0 Set proper constants for de_dust2
// #1 Load SVG
// #2 Load picture of de_dust2 map
// #3 Load relevant CSV file
// Here, playerFrames.csv
// #4 Identify/Load up data which should be used
// This data depends on time/is a time-series
// Each 'frame' which is a set of 64-tick should take a second
// There are 10 players per frame (10 rows)
// Position: 'x', 'y', 'z'
// Rotation 'viewX', 'viewY'
// Round number can be used to identify boundaries ('roundNum')
// A timer can be instantiated during round duration ('seconds')
// Current dead/alive status can be tracked ('isAlive')
// ADDITIONAL info for table
// Lots of cool data could be tracked in an additional playground
// 'teamname', 'name', 'hp', 'armor', 'activeWeapon', 'flashGrenades', 'smokeGrenades', 'heGrenades', 'fireGrenades', 'cash', 'hasBomb'
// Load data properly, add transitions
// In this first playground,
// I attempt to have an automatic playback of CS:GO rounds
// We will select only the first round for this first playback

// Declaring Constants
const ctx = {width : 1024,
    height : 1024,
    startPosX : -2476,
    startPosY :  3239,
    mapScale : 4.4,
    playerCoordinatesTeam1Alive : [],
    playerCoordinatesTeam2Alive : [],
    playerCoordinatesTeam1Dead: [],
    playerCoordinatesTeam2Dead: [],
    timeIndex : 0,
    roundValue : 1,
    timer: null
};

// Circle Generator

let circleGen = d3.symbol().type(d3.symbolCircle)
				  .size(128);

// Create visualization function
function createViz(){

  console.log("Using D3 v"+d3.version);

  // append the svg object to the body of the page
  const svg = d3.select("#main")
  .append("svg")
    .attr("width", ctx.width)
    .attr("height", ctx.height)
  .append("g");

  // add background map image
  svg.append('image')
    .attr('xlink:href', 'data/de_dust2.png')
    .attr('width',  ctx.width)
    .attr('height', ctx.height);

  // Group for team 1 positions
  svg.append("g").attr("id", "team1alive");

  // Group for team 2 positions
  svg.append("g").attr("id", "team2alive");

  // Group for team 1 positions
  svg.append("g").attr("id", "team1dead");

  // Group for team 2 positions
  svg.append("g").attr("id", "team2dead");


  updateData();
}

var startStop = function(){

  if(ctx.timer!=null)
  {
    ctx.timer.stop();
  }
  ctx.timer = null;

  ctx.playerCoordinatesTeam1Alive = [];
  ctx.playerCoordinatesTeam2Alive = [];
  ctx.playerCoordinatesTeam1Dead = [];
  ctx.playerCoordinatesTeam2Dead = [];

    // Live Players
    let playerPosDataTeam1 = d3.select("#team1alive").selectAll("image").data(ctx.playerCoordinatesTeam1Alive, (d) => (d.name));
  
    playerPosDataTeam1.exit().remove();
  
    let playerPosDataTeam2 = d3.select("#team2alive").selectAll("image").data(ctx.playerCoordinatesTeam2Alive, (d) => (d.name));
  
    playerPosDataTeam2.exit().remove();
  
    // Dead Players
  
    let playerPosDataTeam1Dead = d3.select("#team1dead").selectAll("image").data(ctx.playerCoordinatesTeam1Dead, (d) => (d.name));
    
    playerPosDataTeam1Dead.exit().remove();

    let playerPosDataTeam2Dead = d3.select("#team2dead").selectAll("image").data(ctx.playerCoordinatesTeam2Dead, (d) => (d.name));
   
    playerPosDataTeam2Dead.exit().remove();

    // Reset Timer
    d3.select("#info").text("Round Time (seconds): 0");

};

var set = function(){

  if(ctx.timer!=null)
  {
    ctx.timer.stop();
  }
  
  var searchType = document.querySelector('#searchType').value;
  ctx.roundValue = parseInt(searchType);
  ctx.timeIndex = 0;
  
  ctx.timer = null;

  ctx.playerCoordinatesTeam1Alive = [];
  ctx.playerCoordinatesTeam2Alive = [];
  ctx.playerCoordinatesTeam1Dead = [];
  ctx.playerCoordinatesTeam2Dead = [];

    // Live Players
    let playerPosDataTeam1 = d3.select("#team1alive").selectAll("image").data(ctx.playerCoordinatesTeam1Alive, (d) => (d.name));
  
    playerPosDataTeam1.exit().remove();
  
    let playerPosDataTeam2 = d3.select("#team2alive").selectAll("image").data(ctx.playerCoordinatesTeam2Alive, (d) => (d.name));
  
    playerPosDataTeam2.exit().remove();
  
    // Dead Players
  
    let playerPosDataTeam1Dead = d3.select("#team1dead").selectAll("image").data(ctx.playerCoordinatesTeam1Dead, (d) => (d.name));
    
    playerPosDataTeam1Dead.exit().remove();

    let playerPosDataTeam2Dead = d3.select("#team2dead").selectAll("image").data(ctx.playerCoordinatesTeam2Dead, (d) => (d.name));
   
    playerPosDataTeam2Dead.exit().remove();

  updateData();
};

function updateData()
{
    if(ctx.timer == null)
    {
      ctx.timer = d3.interval(updateData,1000);
    }
    // read data
    d3.csv("data/playerFrames.csv").then(function(data) {

      // Filtering data to only contain for round 1 & show for a single player
      //let round1InfoPlayer1 = data.filter(function(d){ return d[""] == 0 });
      let round1InfoTeam1 = data.filter(function(d){ return d.roundNum == ctx.roundValue && d.team == "OGEsports"});

      let round1InfoTeam2 = data.filter(function(d){ return d.roundNum == ctx.roundValue && d.team == "Natus Vincere"});

      if(ctx.timeIndex*5>=round1InfoTeam1.length)
      {
        ctx.timer.stop();
        // Timer show end
        d3.select("#info").text("Round End!");
      }
      else
      {
        let currentIndex = ctx.timeIndex * 5;
        ctx.timeIndex += 1;

       

        // Not resetting the array might be interesting to get 'shadows' of players
        ctx.playerCoordinatesTeam1Alive = [];
        ctx.playerCoordinatesTeam2Alive = [];
        ctx.playerCoordinatesTeam1Dead = [];
        ctx.playerCoordinatesTeam2Dead = [];

         // Set timer at currentIndex
         d3.select("#info").text("Round Time (seconds): "+parseInt(round1InfoTeam1[currentIndex]["seconds"]));
    
        for (let i = currentIndex; i < currentIndex +5; i++)
        {
          if (round1InfoTeam1[i]["isAlive"] == "True" )
          {
            ctx.playerCoordinatesTeam1Alive.push({"x":round1InfoTeam1[i]["x"], "y":round1InfoTeam1[i]["y"], "viewX":round1InfoTeam1[i]["viewX"], "name":round1InfoTeam1[i]["name"]});
          }
          else
          {
            ctx.playerCoordinatesTeam1Dead.push({"x":round1InfoTeam1[i]["x"], "y":round1InfoTeam1[i]["y"], "viewX":round1InfoTeam1[i]["viewX"], "name":round1InfoTeam1[i]["name"]});
          }
          if (round1InfoTeam2[i]["isAlive"] == "True" )
          {
          ctx.playerCoordinatesTeam2Alive.push({"x":round1InfoTeam2[i]["x"], "y":round1InfoTeam2[i]["y"], "viewX":round1InfoTeam2[i]["viewX"], "name":round1InfoTeam2[i]["name"]});
          }
          else
          {
            ctx.playerCoordinatesTeam2Dead.push({"x":round1InfoTeam2[i]["x"], "y":round1InfoTeam2[i]["y"], "viewX":round1InfoTeam2[i]["viewX"], "name":round1InfoTeam2[i]["name"]});
          }
        }
        
    
        console.log(ctx.playerCoordinatesTeam1Alive);
        console.log(ctx.playerCoordinatesTeam2Alive);
    
        representPlayers(ctx.playerCoordinatesTeam1Alive, ctx.playerCoordinatesTeam2Alive,  ctx.playerCoordinatesTeam1Dead,  ctx.playerCoordinatesTeam2Dead);
        
    
        
        // Getting X and Y pos of each player tidied up at each specific tick
      }
  
     
  
      
  
  }).catch(function(error){console.log(error)});
}



function representPlayers(playerCoordinatesTeam1Alive, playerCoordinatesTeam2Alive,  playerCoordinatesTeam1Dead,  playerCoordinatesTeam2Dead)
{

  // Live Players
  let playerPosDataTeam1 = d3.select("#team1alive").selectAll("image").data(playerCoordinatesTeam1Alive, (d) => (d.name));

  playerPosDataTeam1.transition()
  .duration(1000)
  .attr("transform",  function(d){
    return playerPositionTranslator(d.x, d.y, d.viewX);});

  playerPosDataTeam1.enter().append("image")
  .attr("xlink:href", "data/team1.png")
  .attr("transform", function(d){
      return playerPositionTranslator(d.x, d.y, d.viewX);
  })
  .attr("width", 20)
  .attr("height", 20)
  .append("title")
  .text((d) => (d.name));

  playerPosDataTeam1.exit().remove();

  let playerPosDataTeam2 = d3.select("#team2alive").selectAll("image").data(playerCoordinatesTeam2Alive, (d) => (d.name));

  playerPosDataTeam2.transition()
  .duration(1000)
  .attr("transform",  function(d){
    return playerPositionTranslator(d.x, d.y, d.viewX);});

  playerPosDataTeam2.enter().append("image")
  .attr("xlink:href", "data/team2.png")
  .attr("transform", function(d){
      return playerPositionTranslator(d.x, d.y, d.viewX);
  })
  .attr("width", 20)
  .attr("height", 20)
  .append("title")
  .text((d) => (d.name));

  playerPosDataTeam2.exit().remove();

  // Dead Players

  let playerPosDataTeam1Dead = d3.select("#team1dead").selectAll("image").data(playerCoordinatesTeam1Dead, (d) => (d.name));
  playerPosDataTeam1Dead.enter().append("image")
  .attr("xlink:href", "data/team1dead.png")
  .attr("transform", function(d){
      return playerPositionTranslator(d.x, d.y,0);
  })
  .attr("width", 20)
  .attr("height", 20)
  .append("title")
  .text((d) => (d.name));

  let playerPosDataTeam2Dead = d3.select("#team2dead").selectAll("image").data(playerCoordinatesTeam2Dead, (d) => (d.name));
  playerPosDataTeam2Dead.enter().append("image")
  .attr("xlink:href", "data/team2dead.png")
  .attr("transform", function(d){
      return playerPositionTranslator(d.x, d.y, 0);
  })
  .attr("width", 20)
  .attr("height", 20)
  .append("title")
  .text((d) => (d.name));

}

function playerPositionTranslator(x,y,rotation)
{
  return `translate(${(parseFloat(x) - (ctx.startPosX))/ctx.mapScale},${(ctx.startPosY - parseFloat(y))/ctx.mapScale }) rotate(${parseInt(rotation)} 0 0)`;
}