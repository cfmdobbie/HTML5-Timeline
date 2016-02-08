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

// Update the timeline wrt the supplied data
function updateTimeline(data) {
  // Get reference to the <svg> element
  var svg = document.getElementById('svgOutput');
  
  // Clear previous SVG data
  removeChildren(svg);
  
  // Generate base timeline
  var line = document.createElementNS('http://www.w3.org/2000/svg','line');
  line.setAttribute('x1','50');
  line.setAttribute('y1','100');
  line.setAttribute('x2','350');
  line.setAttribute('y2','100');
  line.setAttribute('stroke','black');
  line.setAttribute('stroke-width','4');
  svg.appendChild(line);
}
