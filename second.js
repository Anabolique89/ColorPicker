/* IMPORTANT
Not my code down below - just reading through it

var colorWheel = new ColorWheel({
  container: document.getElementById("kuler-d3-colorwheel"),
  initMode: ColorWheel.modes.COMPLEMENTARY,
  initRoot: "lightblue"
});
colorWheel.bindData(2);
colorWheel.setMode(ColorWheel.modes.CUSTOM);

var colors = [],
  contrastRadius = 10,
  contrastBreakpoint = 2.92,
  contrastTotal = 10,
  contrastColors = [],
  contrastRatios = [],
  backgroundColor,
  backgroundLuminance;

function getSelectedColors() {
  var colors = [];

  colorWheel.getVisibleMarkers().each(function(d, i) {
    colors[i] = d.color;
  });

  return colors;
}

function getRgbValues(total, h, s) {
  var rgbValues = [];

  for (var i = 0; i <= total; i++) {
    var v = (i * 1) / total;
    rgbValues.push({
      x: v,
      hex: tinycolor({ h: h, s: s, v: v }).toHexString()
    });
  }

  return rgbValues;
}

function getLuminance(hexString) {
  var rgbColor = tinycolor(hexString).toRgb(),
    rgb = [rgbColor.r, rgbColor.g, rgbColor.b],
    item;


  for (var i = 0; i < 3; i++) {
    item = rgb[i];
    item /= 255;
    item =
      item <= 0.03928 ? item / 12.92 : Math.pow((item + 0.055) / 1.055, 2.4);
    rgb[i] = item;
  }

  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function getContrastRatio(lum1, lum2) {
  // console.log(lum1, lum2);
  // This does not factor in alpha.
  lum1 += 0.05;
  lum2 += 0.05;

  return Math.max(lum1 / lum2, lum2 / lum1);
}

var chartLine, chartSvg, chartX, chartY, chartLineColor;

function setChartBackground() {
  d3.select("#contrast-ratio-chart").style({
    background: backgroundColor
  });

  var backgroundHsv = Object.assign({}, tinycolor(backgroundColor).toHsv());

  backgroundHsv.s = 0.1;
  if (tinycolor(backgroundColor).getBrightness() < 80) {
    backgroundHsv.v += 0.5;
  } else {
    backgroundHsv.v -= 0.5;
  }

  chartLineColor = tinycolor(backgroundHsv).toHexString();

  d3.select("#contrast-ratio-chart")
    .selectAll("path")
    .style({ stroke: chartLineColor });
  d3.select("#contrast-ratio-chart")
    .selectAll("line")
    .style({ stroke: chartLineColor });
  chartSvg.selectAll("text").style({ fill: chartLineColor });
}

function setupChart() {
  var data = [];

  var ratioChart = d3.select("#contrast-ratio-chart"),
    margin = { top: 20, right: 50, bottom: 30, left: 50 },
    width =
      document.getElementById("contrast-ratio-chart").getBoundingClientRect()
        .width -
      margin.left -
      margin.right,
    height = 300;

  (chartX = d3.scale.linear().range([0, width])),
    (chartY = d3.scale.linear().range([height, 0]));

  chartLine = d3.svg
    .line()
    .x(function(d) {
      return chartX(d.x);
    })
    .y(function(d) {
      return chartY(d.y);
    });

  // Adds the svg canvas
  chartSvg = ratioChart
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Define the axes
  var xAxis = d3.svg
    .axis()
    .scale(chartX)
    .orient("bottom")
    .ticks(contrastTotal);

  var yAxis = d3.svg
    .axis()
    .scale(chartY)
    .orient("left")
    .ticks(10);

  // Scale the range of the data
  chartX.domain([0, 1]); // d3.max(data, function(d) { return d.x; })
  chartY.domain([0, 21]); // d3.max(data, function(d) { return d.y; })

  // Add the X Axis
  chartSvg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the Y Axis
  chartSvg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis);

  // Add the Contrast Breakpoint
  chartSvg
    .append("path")
    .attr("class", "line breakpoint")
    .attr(
      "d",
      chartLine([
        { x: 0, y: contrastBreakpoint },
        { x: 1, y: contrastBreakpoint }
      ])
    )
    .style({ stroke: chartLineColor, "stroke-width": 2 * contrastRadius });
}

function setChartLine() {
  chartSvg.selectAll(".valueline").remove();
  chartSvg.selectAll("circle").remove();

  // ----------------------
  var data = contrastColors.map(function(color, index) {
    return { x: color.x, y: contrastRatios[index] };
  });

  // Add the line path.
  chartSvg
    .append("path")
    .attr("class", "valueline")
    .attr("d", chartLine(data))
    .style({ stroke: chartLineColor });

  // Add the scatterplot
  chartSvg
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", contrastRadius)
    .attr("cx", function(d) {
      return chartX(d.x);
    })
    .attr("cy", function(d) {
      return chartY(d.y);
    })
    .attr("fill", function(d, i) {
      return contrastColors[i].hex;
    });
}

function updateChart() {
  colors = getSelectedColors();
  contrastColors = getRgbValues(contrastTotal, colors[1].h, colors[1].s);

  backgroundColor = tinycolor({
    h: colors[0].h,
    s: colors[0].s,
    v: colors[0].v
  }).toHexString();
  backgroundLuminance = getLuminance(backgroundColor);

  contrastRatios = contrastColors.map(function(color) {
    return getContrastRatio(backgroundLuminance, getLuminance(color.hex));
  });

  setChartBackground();
  setChartLine();
}

setupChart();
updateChart();

// event
colorWheel.dispatch.on("markersUpdated.custom", function() {
  setTimeout(function() {
    updateChart();
  }, 1000);
});
*/
