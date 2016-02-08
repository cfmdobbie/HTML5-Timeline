// Entry point, called by button
function generate() {
  var data = loadTimelineData();
  updateTimeline(data);
}

// Remove all children of the specified element
function removeChildren(node) {
  while(node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

// Load timeline data as an object
function loadTimelineData() {
  var jsonSource = document.getElementById('jsonSource').value;
  var obj = JSON.parse(jsonSource);
  return obj;
}

// Clear the current SVG data
function clearTimeline() {
  var svg = document.getElementById('svgOutput');
  removeChildren(svg);
}

// Update the timeline wrt the supplied data
function updateTimeline(data) {
  clearTimeline();
  generateTimeline(data);
}

function generateTimeline(data) {
  var svg = document.getElementById('svgOutput');
  
  // Basic layout parameters
  var xStart = 50;
  var xEnd = 350;
  var y = 100;
  
  // Generate base timeline
  var line = document.createElementNS('http://www.w3.org/2000/svg','line');
  line.setAttribute('x1', xStart);
  line.setAttribute('y1', y);
  line.setAttribute('x2', xEnd);
  line.setAttribute('y2', y);
  line.setAttribute('stroke', data.lineColor);
  line.setAttribute('stroke-width','2');
  svg.appendChild(line);
}
