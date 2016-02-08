// Clear the current SVG data
function clearTimeline() {
  var svg = document.getElementById('svgOutput');
  removeChildren(svg);
}

// Update the SVG diagram with a new timeline based on the passed data
function createTimeline(data) {
  var svg = document.getElementById('svgOutput');
  
  // Basic layout parameters
  var xStart = 50;
  var xEnd = 350;
  var xRange = xEnd - xStart;
  var y = 100;
  
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
}

// Entry point, called by button
function generate() {
  var data = loadTimelineData();
  updateTimeline(data);
}

// Load timeline data as an object
function loadTimelineData() {
  var jsonSource = document.getElementById('jsonSource').value;
  var obj = JSON.parse(jsonSource);
  return obj;
}

// Utility function to generate an SVG <line>
function makeLine(x1, y1, x2, y2, color, lineWidth) {
  var e = document.createElementNS('http://www.w3.org/2000/svg','line');
  e.setAttribute('x1', x1);
  e.setAttribute('y1', y1);
  e.setAttribute('x2', x2);
  e.setAttribute('y2', y2);
  e.setAttribute('stroke', color);
  e.setAttribute('stroke-width', lineWidth);
  return e;
}

// Remove all children of the specified element
function removeChildren(node) {
  while(node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

// Update the timeline wrt the supplied data
function updateTimeline(data) {
  clearTimeline();
  createTimeline(data);
}

