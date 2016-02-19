// Clear the current SVG data
function clearTimeline() {
  var svg = document.getElementById('svgOutput');
  removeChildren(svg);
  document.getElementById('svgSource').innerHTML = "No timeline generated!";
}

// Update the SVG diagram with a new timeline based on the passed data
function createTimeline(data) {
  var DIAGRAM_WIDTH = 600;
  var DIAGRAM_HEIGHT = 200;
  var MARGIN = 100;
  
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute('width', DIAGRAM_WIDTH);
  svg.setAttribute('height', DIAGRAM_HEIGHT);
  document.getElementById('svgOutput').appendChild(svg);
  
  // Basic layout parameters
  var xStart = MARGIN;
  var xEnd = DIAGRAM_WIDTH - MARGIN;
  var xRange = xEnd - xStart;
  var y = DIAGRAM_HEIGHT / 2;
  
  // Determine time range
  var startTime = Date.parse(data.start);
  var endTime = Date.parse(data.end);
  var timeRange = endTime - startTime;
  
  // Calculate event times
  var numberOfEvents = data.events.length;
  for (var i = 0 ; i < numberOfEvents ; i++) {
    var time = Date.parse(data.events[i].date);
    data.events[i].x = ((time - startTime) / timeRange) * xRange + xStart;
  }
  
  // Draw base timeline
  svg.appendChild(makeLine(xStart, y, xEnd, y, data.lineColor, 4));
  
  // Draw caps
  svg.appendChild(makeLine(xStart, y - 10, xStart, y + 10, data.lineColor, 2));
  svg.appendChild(makeLine(xEnd, y - 10, xEnd, y + 10, data.lineColor, 2));
  
  // Draw event ticks
  for (var i = 0 ; i < numberOfEvents ; i++) {
    svg.appendChild(makeLine(data.events[i].x, y - 10, data.events[i].x, y + 10, data.lineColor, 1));
  }
  
  // Cap text
  if(typeof(data.noStartLabel) == "undefined" || !data.noStartLabel) {
    svg.appendChild(makeDateText(xStart, y + 20, data.textColor, data.start));
  }
  if(typeof(data.noEndLabel) == "undefined" || !data.noEndLabel) {
    svg.appendChild(makeDateText(xEnd, y + 20, data.textColor, data.end));
  }
  // Event text
  for (var i = 0 ; i < numberOfEvents ; i++) {
    var eventColor = data.events[i].color ? data.events[i].color : data.textColor;
    svg.appendChild(makeNameText(data.events[i].x, y - 10, eventColor, data.events[i].name));
    svg.appendChild(makeDateText(data.events[i].x, y + 20, eventColor, data.events[i].date));
  }
}

// Entry point, called by button
function generate() {
  var data = loadTimelineData();
  updateTimeline(data);
  updateSvgSourceDisplay();
}

// Load timeline data as an object
function loadTimelineData() {
  var jsonSource = document.getElementById('jsonSource').value;
  var obj = JSON.parse(jsonSource);
  return obj;
}

// Update the SVG source display
function updateSvgSourceDisplay() {
  var svgSource = escapeHtml(document.getElementById('svgOutput').innerHTML);
  document.getElementById('svgSource').innerHTML = svgSource;
}

// Update the timeline wrt the supplied data
function updateTimeline(data) {
  clearTimeline();
  createTimeline(data);
}

