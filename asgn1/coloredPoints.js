// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`;

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

  //Globals
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL(){
// Retrieve <canvas> element
canvas = document.getElementById('webgl');

// Get the rendering context for WebGL
gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
if (!gl) {
  console.log('Failed to get the rendering context for WebGL');
  return;
}

}

function connectVariablesToGLSL(){
    // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if(!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
//globals related to UI elements
let g_selectedColor = [1.0,1.0,1.0,1.0];
let g_selectedSize = 20.0;
let g_selectedType = POINT;
let g_selectedSegment = 10;

function addActionsForHTMLUI(){
    document.getElementById('green').onclick = function (){g_selectedColor = [0.0,1.0,0.0,1.0];};
    document.getElementById('red').onclick = function (){g_selectedColor = [1.0,0.0,0.0,1.0];};
    document.getElementById('clear').onclick = function (){g_shapesList=[]; renderAllShapes()};

    document.getElementById('point').onclick = function (){g_selectedType=POINT};
    document.getElementById('triangle').onclick = function (){g_selectedType=TRIANGLE};
    document.getElementById('circle').onclick = function (){g_selectedType=CIRCLE};

    document.getElementById('redS').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100;});
    document.getElementById('greenS').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100;});
    document.getElementById('blueS').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100;});
    
    document.getElementById('sizeS').addEventListener('mouseup', function() {g_selectedSize = this.value;});
    document.getElementById('circleS').addEventListener('mouseup', function() {g_selectedSegment = this.value;});

    document.getElementById('drawPogo').onclick = function (){drawPogo();};
    document.getElementById('fadePogo').addEventListener('mouseup', function() {alpha = this.value/100; drawPogoTransparent(alpha)});
    document.getElementById('buildPogo').addEventListener('mouseup', function() {step = this.value; buildPogo(step)});

}


function main() {
  setupWebGL();

  connectVariablesToGLSL();
  addActionsForHTMLUI();
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;

    canvas.onmousemove = function (ev) {if(ev.buttons ==1){click(ev)}};
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}


var g_shapesList=[];

function click(ev) {
  let [x,y] = convertCoordinaatesEventToGL(ev);
  let point;
  if(g_selectedType ==POINT){
    point = new Point();
  }
  else if(g_selectedType ==CIRCLE){
    point = new Circle();
  }
  else{
    point = new Triangle();
  }
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size= g_selectedSize;
  point.segments = g_selectedSegment;
  g_shapesList.push(point);
  renderAllShapes();
}


function convertCoordinaatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return([x,y]);
}

function renderAllShapes(){
    // Clear <canvas>
var startTime = performance.now();
gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration)/10, "numdot");

}

function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if(!htmlElm){
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;

}
