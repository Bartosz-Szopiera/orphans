var wrapper1 = document.getElementsByClassName('wrapper1')[0];
var pageHeader = document.getElementsByClassName('header wrapper')[0];
var logo = document.getElementsByClassName('logo')[0];
var wrapper2 = document.getElementsByClassName('wrapper2')[0];
var bilboard = document.getElementById('bilboard');
var shadow = document.getElementById('shadow');
var tel = document.getElementById('telephone');
var nav1 = document.getElementById('navigation1');
var nav2 = document.getElementById('navigation2');
var circles = document.getElementsByClassName('service');
var icons = document.getElementsByClassName('service_link');
var text = document.getElementsByClassName('service_link');
var serviceHeaders = document.getElementsByClassName('service_header');
var down = []
wrapper1.style.position = getComputedStyle(wrapper1).position;
var year = document.getElementsByClassName('year')[0];
var done;
var canvasWrapper = document.getElementsByClassName('canvasWrapper');
var canvas = document.getElementsByClassName('ringChart');
var ctx ;
var chartDone = [] ;
var chart = document.getElementsByClassName('chart canvas');
var em = 16;

// ============================================
function scrollState() {
  return document.body.scrollTop;
}
// ============================================
function stringRemove(element, string) {
  var newString = '';
  for (var i = 0; i < element.classList.length; i++){
    if (element.classList[i] != string){
      newString += ' ' + element.classList[i];
    }
  }
  return newString;
}
// ===============================================
function normaliseAr(a){
  // Normalize set of data
  //  Bring values to decimal fractions
  var sum = sumAr(a);
  if (sum>1) {
    for (var i = 0; i < a.length; i++) {
      a[i] = a[i]/sum;
    }
  }
}
// ================================================
function sumAr(a,b){
  // Sum elements of array 'a' to position 'b' ('b' included)
  var sum = 0;
  b = b >= 0 ? b+1 : a.length;
  for(var i = 0; i < b; i++){
    sum += a[i];
  }
  return sum;
}
// =======TOP MENU TRANSITIONS=================
function headerTransformation(){
  // Pseudo scroll is used as a workaround to not
  // use ScrollState() as Firefox semingly blocks
  // this function when it attempted to use for
  // handling scroll event

  // Height of the header
  var headerHeight = pageHeader.offsetHeight;
  // Ratio of height of small header to big header
  var x = 0.36;
  // Scroll breaking point
  var brPoint = (1-x)*headerHeight;
  // Default distance of logo to header bottom
  var logoBottom;
  if (window.innerWidth < 53*em ){
    logoBottom = 10; //px
    console.log(logoBottom);
  }
  else {
    logoBottom = 25; //px
  }

  // Check scroll state live
  var wra2TopDist = wrapper2.getBoundingClientRect().top;
  // Get value from 0 to (1-x)*headerHeight
  var pseudoScrollState = -((wra2TopDist>0 ? wra2TopDist : 0) - headerHeight);
  // Shrinkage factor in relation to pseudoScrollState
  var shrF = (headerHeight - pseudoScrollState)/headerHeight

  if (pseudoScrollState<brPoint) {
    wrapper1.style.position = 'fixed';
    wrapper1.style.top = -pseudoScrollState + 'px';
    shadow.style.position = 'relative';
    shadow.style.top = '0px';
    // shring logo font
    logo.style.fontSize = Math.max(shrF, 0.5) +'em';
    // change logo position
    logo.style.bottom = (logoBottom * shrF)+'px';
    bilboard.style.position = 'absolute';
    bilboard.style.top = '0px';
  }
  if (pseudoScrollState>=brPoint) {
    wrapper1.style.position = 'fixed';
    wrapper1.style.top = -brPoint + 'px';
    // position of div with box-shadow effect
    shadow.style.position = 'fixed';
    shadow.style.top = x*headerHeight + 'px';
    logo.style.fontSize = Math.max(x, 0.5) +'em';
    logo.style.bottom = (logoBottom * x)+'px';
    bilboard.style.position = 'fixed';
    bilboard.style.top = x*headerHeight + 'px';
  }
}

