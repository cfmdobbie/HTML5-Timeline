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

