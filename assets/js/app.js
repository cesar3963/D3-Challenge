// @TODO: YOUR CODE HERE!
id="scatter"

//svg limits
var svgWidth = 960;
var svgHeight = 620;

//Margin size 
var margin = {
  top: 20,
  right: 40,
  bottom: 200,
  left: 100
};

//Setting margens less then svg limits
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// svg wrapper to hold svg group
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

 // Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";
// function used for updating x-scale var upon click on axis label

function xScale(state_data, chosenXAxis) {
// create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(state_data, d => d[chosenXAxis]) * 0.8,
      d3.max(state_data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

  }

// function used for updating YAxis var upon click on axis label

function renderAxesX(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
  }

// function used for updating y-scale var upon click on axis label

function yScale(state_data, chosenYAxis) {
  // create scales
    var YLinearScale = d3.scaleLinear()
      .domain([d3.min(state_data, d => d[chosenYAxis]) * 0.8,
        d3.max(state_data, d => d[chosenYAxis]) * 1.2
      ])
      .range([0, height]);
  
    return YLinearScale;
  
  }
    

// function used for updating YAxis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
  var LeftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(LeftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}

//function used for updating state labels with a transition to new 
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));
     
  return textGroup;
}


//function to stylize x-axis values for tooltips
function styleX(value, chosenXAxis) {

    //stylize based on variable chosen
    //poverty percentage
    if (chosenXAxis === 'poverty') {
        return `${value}%`;
    }
    //household income in dollars
    else if (chosenXAxis === 'income') {
        return `$${value}`;
    }
    //age (number)
    else {
        return `${value}`;
    }
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var xlabel = "Poverty:";
  }
  else if (chosenXAxis === "income"){
    var xlabel = "Median Income:";
  }
  else {
    var xlable = "Age:";
  }
  

  if (chosenXAxis === "healthcare") {
    var ylabel = "Healthcare:";
  }
  else if (chosenXAxis === "obesity"){
    var ylabel = "Obesity:";
  }
  else {
    var ylable = "Smokers:";
  }
  

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${styleX(d[chosenXAxis],chosenXAxis)}<br>${ylabel} ${d[chosenYAxis]}%`);
    }); 

  
  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", toolTip.show)
    .on("mouseout", toolTip.hide);

  return circlesGroup;
}
//   circlesGroup.on("mouseover",
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });

//   return circlesGroup;
// }
  

// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function(state_data,err) {
  console.log(state_data);
// d3.csv("data/data.csv").then(function(state_data, err) {
  if (err) throw err;

  // parse data
  state_data.forEach(function(data) {
    data.poverty    = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age        = +data.age;
    data.smokes     = +data.smokes;
    data.obesity    = +data.obesity;
    data.income     = +data.income;
  });

  // x and y LinearScale function above csv import
  var xLinearScale = xScale(state_data, chosenXAxis);
  var yLinearScale = yScale(state_data, chosenYAxis);
  
  
  //create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var LeftAxis = d3.axisLeft(yLinearScale);

  
  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  // chartGroup.append("g")
  //   .call(LeftAxis);


  var yAxis = chartGroup.append("g")
  .classed("y-axis", true)
  .call(LeftAxis);


  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(state_data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 12)
    .attr("fill", "blue")
    .attr("opacity", ".5");

  // adding state name to circle 
  var textGroup = chartGroup.selectAll(".stateText")
    .data(state_data)
    .enter()
    .append("text")
    .classed("stateText", true)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("dy", 3)
    .attr("font-size", "10px")
    .text(function(d) { return d.abbr });
    
    
  // Create group for 3 x-axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);
    //append initial text
  
  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .classed("aText", true)
    .text("Poverty (%):");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .classed("aText", true)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median):");

 
    var incomeLabel = xlabelsGroup.append("text")
    .classed("inactive", true)
    .attr("y", 60)
    .attr("x", 0 )
    .attr("value", "income")
    .classed("aText", true)
    .text("Household Income (Median):");


    // Create group for 3 x-axis labels
    var ylabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${margin.left/-2}, ${height /2})`);
  
    
    var healthLabel = ylabelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0)
      .attr("y",0 - 20)
      .attr("dy", "1em")
      .attr("value", "healthcare") // value to grab for event listener
      .classed("active", true)
      .classed("aText", true)
      .text("Needs Healthcare (%):");
  
    var smokesLabel = ylabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 0 - 50)
      .attr("dy", "1em")
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .classed("aText", true)
      .attr("transform", "rotate(-90)")
      .text("Smokes (%):");
  
    // append y axis
    var obesityLabel = ylabelsGroup.append("text")      .attr("transform", "rotate(-90)")
      .classed("aText", true)
      .classed("inactive", true)
      .attr("y", 0+5 )
      .attr("x", 0 - 35)
      .attr("dy", "1em")
      .attr("transform", "rotate(-90)")
      .attr("value", "obesity")
      .text("Obesity (%):");
      
      
  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(state_data, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxesX(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
        
        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel.classed("active", true);
          ageLabel.classed("inactive", false);
          incomeLabel.classed("active", false);
        }
        else if (chosenXAxis === "age") {
          povertyLabel.classed("active", false);
          ageLabel.classed("inactive", true);
          incomeLabel.classed("active", false);
        }
        else {
          povertyLabel.classed("active", false);
          ageLabel.classed("inactive", false);
          incomeLabel.classed("active", true);
        }
      }
    });

  //y axis labels event listener
  ylabelsGroup.selectAll("text")
      .on("click", function() {
          //get value of selection
          var value = d3.select(this).attr("value");

          //check if value is same as current axis
          if (value != chosenYAxis) {

              //replace chosenYAxis with value
              chosenYAxis = value;

              //update y scale for new data
              yLinearScale = yScale(state_data, chosenYAxis);

              //update y axis with transition
              yAxis = renderAxesY(yLinearScale, yAxis);

              //update circles with new y values
              circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

              //update text with new y values

              textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);



function styleX(value, chosenXAxis) {

    //stylize based on variable chosen
    //poverty percentage
    if (chosenXAxis === 'poverty') {
        return `${value}%`;
    }
    //household income in dollars
    else if (chosenXAxis === 'income') {
        return `$${value}`;
    }
    //age (number)
    else {
        return `${value}`;
    }
}

    //update tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    //change classes to change bold text
    if (chosenYAxis === "obesity") {
        obesityLabel.classed("active", true).classed("inactive", false);
        smokesLabel.classed("active", false).classed("inactive", true);
        healthLabel.classed("active", false).classed("inactive", true);
    } else if (chosenYAxis === "smokes") {
        obesityLabel.classed("active", false).classed("inactive", true);
        smokesLabel.classed("active", true).classed("inactive", false);
        healthLabel.classed("active", false).classed("inactive", true);
    } else {
        obesityLabel.classed("active", false).classed("inactive", true);
        smokesLabel.classed("active", false).classed("inactive", true);
        healthLabel.classed("active", true).classed("inactive", false);
    }
}
});


}); 