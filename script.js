// Clear the current SVG data
function clearTimeline() {
  var svg = document.getElementById('svgOutput');
  removeChildren(svg);
}

// Update the SVG diagram with a new timeline based on the passed data
function createTimeline(data) {
  var svg = document.getElementById('svgOutput');
  
  // Basic layout parameters
  var xStart = 100;
  var xEnd = 500;
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
  
  // Cap text
  if(typeof(data.noStartLabel) == "undefined" || !data.noStartLabel) {
    svg.appendChild(makeDateText(xStart, y + 20, data.textColor, data.start));
  }
  if(typeof(data.noEndLabel) == "undefined" || !data.noEndLabel) {
    svg.appendChild(makeDateText(xEnd, y + 20, data.textColor, data.end));
  }
  // Event text
  for (var i = 0 ; i < numberOfEvents ; i++) {
    svg.appendChild(makeNameText(data.events[i].x, y - 10, data.textColor, data.events[i].name));
    svg.appendChild(makeDateText(data.events[i].x, y + 20, data.textColor, data.events[i].date));
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

// Utility function to generate an SVG <line>
function makeLine(x1, y1, x2, y2, color, lineWidth) {
  var e = document.createElementNS('http://www.w3.org/2000/svg','line');
  e.setAttribute('x1', x1.toFixed(2));
  e.setAttribute('y1', y1.toFixed(2));
  e.setAttribute('x2', x2.toFixed(2));
  e.setAttribute('y2', y2.toFixed(2));
  e.setAttribute('stroke', color);
  e.setAttribute('stroke-width', lineWidth);
  return e;
}

function makeDateText(x, y, color, text) {
  var e = makeText(x, y, color, text);
  e.setAttribute('transform', 'rotate(-45, ' + x.toFixed(2) + ', ' + y.toFixed(2) + ')');
  e.setAttribute('text-anchor', 'end');
  return e;
}

function makeNameText(x, y, color, text) {
  var e = makeText(x, y, color, text);
  e.setAttribute('transform', 'rotate(-45, ' + x.toFixed(2) + ', ' + y.toFixed(2) + ')');
  return e;
}

// Utility function to generate an SVG <text>
function makeText(x, y, color, text) {
  var e = document.createElementNS('http://www.w3.org/2000/svg','text');
  e.setAttribute('x', x.toFixed(2));
  e.setAttribute('y', y.toFixed(2));
  e.setAttribute('fill', color);
  e.setAttribute('font-size', 14);
  e.setAttribute('font-family', 'arial');
  e.textContent = text;
  return e;
}

// Update the SVG source display
function updateSvgSourceDisplay() {
  var svgSource = escapeHtml(document.getElementById('svgOutput').outerHTML);
  document.getElementById('svgSource').innerHTML = svgSource;
}

// Update the timeline wrt the supplied data
function updateTimeline(data) {
  clearTimeline();
  createTimeline(data);
}

