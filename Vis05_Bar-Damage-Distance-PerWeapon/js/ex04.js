const ctx = {
    w: 820,
    h: 720,
    DM: {RV:"Radial Velocity", PT: "Primary Transit"},
};

let circleGen = d3.symbol().type(d3.symbolCircle)
				  .size(ctx.GLYPH_SIZE);

let crossGen = d3.symbol().type(d3.symbolCross)
				 .size(ctx.GLYPH_SIZE);

// code for Section 4 (optional)
// data = array of exoplanets with their attributes
// pG = d3 reference to the <g> element
//      for the corresponding category of detection method
function densityPlot(data, pG){
    let calcTemps = data.map(function(p){return p.temp_calculated;});
    let temperatureScale = d3.scaleLinear()
                             .domain(ctx.yScale.domain())
                             .range(ctx.yScale.range());
    let n = calcTemps.length,
        density = kernelDensityEstimator(kernelEpanechnikov(7), temperatureScale.ticks(12))(calcTemps);
    let maxDensity = d3.max(density, (d) => (d[1]));
    let densityScale = d3.scaleLinear()
            .domain([0, maxDensity])
            .range([0, ctx.JITTER_W*0.8]);
    // remove entries where y=0 to avoid unnecessarily-long tails
    let i = density.length - 1;
    let lastNonZeroBucket = -1;
    while (i>=0){
        // walk array backward, find last entry >0 at index n, keep n+1
        if (density[i][1] > 0){
            lastNonZeroBucket = i;
            break;
        }
        i--;
    }
    if (lastNonZeroBucket != -1){
        density = density.splice(0, lastNonZeroBucket+3);
    }
    // insert a point at 0,0 so that the path fill does not cross the curve
    density.unshift([0,0]);
    // now draw the density curve
    // TBW ...
};

function loadData(){
    d3.csv("data/damages.csv").then(function(data){
        //console.log(`Exoplanet total count: ${data.length}`);
        let planetsWithCalTemp = data;
        planetsWithCalTemp.forEach(
            (d) => {d.distance = parseFloat(d.distance);}
        );
        //console.log(`Exoplanets with calculated temperature: ${planetsWithCalTemp.length}`);
        // ...
        // initializig the visualization (scales, labels, axes)
     initSVGcanvas(planetsWithCalTemp);
     // actually displaying the exoplanet points in the scatterplot
     //populateSVGcanvas(planetsWithCalTemp);
    }).catch(function(error){console.log(error)});

     
};

