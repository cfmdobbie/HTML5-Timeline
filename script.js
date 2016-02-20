// Clear the current SVG data
function clearTimeline() {
  var svg = document.getElementById('svgOutput');
  removeChildren(svg);
  document.getElementById('svgSource').innerHTML = "No timeline generated!";
}

// Creates a value normalizer to use for the specified data range.
// Returned normalizer converts passed data into values between 0.0 to 1.0.
function createNormalizer(valueType, start, end) {
  // Date normalizer - treats values as valid Javascript Date strings
  function DateNormalizer(start, end) {
    // Low value
    this.startValue = Date.parse(start);
    // Range of values
    this.range = Date.parse(end) - this.startValue;
    // Function to normalize the passed date value
    this.normalize = function(raw) {
      // Date value
      var value = Date.parse(raw);
      // Normalized wrt date range
      var norm = (value - this.startValue) / this.range
      return norm;
    };
  };
  
  // Number normalizer
  function NumberNormalizer(start, end) {
    // Start and range
    this.startValue = parseFloat(start);
    this.range = parseFloat(end) - this.startValue;
    // Function to normalize the passed numeric value
    this.normalize = function(raw) {
      // Numeric value
      var value = parseFloat(raw);
      // Normalized wrt date range
      var norm = (value - this.startValue) / this.range
      return norm;
    };
  }
  
  // BC/AD year normalizer
  function BcadNormalizer(start, end) {
    // Function to convert a string containing a BC or AD year into an integer AD year
    function bcadToYear(text) {
      var regex = /(\d+) ?(AD|BC)?/;
      var result = text.match(regex);
      var year = result[1];
      if(result[2] == 'BC') {
        year = 1 - year;
      }
      return year;
    }
    // Start and range
    this.startValue = bcadToYear(start);
    this.range = bcadToYear(end) - this.startValue;
    // Function to normalize the passed BC/AD year
    this.normalize = function(raw) {
      // Numeric value
      var value = bcadToYear(raw);
      // Normalized wrt date range
      var norm = (value - this.startValue) / this.range
      return norm;
    };
  }
  
  switch(valueType) {
    case "number":
      // Explicitly a number
      return new NumberNormalizer(start, end);
    case "bcad":
      // Explicitly a year of the form "NNNN", "NNNN BC" or "NNNN AD"
      return new BcadNormalizer(start, end);
    case "date":
    default:
      // Either explicitly or implicitly a date
      return new DateNormalizer(start, end);
  }
  
  return new DateNormalizer(start, end);
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
  var TIMELINE_MIN_X = MARGIN;
  var TIMELINE_MAX_X = DIAGRAM_WIDTH - MARGIN;
  var TIMELINE_WIDTH = TIMELINE_MAX_X - TIMELINE_MIN_X;
  var TIMELINE_Y = DIAGRAM_HEIGHT / 2;
  
  // Acquire a data normalizer
  var normalizer = createNormalizer(data.valueType, data.start, data.end);
  
  // Calculate event times
  var numberOfEvents = data.events.length;
  for (var i = 0 ; i < numberOfEvents ; i++) {
    // Normalized event value
    var norm = normalizer.normalize(data.events[i].value);
    // Calculated x-coordinate
    var x = TIMELINE_MIN_X + (norm * TIMELINE_WIDTH);
    // Stash x-coordinate in event
    data.events[i].x = x;
  }
  
  // Draw base timeline
  svg.appendChild(makeLine(TIMELINE_MIN_X, TIMELINE_Y, TIMELINE_MAX_X, TIMELINE_Y, data.lineColor, 4));
  
  // Draw caps
  svg.appendChild(makeLine(TIMELINE_MIN_X, TIMELINE_Y - 10, TIMELINE_MIN_X, TIMELINE_Y + 10, data.lineColor, 2));
  svg.appendChild(makeLine(TIMELINE_MAX_X, TIMELINE_Y - 10, TIMELINE_MAX_X, TIMELINE_Y + 10, data.lineColor, 2));
  
  // Draw event ticks
  for (var i = 0 ; i < numberOfEvents ; i++) {
    svg.appendChild(makeLine(data.events[i].x, TIMELINE_Y - 10, data.events[i].x, TIMELINE_Y + 10, data.lineColor, 1));
  }
  
  // Cap text
  if(typeof(data.noStartLabel) == "undefined" || !data.noStartLabel) {
    svg.appendChild(makeDateText(TIMELINE_MIN_X, TIMELINE_Y + 20, data.textColor, data.start));
  }
  if(typeof(data.noEndLabel) == "undefined" || !data.noEndLabel) {
    svg.appendChild(makeDateText(TIMELINE_MAX_X, TIMELINE_Y + 20, data.textColor, data.end));
  }
  // Event text
  for (var i = 0 ; i < numberOfEvents ; i++) {
    var eventColor = data.events[i].color ? data.events[i].color : data.textColor;
    svg.appendChild(makeNameText(data.events[i].x, TIMELINE_Y - 10, eventColor, data.events[i].name));
    svg.appendChild(makeDateText(data.events[i].x, TIMELINE_Y + 20, eventColor, data.events[i].value));
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

// Load some example JSON data
function showExample(example) {
  function getExample(example) {
    if(example == 'jurassic') {
      return `{
  "__comment__": "Example demonstrating full date display and cap label suppression",
  "lineColor": "black",
  "textColor": "#bb0000",
  "start": "9 June 1993",
  "end": "12 June 2015",
  "noStartLabel": true,
  "noEndLabel": true,
  "events": [
    {"value": "9 June 1993", "name": "Jurassic Park"},
    {"value": "23 May 1997", "name": "The Lost World"},
    {"value": "18 July 2001", "name": "Jurassic Park III"},
    {"value": "12 June 2015", "name": "Jurassic World"}
  ]
}`;
    } else if(example == 'escape') {
      return `{
  "__comment__": "Example demonstrating SVG color names, floating-point numbers and number truncation",
  "lineColor": "black",
  "textColor": "black",
  "valueType": "number",
  "start": "0 km/s",
  "end": "15 km/s",
  "events": [
    {"value": "4.25 km/s", "name": "Mercury", "color": "DimGrey"},
    {"value": "10.36 km/s", "name": "Venus", "color": "DarkGoldenRod"},
    {"value": "11.186 km/s", "name": "Earth", "color": "Green"},
    {"value": "2.38 km/s", "name": "Moon", "color": "Grey"},
    {"value": "5.027 km/s", "name": "Mars", "color": "FireBrick"}
  ]
}`;
    } else if(example == 'presidents') {
      return `{
  "__comment__": "Example demonstrating handling years as numbers, event colors and cap date suppression",
  "lineColor": "black",
  "textColor": "grey",
  "valueType": "number",
  "start": "1953",
  "end": "2016",
  "noStartLabel": true,
  "events": [
    {"value": "1953", "name": "Dwight D. Eisenhower", "color": "red"},
    {"value": "1961", "name": "John F. Kennedy", "color": "blue"},
    {"value": "1963", "name": "Lyndon B. Johnson", "color": "blue"},
    {"value": "1969", "name": "Richard Nixon", "color": "red"},
    {"value": "1974", "name": "Gerald Ford", "color": "red"},
    {"value": "1977", "name": "Jimmy Carter", "color": "blue"},
    {"value": "1981", "name": "Ronald Reagan", "color": "red"},
    {"value": "1989", "name": "George H. W. Bush", "color": "red"},
    {"value": "1993", "name": "Bill Clinton", "color": "blue"},
    {"value": "2001", "name": "George W. Bush", "color": "red"},
    {"value": "2009", "name": "Barack Obama", "color": "blue"}
  ]
}`;
    } else if(example == 'life') {
      return `{
  "__comment__": "Example demonstrating reversed timeline and number truncation",
  "lineColor": "black",
  "textColor": "black",
  "valueType": "number",
  "start": "13820 mya",
  "end": "0",
  "noStartLabel": true,
  "noEndLabel": true,
  "events": [
    {"value": "13820 mya", "name": "Big Bang"},
    {"value": "4540 mya", "name": "Earth Forms"},
    {"value": "3500 mya", "name": "Earliest Life"},
    {"value": "225 mya", "name": "Earliest Mammals"}
  ]
}`;
    } else if(example == 'pompeii') {
      return `{
  "__comment__": "Example demonstrating BC/AD years",
  "lineColor": "Maroon",
  "textColor": "Black",
  "valueType": "bcad",
  "start": "650 BC",
  "end": "2016 AD",
  "noStartLabel": true,
  "noEndLabel": true,
  "events": [
    {"value": "650 BC", "name": "Founded"},
    {"value": "80 BC", "name": "Surrender to Rome"},
    {"value": "79 AD", "name": "Buried by Ash"},
    {"value": "1599", "name": "Rediscovery"},
    {"value": "1749", "name": " Start of Excavation"},
    {"value": "1997", "name": "World Heritage site"}
  ]
}`;
    } else {
      return "";
    }
  }
  
  document.getElementById('jsonSource').value = getExample(example);
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

