var margin = {top: 20, right: 100, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear().domain([-1, 1]).range([0, width]),
    y = d3.scaleLinear().domain([-1, 1]).range([height, 0]),
    x_val = function(d) { }
    xMap = function(d){ return d["location x"];};
    yMap = function(d){ return d["location y"];};

var xAxis = d3.axisBottom()
      .scale(x);

    yAxis = d3.axisLeft()
      .scale(y);

var cValue = function(d) { return d["shoot player"];},
    color = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("data/shot log CLE.csv", function(error, all_data) {
  if(error) {
      console.log(error);
  }

  // change string (from CSV) into number format
  var data = [];
  all_data.forEach(function(d) {

      d["location x"] = +d["location x"];
      d["location y"] = +d["location y"];
      data.push(d);
    // d["location x"] = +d["location x"];
    // d["location y"] = +d["location y"];
//    console.log(d);
  });

  var x0 = [d3.min(data, xMap) - 1, d3.max(data, xMap) + 1];
  var y0 = [d3.min(data, yMap) - 1, d3.max(data, yMap) + 1];
x.domain(x0);
y.domain(y0);

var brush = d3.brush().on("end", brushended),
    idleTimeout,
    idleDelay = 350;

svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) { return x(xMap(d)); })
      .attr("cy", function(d) { return y(yMap(d)); })
      .style("fill", function(d) { return color(cValue(d));})
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", 0.9);
          tooltip.html(d["shoot player"] + "<br/> (" + xMap(d) + ", " + yMap(d) + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });

// x-axis
  svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .append("text")
    .attr("class", "label")
    .attr("x", width + 50)
    .attr("y", 10)
    .style("text-anchor", "end")
    .text("Location X");

svg.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(0,0)")
    .call(yAxis)
  .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(0)")
    .attr("y", -20)
    .attr("x", 10)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Location Y");

svg.selectAll(".domain")
    .style("display", "none");

svg.append("g")
    .attr("class", "brush")
    .call(brush);

// draw legend
var legend = svg.selectAll(".legend")
    .data(color.domain())
  .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

// draw legend colored rectangles
legend.append("rect")
    .attr("x", width + 80)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

// draw legend text
legend.append("text")
    .attr("x", width + 75)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d;});

function brushended() {
  var s = d3.event.selection;
  if (!s) {
    if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
    x.domain(x0);
    y.domain(y0);
  } else {
    x.domain([s[0][0], s[1][0]].map(x.invert, x));
    y.domain([s[1][1], s[0][1]].map(y.invert, y));
    svg.select(".brush").call(brush.move, null);
  }
  zoom();
}

function idled() {
  idleTimeout = null;
}

function zoom() {
  var t = svg.transition().duration(750);
  svg.select(".axis--x").transition(t).call(xAxis);
  svg.select(".axis--y").transition(t).call(yAxis);
  svg.selectAll("circle").transition(t)
      .attr("cx", function(d) { return x(xMap(d)) })
      .attr("cy", function(d) { return y(yMap(d)) });
}
})