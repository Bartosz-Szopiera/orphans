function ringChart(canvas,ctx,stat,delay){
// =================INFO=======================
// Draw a ring chart; WIP.
// Necessary arguments:
//  canvas - identifier for <canvas> element
//  ctx - identifier for rendering context
//  stat - array with values for chart segments
//        (normalized to decimal fractions)
//  delay - delay for the animation
// Comming features:
//    test of provided arguments
//    error handling in case of incorrect input
//    Integrated label-building function
 //===============Variables=====================
if (typeof(ctx) == 'undefined') {
  console.log('No \'ctx\' rendering context found.')
  var ctx = document.getElementById('canvas').getContext('2d');
  if (typeof(ctx) == 'undefined') {
    console.log('No #canvas element found.');
  }
  else {
    console.log('Rendering contex \'ctx\' on #canvas element created.');
  }
}
var centerX = canvas.width *0.5; // chart position x
var centerY = canvas.height *0.5; // chart position y
var r = 60; // ring's radius
var chartWidth = 40; // ring width
var chartGap = 2; // gap between ring segments
var deg = Math.PI/180; // 1 degree in radians
var start = 270; // position '0' degree
// var delay = 0; // total delay for each frame
var dt ; // time interval between frames
var dx = []; // increment of angle in current frame
var arcStart ; // start of ring segment
var arcEnd ; // end of ring segment
var records ; // total number of presented values
var frames ; // total number of frames shown
// var stat = []; // values presented
var statStyle = []; // color for value segment
// ===============================================

// Example statistics
// stat[0] = 0.40;
// stat[1] = 0.30;
// stat[2] = 0.20;
// stat[3] = 0.10;
records = stat.length;

// Colors
statStyle[0] = 'rgb(154, 21, 78)';
statStyle[1] = 'rgb(103, 140, 195)';
statStyle[2] = 'rgb(51, 79, 142)';
statStyle[3] = 'rgb(164, 182, 223)';

// Animation parameters
fps = 60;
animTime = 0.7; //s
frames = animTime*fps;
dt = animTime*1000/frames;

// Base angular increment for each segment
// Segments start and end growing together
// Latter segments have bigger incerement
for (var j = 0; j < records; j ++){
  dx[j] = 360 * sumAr(stat,j) / frames;
}

// Initial path for the gap-line
// Not supported in IE11
// var path = new Path2D();
// path.moveTo(0, - r + chartWidth/2);
// path.lineTo(0, - r - chartWidth/2);

// Loop through frames
for (var i = 0; i < frames; i ++){
  // Loop through segments
  for (var j = 0; j < records; j ++){
    // bump-up angle increment
    dx[j] = (i+1)*dx[j]/ (i < 2 ? 1 : i);
  }
  // Increase delay for each frame
  delay = delay + dt ;
  // Draw a frame
  draw();
}

function draw(){
  // Save current values for setTimeout
  var a = [];
  for (var i = 0; i < dx.length; i++) {
    a[i] = dx[i];
  }
  setTimeout(function(dx){
        ctx.clearRect(0,0,canvas.width, canvas.height);

        // Draw segments
        ctx.lineWidth = chartWidth;
        for (var i = 0; i < records; i++) {
          ctx.beginPath();
          ctx.strokeStyle = statStyle[i];
          arcStart = (start + (i == 0 ? 0 : dx[i-1])) * deg;
          arcEnd = (start + dx[i]) * deg;
          ctx.arc(centerX,centerY,r,arcStart,arcEnd);
          ctx.stroke();
        }

        // Draw gaps between segments
        ctx.lineWidth = chartGap;
        ctx.strokeStyle = 'white';
        ctx.save();
        ctx.translate(centerX,centerY);
        for (var i = 0; i-1 < records; i++) {
          ctx.save();
          ctx.beginPath();
          ctx.rotate((dx[i]) * deg);
          // ctx.stroke(path);
          ctx.moveTo(0, - r + chartWidth/2);
          ctx.lineTo(0, - r - chartWidth/2);
          ctx.stroke();
          ctx.restore();
        }
        ctx.beginPath();
        // ctx.stroke(path);
        ctx.moveTo(0, - r + chartWidth/2);
        ctx.lineTo(0, - r - chartWidth/2);
        ctx.stroke();
        ctx.restore();
  },delay,a);
}
}