function initSVGcanvas(planetData){

    let tempAxis = d3.max(planetData, ((d) => parseFloat(d.distance)));

     ctx.yScale = d3.scaleLinear().domain([0, tempAxis])
                                  .range([ctx.h-60, 20]);


    d3.select("#bkgG").append("g")
      .attr("transform", "translate(60,0)")
      .call(d3.axisLeft(ctx.yScale).ticks(10))
      .selectAll("text")
      .style("text-anchor", "end");
    d3.select("#bkgG")
      .append("text")
      .attr("y", 0)
      .attr("x", 0)
      .attr("transform", `rotate(-90) translate(-${ctx.h/2},7)`)
      .classed("axisLb", true)
      .text("Distance between Attacker and Victim (in-game units)");

    rootG = d3.select("g#rootG");
    rootG.append("g").attr("id", "raw_distribution");
    rootG.append("g").attr("id", "radial_velocity");
    rootG.append("g").attr("id", "primary_transit"); 
    rootG.append("g").attr("id", "imaging"); 
    rootG.append("g").attr("id", "ttv");

    let radial_velocity_summary = getSummaryStatistics(planetData);
    let primary_transit_summary = getSummaryStatistics(planetData.filter(
      function(d){return (d.weaponClass == "Rifle");
    }));;
    let imaging_summary = getSummaryStatistics(planetData.filter(
      function(d){return (d.weaponClass == "Pistols");
    }));;
    let ttv_summary = getSummaryStatistics(planetData.filter(
      function(d){return (d.weaponClass == "SMG");
    }));;
    
    d3.select("#raw_distribution").append("text")
      .attr("y", ctx.h - 45)
      .attr("x",(ctx.w/6)*1 )
      .classed("axisLb", true)
      .text("All Weapons");

    d3.select("#raw_distribution").selectAll("circle")
      .data(planetData)
      .enter()
      .append("circle")
      .attr("cx", function(d){
          return (ctx.w/6) + Math.random()*60;
      })
      .attr("cy", function(d){return ctx.yScale(d.distance)})
      .attr("r", "2")
      .attr("fill", "#003f5c");


      d3.select("#raw_distribution")
      .append("line")
      .attr("x1", (ctx.w/6)*1+30)
      .attr("y1", ctx.yScale(radial_velocity_summary.min))
      .attr("x2", (ctx.w/6)*1+30)
      .attr("y2", ctx.yScale(radial_velocity_summary.max))
      .style("stroke", "black");

      d3.select("#raw_distribution")
      .append("rect")
    .attr("x", (ctx.w/6)*1)
    .attr("y", ctx.yScale(radial_velocity_summary.q3) )
    .attr("height", (ctx.yScale(radial_velocity_summary.q1)-ctx.yScale(radial_velocity_summary.q3)) )
    .attr("width", 60 )
    .style("fill", "transparent")
    .attr("stroke", "black");

    d3.select("#raw_distribution")
    .selectAll("toto")
    .data([radial_velocity_summary.min, radial_velocity_summary.median, radial_velocity_summary.max])
    .enter()
  .append("line")
  .attr("x1", (ctx.w/6)*1-25+25)
  .attr("x2", (ctx.w/6)*1+25+25)
  .attr("y1", function(d){ return(ctx.yScale(d)) })
  .attr("y2", function(d){ return(ctx.yScale(d)) })
  .attr("stroke", "black");



    d3.select("#imaging").append("text")
      .attr("y", ctx.h - 45)
      .attr("x",(ctx.w/6)*2+10 )
      .classed("axisLb", true)
      .text("Rifle");

    d3.select("#imaging").selectAll("circle")
      .data(planetData.filter(function(d){
        return (d.weaponClass == "Rifle");
      }))
      .enter()
      .append("circle")
      .attr("cx", function(d){
          return (ctx.w/6)*2 + Math.random()*50;
      })
      .attr("cy", function(d){return ctx.yScale(d.distance)})
      .attr("r", "2")
      .attr("fill", "#58508d");;


      d3.select("#imaging")
      .append("line")
      .attr("x1", (ctx.w/6)*2+25)
      .attr("y1", ctx.yScale(imaging_summary.min))
      .attr("x2", (ctx.w/6)*2+25)
      .attr("y2", ctx.yScale(imaging_summary.max))
      .style("stroke", "black");

      d3.select("#imaging")
      .append("rect")
    .attr("x", (ctx.w/6)*2)
    .attr("y", ctx.yScale(imaging_summary.q3) )
    .attr("height", (ctx.yScale(imaging_summary.q1)-ctx.yScale(imaging_summary.q3)) )
    .attr("width", 50 )
    .style("fill", "transparent")
    .attr("stroke", "black");

    d3.select("#imaging")
    .selectAll("toto")
    .data([imaging_summary.min, imaging_summary.median, imaging_summary.max])
    .enter()
  .append("line")
  .attr("x1", (ctx.w/6)*2-25+25)
  .attr("x2", (ctx.w/6)*2+25+25)
  .attr("y1", function(d){ return(ctx.yScale(d)) })
  .attr("y2", function(d){ return(ctx.yScale(d)) })
  .attr("stroke", "black");

    d3.select("#primary_transit").append("text")
    .attr("y", ctx.h - 45)
    .attr("x",(ctx.w/6)*3)
    .classed("axisLb", true)
    .text("Pistols");


    d3.select("#primary_transit").selectAll("circle")
      .data(planetData.filter(function(d){
        return (d.weaponClass == "Pistols");
      }))
      .enter()
      .append("circle")
      .attr("cx", function(d){
          return (ctx.w/6)*3 + Math.random()*40 + 15;
      })
      .attr("cy", function(d){return ctx.yScale(d.distance)})
      .attr("r", "2")
      .attr("fill", "#bc5090");


      d3.select("#primary_transit")
      .append("line")
      .attr("x1", (ctx.w/6)*3+35)
      .attr("y1", ctx.yScale(primary_transit_summary.min))
      .attr("x2", (ctx.w/6)*3+35)
      .attr("y2", ctx.yScale(primary_transit_summary.max))
      .style("stroke", "black");

      d3.select("#primary_transit")
      .append("rect")
    .attr("x", (ctx.w/6)*3+15)
    .attr("y", ctx.yScale(primary_transit_summary.q3) )
    .attr("height", (ctx.yScale(primary_transit_summary.q1)-ctx.yScale(primary_transit_summary.q3)) )
    .attr("width", 40 )
    .style("fill", "transparent")
    .attr("stroke", "black");

    d3.select("#primary_transit")
    .selectAll("toto")
    .data([primary_transit_summary.min, primary_transit_summary.median, primary_transit_summary.max])
    .enter()
  .append("line")
  .attr("x1", (ctx.w/6)*3-20+35)
  .attr("x2", (ctx.w/6)*3+20+35)
  .attr("y1", function(d){ return(ctx.yScale(d)) })
  .attr("y2", function(d){ return(ctx.yScale(d)) })
  .attr("stroke", "black");

    d3.select("#radial_velocity").append("text")
    .attr("y", ctx.h - 45)
    .attr("x",(ctx.w/6)*4 )
    .classed("axisLb", true)
    .text("SMG");

    d3.select("#radial_velocity").selectAll("circle")
      .data(planetData.filter(function(d){
        return (d.weaponClass == "SMG");
      }))
      .enter()
      .append("circle")
      .attr("cx", function(d){
          return (ctx.w/6)*4 + Math.random()*30 +15;
      })
      .attr("cy", function(d){return ctx.yScale(d.distance)})
      .attr("r", "2")
      .attr("fill", "#ff6361");


      d3.select("#radial_velocity")
      .append("line")
      .attr("x1", (ctx.w/6)*4+30)
      .attr("y1", ctx.yScale(radial_velocity_summary.min))
      .attr("x2", (ctx.w/6)*4+30)
      .attr("y2", ctx.yScale(radial_velocity_summary.max))
      .style("stroke", "black");

      d3.select("#radial_velocity")
      .append("rect")
    .attr("x", (ctx.w/6)*4+15)
    .attr("y", ctx.yScale(radial_velocity_summary.q3) )
    .attr("height", (ctx.yScale(radial_velocity_summary.q1)-ctx.yScale(radial_velocity_summary.q3)) )
    .attr("width", 30 )
    .style("fill", "transparent")
    .attr("stroke", "black");

    d3.select("#radial_velocity")
    .selectAll("toto")
    .data([radial_velocity_summary.min, radial_velocity_summary.median, radial_velocity_summary.max])
    .enter()
  .append("line")
  .attr("x1", (ctx.w/6)*4-15+30)
  .attr("x2", (ctx.w/6)*4+15+30)
  .attr("y1", function(d){ return(ctx.yScale(d)) })
  .attr("y2", function(d){ return(ctx.yScale(d)) })
  .attr("stroke", "black");

  /*
    d3.select("#ttv").append("text")
    .attr("y", ctx.h - 45)
    .attr("x",(ctx.w/6)*5 + 10 )
    .classed("axisLb", true)
    .text("TTV");

    d3.select("#ttv").selectAll("circle")
      .data(planetData.filter(function(d){
        return (d.detection_type == "TTV");
      }))
      .enter()
      .append("circle")
      .attr("cx", function(d){
          return (ctx.w/6)*5 + Math.random()*40;
      })
      .attr("cy", function(d){return ctx.yScale(d.temp_calculated)})
      .attr("r", "2")
      .attr("fill", "brown");


      
      d3.select("#ttv")
      .append("line")
      .attr("x1", (ctx.w/6)*5+15)
      .attr("y1", ctx.yScale(ttv_summary.min))
      .attr("x2", (ctx.w/6)*5+15)
      .attr("y2", ctx.yScale(ttv_summary.max))
      .style("stroke", "black");

      d3.select("#ttv")
      .append("rect")
    .attr("x", (ctx.w/6)*5)
    .attr("y", ctx.yScale(ttv_summary.q3) )
    .attr("height", (ctx.yScale(ttv_summary.q1)-ctx.yScale(ttv_summary.q3)) )
    .attr("width", 40 )
    .style("fill", "transparent")
    .attr("stroke", "black");

    d3.select("#ttv")
    .selectAll("toto")
    .data([ttv_summary.min, ttv_summary.median, ttv_summary.max])
    .enter()
  .append("line")
  .attr("x1", (ctx.w/6)*5-20+20)
  .attr("x2", (ctx.w/6)*5+20+20)
  .attr("y1", function(d){ return(ctx.yScale(d)) })
  .attr("y2", function(d){ return(ctx.yScale(d)) })
  .attr("stroke", "black");

*/
    

}

