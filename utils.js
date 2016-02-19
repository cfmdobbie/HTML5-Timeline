// Make a string HTML-safe
function escapeHtml(unsafe) {
  var safe = unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
  return safe;
}

// Remove all children of the specified element
function removeChildren(node) {
  while(node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

