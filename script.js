function generate() {
  var jsonSource = document.getElementById('jsonSource').value;
  var obj = JSON.parse(jsonSource);
  
  // Clear SVG data
  document.getElementById('svgOutput').innerHTML = '';
  
  var svg = '';
  svg += '<line x1="50" y1="100" x2="350" y2="100" stroke="black" stroke-width="2"/>';
  
  // Update SVG data
  document.getElementById('svgOutput').innerHTML = svg;
}