function populateSVGcanvas(planetData){
    // put planets in two separate <g>, one for each detection method,
    // to make it easier to manage, e.g., visibility toggling
    d3.select("#RV").selectAll("path")
      .data(planetData.filter(function(d){
        return (d.detection_type == ctx.DM.RV);
      }))
      .enter()
      .append("path")
      .attr("d", crossGen())
      .attr("transform", function(d){
          return planetTranslator(d.star_mass, d.mass);
      })
      .attr("fill", function(d){return ctx.cScale(d.discovered)})
      .append("title")
      .text((d) => (d.name));

    d3.select("#PT").selectAll("path")
      .data(planetData.filter(function(d){
        return (d.detection_type == ctx.DM.PT);
      }))
      .enter()
      .append("path")
      .attr("d", circleGen())
      .attr("transform", function(d){
          return planetTranslator(d.star_mass, d.mass);
      })
      .attr("stroke", function(d){return ctx.cScale(d.discovered)})
      .append("title")
      .text((d) => (d.name));

};

function planetTranslator(starMass, planetMass){
    return `translate(${ctx.xScale(starMass)},${ctx.yScale(planetMass)})`;
};

function createViz(){
    console.log("Using D3 v"+d3.version);
    var svgEl = d3.select("#main").append("svg");
    svgEl.attr("width", ctx.w);
    svgEl.attr("height", ctx.h);
    var rootG = svgEl.append("g").attr("id", "rootG");
    // group for background elements (axes, labels)
    rootG.append("g").attr("id", "bkgG");
    loadData();
};

/*-------------- Summary stats for box plot ------------------------*/
/*-------------- see Instructions/Section 3 ----------------------*/

function getSummaryStatistics(data){
    return d3.rollup(data, function(d){
        let q1 = d3.quantile(d.map(function(p){return p.distance;}).sort(d3.ascending), .25);
        let median = d3.quantile(d.map(function(p){return p.distance;}).sort(d3.ascending), .5);
        let q3 = d3.quantile(d.map(function(p){return p.distance;}).sort(d3.ascending), .75);
        let iqr = q3 - q1;
        let min = d3.min(data, (d) => (d.distance));
        let max = d3.max(data, (d) => (d.distance));
        return({q1: q1, median: median, q3:q3, iqr: iqr, min: min, max: max})
    });
};

/*-------------- kernel density estimator ------------------------*/
/*-------------- see Instructions/Section 4 ----------------------*/

function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}

function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}