//=======BIG SERVICE ICONS=====================
function serviceIconAnimation() {
  // Goals:
  // 1) no animation or transition when the page
  // loads with cirles in active view and above
  // the animation start-point
  // 2) no flicker of the icon on page load -
  // and page can be loaded with circle in
  // active view in 2 states: when it should
  // display an icon and when it shouldn't.
  // In some of them the default setting needs
  // to be changed an transition effect will
  // cause a flicker.
  // 3) Effects trigger independently for each
  // icon, which will support RWB - for column
  // layout - each icon will animate when the
  // user will see it, not sooner

  var screen_height = document.documentElement.clientHeight;
  var start_point = 1.1*screen_height;
  for (var i = 0; i < circles.length; i++) {
    position = serviceHeaders[i].getBoundingClientRect().top;
    if (position < start_point && (down[i] != 0) && (down[i] != 1)){
      down[i] = 0;
    }
    else if (position > start_point && (down[i] != 0) && (down[i] != 1)){
      icons[i].style.transition = 'box-shadow 1s, opacity 1s -1s';
      down[i] = 0;
      setTimeout(function(i){
        icons[i].style.transition = 'box-shadow 1s, opacity 1s 0s';
      },0, i)
    }
    else if (position < start_point && (down[i] != 0)){
      circles[i].className += ' pulse';
      down[i] = 0;
      icons[i].style.opacity = 1;
      circles[i].children[2].style.opacity = 1;
    }
    else if (position > start_point && (down[i] != 1)) {
      circles[i].className = stringRemove(circles[i], 'pulse');
      icons[i].style.opacity = 0;
      circles[i].children[2].style.opacity = 0;
      down[i] = 1;
    }
  }
  return down;
}
//======YEAR-SLOT-MACHINE======================
function yearAnimation() {
  // var screen_height = document.documentElement.clientHeight;
  var screen_height = window.innerHeight;
  var start_point = 0.70*screen_height;
  var position = year.getBoundingClientRect().top;
    if (position < start_point && (done != 1)){
      year.classList.add('founded');
      done = 1;
    }
    else if (position > start_point && (done != 0)){
      year.classList.remove('founded');
      done = 0;
    }
  return done;
}
//======CHART DATA=============================
var data = [
  [70,25,5],
  [95,4,1],
  [20,35,45],
  [50,25,23,2],
  [4,9,6,7],
  [14,3,3,2],
];
for (var i = 0; i < data.length; i++) {
  normaliseAr(data[i]);
}
var labels = [
  [
    '70% print design',
    '25% web and app design',
    '5% ad design'
  ],
  [
    '95% sustainable materials',
    '4% recycled materials',
    '1% other materials'
  ],
  [
    '20% planning',
    '35% designing & content',
    '45% development'
  ],
  [
    '50% herefordshire',
    '25% london',
    '23% rest of the uk',
    '2% rest of world'
  ],
  [
    '4 arty types',
    '9 with inky fingers',
    '6 code monkeys',
    '7 turning cogs'
  ],
  [
    '14 behind the wheel',
    '3 use pedal power',
    '3 come on foot',
    '2 catch the train'
  ]
];
var orbitShift = [
  [0,0,1],
  [0,1,0],
  [0,0,0],
  [0,0,0,1],
  [0,0,0,0],
  [0,0,1,0],
];
//=======CHART LABEL BUILDER====================
function chartLabel(){
  var string;
  var letter;
  var label;
  var width;
  var radius;
  var orbit;
  var angleMid;
  var angleSpan;
  var sumMid;
  var letterWidth;
  var rotation;
  var text;
  var labelHeight;
  var top;
  var angleLetterEnd;
  var divRot;
  var labelArc;
  var letterRot;

  width = canvas[0].width;
  labelArc = 0;
  rotation = 0;
  labelHeight = parseInt(getComputedStyle(chart[0]).fontSize);

  // Iterate through data sets (charts)
  for (var i = 0; i < data.length; i++) {
    // Iterate through values
    for (var j = 0; j < data[i].length; j++) {
      // Sum of chart values to the middle of segment j
      sumMid = (sumAr(data[i],j) - data[i][j] * 0.5);
      //Angle in degrees and aligned with chart
      angleMid = sumMid * 360;

      var label = document.createElement('div');
      label.classList.add('chartLabel_'+i);
      label.classList.add('hidden');
      chart[i].insertBefore(label, canvasWrapper[i]);
      // Adjust label radius to oavoid overlap
      radius = width * 0.5 + orbitShift[i][j]*labelHeight*2;
      orbit = 2 * radius * Math.PI;
      // Loop through letters
      for (var k = 0; k < labels[i][j].length; k++) {
        var letter = document.createElement('span');
        string = labels[i][j].charAt(k);
        if (string == ' ') {string = '\xa0';}
        var text = document.createTextNode(string);
        letter.appendChild(text);
        label.appendChild(letter);
        letter.style.letterSpacing = '0.1em';
        letterWidth = letter.offsetWidth;
        angleSpan = letterWidth/orbit * 360;
        angleLetterEnd = k==0 ? angleSpan*0.5:(angleLetterEnd  + angleSpan);
        letterRot = angleLetterEnd - angleSpan*0.5;
        // Letter rotation
        letter.style.position = 'absolute';
        letter.style.transform = 'rotate(' + letterRot + 'deg)';
        letter.style.transformOrigin = 'center ' + radius + 'px';
        letter.style.top = -radius + 'px';
        letter.style.left = -letterWidth*0.5 + 'px';
      }
      // Whole angle covered by the label
      labelArc = letterRot;
      divRot = angleMid - 0.5*labelArc;
      label.style.transform = 'rotate(' + divRot + 'deg)';
      labelArc = 0;
    }
  }
}
//=======ONSCROLL HANDLER=====================
// Direct labels, and chart animations behaviour
function chartDrawingControl(){
  var delay = -600;
  var sum;
  var ctx;
  var stat;
  var label;
  var showLabel = [];
  var screen_height = window.innerHeight;
  var start_point3 = 0.80*screen_height;
  for (var i = 0; i < canvas.length; i++) {
    var position = canvas[i].getBoundingClientRect().top;
    if (position < start_point3 && chartDone[i] != 1) {
      var newCanvas = document.createElement('canvas');
      newCanvas.setAttribute('width', 200);
      newCanvas.setAttribute('height', 200);
      canvasWrapper[i].replaceChild(newCanvas, canvas[i]);
      newCanvas.classList.add('ringChart');
      ctx = canvas[i].getContext('2d');
      stat = data[i];
      delay = delay + 600;
      ringChart(canvas[i],ctx,stat,delay);
      chartDone[i] = 1;
      showLabel[i] = 1;
    }
    else if (position > start_point3 && chartDone[i] != 0) {
      chartDone[i] = 0;
      canvas[i].style.removeProperty('transition-delay');
      canvas[i].classList.add('hidden');
      ctx = canvas[i].getContext('2d');
      setTimeout(function(ctx,canvas){
        ctx.clearRect(0,0,canvas.width,canvas.height);
      },400,ctx,canvas[i]);
      //Hide labels
      label = document.getElementsByClassName('chartLabel_'+i);
      for (var j = 0; j < label.length; j++) {
        label[j].style.transitionDelay = '0.0s';
        label[j].classList.add('hidden');
      }
    }
    else {
      showLabel[i] = 0;
    }
  }
  if ((sum = sumAr(showLabel)) != 0) {
    var sumLabel = sum;
    var animTime = 0.7;
    var chartDelay;
    for (var i = 0; i < showLabel.length; i++) {
      if (showLabel[i] == 1) {
        label = document.getElementsByClassName('chartLabel_'+i);
        chartDelay = delay/1000 + animTime + i*0.2;
        for (var j = 0; j < label.length; j++) {
          transDelay = (chartDelay + 0.6*j) +'s';
          label[j].style.transitionDelay = transDelay;
          label[j].classList.remove('hidden');
        }
      }
    }
  }
}

function globalHandler(){
  headerTransformation();
  serviceIconAnimation();
  yearAnimation();
  chartDrawingControl()
}
