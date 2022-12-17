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
// If we want to reduce SVG size, we must divide coordinates accordingly,
// as they were designed for 1024x1024
const ctx = {width : 1024,
    height : 1024,
    startPosX : -2476,
    startPosY :  3239,
    mapScale : 4.4,
    playerCoordinatesTeam1Alive : [],
    playerCoordinatesTeam1Player1 : [],
    playerCoordinatesTeam1Player2 : [],
    playerCoordinatesTeam1Player3 : [],
    playerCoordinatesTeam1Player4 : [],
    playerCoordinatesTeam1Player5 : [],
    playerCoordinatesTeam2Player1 : [],
    playerCoordinatesTeam2Player2 : [],
    playerCoordinatesTeam2Player3 : [],
    playerCoordinatesTeam2Player4 : [],
    playerCoordinatesTeam2Player5 : [],
    playerCoordinatesTeam2Alive : [],
    playerCoordinatesTeam1Dead: [],
    playerCoordinatesTeam2Dead: [],
    test1: [],
    test2: [],
    test3: [],
    test4: [],
    test5: [],
    test6: [],
    test7: [],
    test8: [],
    test9: [],
    test10: [],
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

  // Group for team 1 positions
  svg.append("g").attr("id", "team1player1path");
  svg.append("g").attr("id", "team1player2path");
  svg.append("g").attr("id", "team1player3path");
  svg.append("g").attr("id", "team1player4path");
  svg.append("g").attr("id", "team1player5path");

  svg.append("g").attr("id", "team2player1path");
  svg.append("g").attr("id", "team2player2path");
  svg.append("g").attr("id", "team2player3path");
  svg.append("g").attr("id", "team2player4path");
  svg.append("g").attr("id", "team2player5path");

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

  let playerPosTeam1Player1 = d3.select("#team1player1path");


  playerPosTeam1Player1.selectAll("path").remove();
 

  let playerPosTeam1Player2 = d3.select("#team1player2path");


  playerPosTeam1Player2.selectAll("path").remove();


  let playerPosTeam1Player3 = d3.select("#team1player3path");


  playerPosTeam1Player3.selectAll("path").remove();
 

  let playerPosTeam1Player4 = d3.select("#team1player4path");


  playerPosTeam1Player4.selectAll("path").remove();

  let playerPosTeam1Player5 = d3.select("#team1player5path");


  playerPosTeam1Player5.selectAll("path").remove();
 
  let playerPosTeam2Player1 = d3.select("#team2player1path");


  playerPosTeam2Player1.selectAll("path").remove();
 

  let playerPosTeam2Player2 = d3.select("#team2player2path");


  playerPosTeam2Player2.selectAll("path").remove();
  

  let playerPosTeam2Player3 = d3.select("#team2player3path");


  playerPosTeam2Player3.selectAll("path").remove();
  
  let playerPosTeam2Player4 = d3.select("#team2player4path");


  playerPosTeam2Player4.selectAll("path").remove();
  

  let playerPosTeam2Player5 = d3.select("#team2player5path");


  playerPosTeam2Player5.selectAll("path").remove();

  ctx.timeIndex = 0;

  ctx.test1 = [];
        ctx.test2 = [];
        ctx.test3 = [];
        ctx.test4 = [];
        ctx.test5 = [];
        ctx.test6 = [];
        ctx.test7 = [];
        ctx.test8 = [];
        ctx.test9 = [];
        ctx.test10 = [];
  

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

  let playerPosTeam1Player1 = d3.select("#team1player1path");


  playerPosTeam1Player1.selectAll("path").remove();
 

  let playerPosTeam1Player2 = d3.select("#team1player2path");


  playerPosTeam1Player2.selectAll("path").remove();


  let playerPosTeam1Player3 = d3.select("#team1player3path");


  playerPosTeam1Player3.selectAll("path").remove();
 

  let playerPosTeam1Player4 = d3.select("#team1player4path");


  playerPosTeam1Player4.selectAll("path").remove();

  let playerPosTeam1Player5 = d3.select("#team1player5path");


  playerPosTeam1Player5.selectAll("path").remove();
 
  let playerPosTeam2Player1 = d3.select("#team2player1path");


  playerPosTeam2Player1.selectAll("path").remove();
 

  let playerPosTeam2Player2 = d3.select("#team2player2path");


  playerPosTeam2Player2.selectAll("path").remove();
  

  let playerPosTeam2Player3 = d3.select("#team2player3path");


  playerPosTeam2Player3.selectAll("path").remove();
  
  let playerPosTeam2Player4 = d3.select("#team2player4path");


  playerPosTeam2Player4.selectAll("path").remove();
  

  let playerPosTeam2Player5 = d3.select("#team2player5path");


  playerPosTeam2Player5.selectAll("path").remove();

  ctx.timeIndex = 0;

  ctx.test1 = [];
        ctx.test2 = [];
        ctx.test3 = [];
        ctx.test4 = [];
        ctx.test5 = [];
        ctx.test6 = [];
        ctx.test7 = [];
        ctx.test8 = [];
        ctx.test9 = [];
        ctx.test10 = [];

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

      let oi1 = data.filter(function(d){ return d.roundNum == ctx.roundValue  && d.name == "mantuu"});
      let oi2 = data.filter(function(d){ return d.roundNum == ctx.roundValue  && d.name == "valde"});
      let oi3 = data.filter(function(d){ return d.roundNum == ctx.roundValue && d.name == "NBK-"});
      let oi4 = data.filter(function(d){ return d.roundNum == ctx.roundValue  && d.name == "Aleksib"});
      let oi5 = data.filter(function(d){ return d.roundNum == ctx.roundValue  && d.name == "ISSAA"});
      let oi6 = data.filter(function(d){ return d.roundNum == ctx.roundValue  && d.name == "electronic"});
      let oi7 = data.filter(function(d){ return d.roundNum == ctx.roundValue  && d.name == "Boombl4"});
      let oi8 = data.filter(function(d){ return d.roundNum == ctx.roundValue  && d.name == "s1mple"});
      let oi9 = data.filter(function(d){ return d.roundNum == ctx.roundValue  && d.name == "Perfecto"});
      let oi10 = data.filter(function(d){ return d.roundNum == ctx.roundValue  && d.name == "flamie"});


      //console.log(ctx.test);

      if(ctx.timeIndex>=oi1.length)
      {
        ctx.timer.stop();
        // Timer show end
        d3.select("#info").text("Round End!");
      }
      else
      {
        ctx.test1.push(oi1[ctx.timeIndex]);
        ctx.test2.push(oi2[ctx.timeIndex]);
        ctx.test3.push(oi3[ctx.timeIndex]);
        ctx.test4.push(oi4[ctx.timeIndex]);
        ctx.test5.push(oi5[ctx.timeIndex]);
        ctx.test6.push(oi6[ctx.timeIndex]);
        ctx.test7.push(oi7[ctx.timeIndex]);
        ctx.test8.push(oi8[ctx.timeIndex]);
        ctx.test9.push(oi9[ctx.timeIndex]);
        ctx.test10.push(oi10[ctx.timeIndex]);
        ctx.timeIndex += 1;

       

        // Not resetting the array might be interesting to get 'shadows' of players
        // Shouldn't reset these arrays
        // We have the points of 5 players added iteratively
        // How about separating them into 5 arrays, then using that to compute a path taken ?

        //ctx.playerCoordinatesTeam1Alive = [];
        //ctx.playerCoordinatesTeam2Alive = [];
        ctx.playerCoordinatesTeam1Dead = [];
        ctx.playerCoordinatesTeam2Dead = [];

         // Set timer at currentIndex
         d3.select("#info").text("Round Time (seconds): "+ctx.timeIndex);
    
        

        // Path setup
        // Only for team 1

      
        
        
        //console.log([playerPositionTranslator(ctx.playerCoordinatesTeam1Alive[currentIndex].x,ctx.playerCoordinatesTeam1Alive[currentIndex].y,0), playerPosition(ctx.playerCoordinatesTeam1Alive[currentIndex].x,ctx.playerCoordinatesTeam1Alive[currentIndex].y), currentIndex,  ctx.playerCoordinatesTeam1Player1[(ctx.timeIndex-1)], (ctx.timeIndex-1)])
       
    
        //console.log(ctx.playerCoordinatesTeam1Alive);
        //console.log(ctx.playerCoordinatesTeam2Alive);
    
        representPlayers();
        
    
        
        // Getting X and Y pos of each player tidied up at each specific tick
      }
  
     
  
      
  
  }).catch(function(error){console.log(error)});
}



function representPlayers()
{

  /*
  // Live Players
  let playerPosDataTeam1 = d3.select("#team1alive").selectAll("path").data(ctx.playerCoordinatesTeam1Alive, (d) => (d.name));

  playerPosDataTeam1.transition()
  .duration(1000)
  .attr("transform",  function(d){
    return playerPositionTranslator(d.x, d.y, d.viewX);});

  playerPosDataTeam1.enter().append("path")
  .attr("d", circleGen())
  .attr("transform", function(d){
      return playerPositionTranslator(d.x, d.y, d.viewX);
  })
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", "green")
  .attr("stroke","black")
  .append("title")
  .text((d) => (d.name));

  playerPosDataTeam1.exit().remove();

  let playerPosDataTeam2 = d3.select("#team2alive").selectAll("path").data(ctx.playerCoordinatesTeam2Alive, (d) => (d.name));

  playerPosDataTeam2.transition()
  .duration(1000)
  .attr("transform",  function(d){
    return playerPositionTranslator(d.x, d.y, d.viewX);});

  playerPosDataTeam2.enter().append("path")
  .attr("d", circleGen())
  .attr("transform", function(d){
      return playerPositionTranslator(d.x, d.y, d.viewX);
  })
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", "red")
  .attr("stroke","black")
  .append("title")
  .text((d) => (d.name));

  playerPosDataTeam2.exit().remove();

  */

    
  walkX = d3.scaleLinear()
  .domain([0, 1024])
  .range([0, ctx.width]);

  walkY = d3.scaleLinear()
  .domain([0, 1024])
  .range([0, ctx.height ]);

  var lineFun = d3.line()
  


  // Live Players Path lines
  // Add transitions later ?

  //console.log(ctx.playerCoordinatesTeam1Player1);
 
  let playerPosTeam1Player1 = d3.select("#team1player1path");


  playerPosTeam1Player1.selectAll("path").remove();
  playerPosTeam1Player1.append("path").datum(ctx.test1)
  .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
  .attr("d", d3.line().x(d => walkX(playerPositionX(d.x)))
  .y(d => walkY(playerPositionY(d.y))))
  .attr("fill", "none")
  .attr("stroke", "red")
  .style("stroke-dasharray", ("10,3")) // make the stroke dashed
  ;

  let playerPosTeam1Player2 = d3.select("#team1player2path");


  playerPosTeam1Player2.selectAll("path").remove();
  playerPosTeam1Player2.append("path").datum(ctx.test2)
  .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
  .attr("d", d3.line().x(d => walkX(playerPositionX(d.x)))
  .y(d => walkY(playerPositionY(d.y))))
  .attr("fill", "none")
  .style("stroke-dasharray", ("10,3")) // make the stroke dashed
  .attr("stroke", "red");

  let playerPosTeam1Player3 = d3.select("#team1player3path");


  playerPosTeam1Player3.selectAll("path").remove();
  playerPosTeam1Player3.append("path").datum(ctx.test3)
  .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
  .attr("d", d3.line().x(d => walkX(playerPositionX(d.x)))
  .y(d => walkY(playerPositionY(d.y))))
  .attr("fill", "none")
  .style("stroke-dasharray", ("10,3")) // make the stroke dashed
  .attr("stroke", "red");

  let playerPosTeam1Player4 = d3.select("#team1player4path");


  playerPosTeam1Player4.selectAll("path").remove();
  playerPosTeam1Player4.append("path").datum(ctx.test4)
  .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
  .attr("d", d3.line().x(d => walkX(playerPositionX(d.x)))
  .y(d => walkY(playerPositionY(d.y))))
  .attr("fill", "none")
  .style("stroke-dasharray", ("10,3")) // make the stroke dashed
  .attr("stroke", "red");

  let playerPosTeam1Player5 = d3.select("#team1player5path");


  playerPosTeam1Player5.selectAll("path").remove();
  playerPosTeam1Player5.append("path").datum(ctx.test5)
  .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
  .attr("d", d3.line().x(d => walkX(playerPositionX(d.x)))
  .y(d => walkY(playerPositionY(d.y))))
  .attr("fill", "none")
  .style("stroke-dasharray", ("10,3")) // make the stroke dashed
  .attr("stroke", "red");

  let playerPosTeam2Player1 = d3.select("#team2player1path");


  playerPosTeam2Player1.selectAll("path").remove();
  playerPosTeam2Player1.append("path").datum(ctx.test6)
  .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
  .attr("d", d3.line().x(d => walkX(playerPositionX(d.x)))
  .y(d => walkY(playerPositionY(d.y))))
  .attr("fill", "none")
  .style("stroke-dasharray", ("10,3")) // make the stroke dashed
  .attr("stroke", "green");

  let playerPosTeam2Player2 = d3.select("#team2player2path");


  playerPosTeam2Player2.selectAll("path").remove();
  playerPosTeam2Player2.append("path").datum(ctx.test7)
  .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
  .attr("d", d3.line().x(d => walkX(playerPositionX(d.x)))
  .y(d => walkY(playerPositionY(d.y))))
  .attr("fill", "none")
  .style("stroke-dasharray", ("10,3")) // make the stroke dashed
  .attr("stroke", "green");

  let playerPosTeam2Player3 = d3.select("#team2player3path");


  playerPosTeam2Player3.selectAll("path").remove();
  playerPosTeam2Player3.append("path").datum(ctx.test8)
  .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
  .attr("d", d3.line().x(d => walkX(playerPositionX(d.x)))
  .y(d => walkY(playerPositionY(d.y))))
  .attr("fill", "none")
  .style("stroke-dasharray", ("10,3")) // make the stroke dashed
  .attr("stroke", "green");

  let playerPosTeam2Player4 = d3.select("#team2player4path");


  playerPosTeam2Player4.selectAll("path").remove();
  playerPosTeam2Player4.append("path").datum(ctx.test9)
  .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
  .attr("d", d3.line().x(d => walkX(playerPositionX(d.x)))
  .y(d => walkY(playerPositionY(d.y))))
  .attr("fill", "none")
  .style("stroke-dasharray", ("10,3")) // make the stroke dashed
  .attr("stroke", "green");

  let playerPosTeam2Player5 = d3.select("#team2player5path");


  playerPosTeam2Player5.selectAll("path").remove();
  playerPosTeam2Player5.append("path").datum(ctx.test10)
  .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
  .attr("d", d3.line().x(d => walkX(playerPositionX(d.x)))
  .y(d => walkY(playerPositionY(d.y))))
  .attr("fill", "none")
  .style("stroke-dasharray", ("10,3")) // make the stroke dashed
  .attr("stroke", "green");

    
  //.attr("d", lineFun(ctx.playerCoordinatesTeam1Player1))
  //.attr("stroke", "red")
  //.attr("fill", "none");

  //console.log(ctx.playerCoordinatesTeam1Player1);
   /*

  let playerPosTeam1Player1 = d3.select("#team1player1path").selectAll("path");

  playerPosTeam1Player1.transition()
  .duration(1000)
  .attr("transform",  function(d){
    return playerPositionTranslator(d.x, d.y, d.viewX);});

    playerPosTeam1Player1.enter().append("path")
  .attr("d", circleGen())
  .attr("transform", function(d){
      return playerPositionTranslator(d.x, d.y, d.viewX);
  })
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", "green")
  .attr("stroke","black")
  .append("title")
  .text((d) => (d.name));

  playerPosTeam1Player1.exit().remove();

  */

  // Dead Players

  /*
  let playerPosDataTeam1Dead = d3.select("#team1dead").selectAll("path").data(playerCoordinatesTeam1Dead, (d) => (d.name));
  playerPosDataTeam1Dead.enter().append("path")
  .attr("transform", function(d){
      return playerPositionTranslator(d.x, d.y,0);
  })
  .attr("width", 20)
  .attr("height", 20)
  .attr("stroke","green")
  .append("title")
  .text((d) => (d.name));

  let playerPosDataTeam2Dead = d3.select("#team2dead").selectAll("path").data(playerCoordinatesTeam2Dead, (d) => (d.name));
  playerPosDataTeam2Dead.enter().append("path")
  .attr("transform", function(d){
      return playerPositionTranslator(d.x, d.y, 0);
  })
  .attr("width", 20)
  .attr("height", 20)
  .attr("stroke","red")
  .append("title")
  .text((d) => (d.name));
  */
}

function playerPositionTranslator(x,y,rotation)
{
  return `translate(${(parseFloat(x) - (ctx.startPosX))/ctx.mapScale},${(ctx.startPosY - parseFloat(y))/ctx.mapScale }) rotate(${parseInt(rotation)} 0 0)`;
}

function playerPositionTranslatorZ(x)
{
  return `translate( ${x[0]},${(ctx.startPosY - parseFloat(y))/ctx.mapScale})`;
}

function playerPosition(x,y)
{
  return {"x": ((parseFloat(x) - (ctx.startPosX))/ctx.mapScale), "y": ((ctx.startPosY - parseFloat(y))/ctx.mapScale)};
}

function playerPositionX(x)
{
  return (parseFloat(x) - (ctx.startPosX))/ctx.mapScale;
}

function playerPositionY(y)
{
  return ((ctx.startPosY - parseFloat(y))/ctx.mapScale);
}