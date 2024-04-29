// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
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
  gl.enable(gl.DEPTH_TEST);


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

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix){
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix= gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix){
    console.log('Failed to get the storage location of u_GlobalRotateMatix');
    return;
  }
  //set an initial value for tis matrix to identify
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}


//globals related to UI elements
let g_globalAngle=20;
let g_globalAngle2=5;
let headAngle= 0;
let armAngle= 30;
let armAngleR = 30;
let bodyAngle = 0;
let fullBodyAngle=0;
let feetAngle = 0;
let speed = 5;
let speed2 = 20;
let footAngleL = 0;
let footAngleR = 0;
let tailAngle= 0;
let g_armAnimation = false;
let g_happyAnimation = false;
let g_runAnimation = false;

let shiftCount = -1;
function resetPose(){
  headAngle = 0; armAngle=30; armAngleR = 30;
          bodyAngle=0, fullBodyAngle=0;
          feetAngle= 0;
          footAngleL = 0;
          footAngleR= 0;
}

function addActionsForHTMLUI(){
    document.getElementById('poseRESET').onclick = function() {
          resetPose();
        };

    document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderScene(); });
    document.getElementById('angleSlideY').addEventListener('mousemove', function() {g_globalAngle2 = this.value; renderScene(); });

    document.getElementById('headSlide').addEventListener('mousemove', function() {headAngle = this.value; renderScene(); });
    document.getElementById('armSlide').addEventListener('mousemove', function() {armAngle = this.value; renderScene(); });
    document.getElementById('armSlideR').addEventListener('mousemove', function() {armAngleR = this.value; renderScene(); });
    //document.getElementById('feetSlide').addEventListener('mousemove', function() {feetAngle = this.value; renderAllShapes(); });

    document.getElementById('bodySlide').addEventListener('mousemove', function() {bodyAngle = this.value; renderScene(); });

    document.getElementById('armLAnimationON').onclick = function() {g_armAnimation= true;};
    document.getElementById('armLAnimationOFF').onclick = function() {g_armAnimation= false;};

    document.getElementById('happyAnimationON').onclick = function() {g_happyAnimation= true;};
    document.getElementById('happyAnimationOFF').onclick = function() {g_happyAnimation= false;};
    document.getElementById('happyAnimationSpeed').addEventListener('mouseenter', function() {speed = this.value; renderScene(); });

    document.getElementById('runAnimationON').onclick = function() {g_runAnimation= true;};
    document.getElementById('runAnimationOFF').onclick = function() {g_runAnimation= false;};
    document.getElementById('runAnimationSpeed').addEventListener('mouseenter', function() {speed2 = this.value; renderScene(); });
 
    document.addEventListener("click", logKey);

    
}

function logKey(e) {
  if(e.shiftKey){
    shiftCount += 1;
    shiftCount = shiftCount %3;
    console.log(shiftCount);
    switch(shiftCount){
      case(0):
        resetPose();
        g_happyAnimation = false;
        g_runAnimation = false;
        g_armAnimation = true;
    
        break;
      case(1):
      resetPose();

        g_armAnimation = false;
        g_runAnimation = false;
        g_happyAnimation = true;
        break;
      case(2):
      resetPose();

        g_happyAnimation = false;
        g_armAnimation = false;
        g_runAnimation = true;
        break;
    }
  }
}

function main() {
  setupWebGL();

  connectVariablesToGLSL();
  addActionsForHTMLUI();
  // Register function (event handler) to be called on a mouse press

  // Specify the color for clearing <canvas>
  //gl.clearColor(0.0, 0.0, 0.784, 1.0);

  gl.clearColor(0.678, 0.784, 0.79, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);
  //renderAllShapes();

  requestAnimationFrame(tick);
}


var g_startTime= performance.now()/1000.0;
var g_seconds= performance.now()/1000.0 - g_startTime;

function tick(){
  g_seconds= performance.now()/1000.0-g_startTime;
  updateAnimationAngles();
  renderScene();
  requestAnimationFrame(tick);
}

function updateAnimationAngles(){
  if(g_armAnimation){
    armAngle = (-(45* Math.sin(5*g_seconds) -70));
    armAngleR = -(3* Math.sin(2*g_seconds) -30);
    tailAngle = (4* Math.sin(2*g_seconds));
    feetAngle = (5* Math.sin(2*g_seconds));
    bodyAngle = -(5* Math.sin(2*g_seconds) - 2);
    fullBodyAngle = -(1.2* Math.sin(2*g_seconds)-4);
    headAngle = (5* Math.sin(2*g_seconds) );
  }
  if(g_happyAnimation){
    armAngle = -(45* Math.sin(speed*g_seconds) -70);
    armAngleR = -(45* Math.sin(speed*g_seconds) -70);
    bodyAngle = -(10* Math.sin(speed*g_seconds) - 2);
    headAngle = (10* Math.sin(speed*g_seconds) );
    feetAngle = (10* Math.sin(speed*g_seconds));
    fullBodyAngle = -(5* Math.sin(speed*g_seconds)-4);
    tailAngle = (3* Math.sin(speed*g_seconds));
  }
  if(g_runAnimation){
    armAngle = -(10* Math.sin(speed2*g_seconds) -50);
    armAngleR = -(10* Math.sin(speed2*g_seconds) -50);
    fullBodyAngle = -(2* Math.sin(speed2*g_seconds)-4);
    footAngleR = (70* Math.sin(speed2/2*g_seconds));
    headAngle = (3* Math.sin(speed2*g_seconds));
    tailAngle = (3* Math.sin(speed2*g_seconds));
  }
}



function convertCoordinaatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return([x,y]);
}





function renderScene(){
    // Clear <canvas>
var startTime = performance.now();
//gl.clearColor(0.0, 0.0, 0.0, 1.0);

  var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
  globalRotMat.rotate(-g_globalAngle2,1,0,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  /*  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }*/
  var legR = new Cube();
  legR.color = [0.039,0.035,0.290,1.0];
  legR.matrix.translate( 0,fullBodyAngle/50,0);
  var legCoords = new Matrix4(legR.matrix);
  legR.matrix.translate(0, -fullBodyAngle/200,0);
  var legCoords2 = new Matrix4(legR.matrix);
  legR.matrix.translate(0,-footAngleR * .001, 0);
  legR.matrix.translate(0,-footAngleR * .0009,footAngleR * .003 + .05);
  legR.matrix.translate( .14, -.35, 0.07);
  legR.matrix.rotate(feetAngle, 1,0,0);
  legR.matrix.rotate(-footAngleR, 1,0,0);

  legR.matrix.rotate(-10, 0,1,0);
  legR.matrix.rotate(60, 1,0,0);
  legR.matrix.scale(.11,.2,.05);
  legR.render();

  var legL = new Cube();
  legL.matrix = legCoords2;
  legL.color = [0.039,0.035,0.290,1.0];
  legL.matrix.translate( -.14, -.35, 0.07);

  legL.matrix.translate(0,footAngleR * .001, 0);
  legL.matrix.translate(0,footAngleR * .0009,-footAngleR * .003 + .05);
  legL.matrix.rotate(footAngleR, 1,0,0);

  legL.matrix.rotate(feetAngle, 1,0,0);
  legL.matrix.rotate(10, 0,1,0);
  legL.matrix.rotate(60, 1,0,0);
  legL.matrix.scale(.11,.2,.05);
  legL.render();

  var body = new Cube();
  body.matrix = legCoords;
  body.color = [0.5450, 0.8196,0.776,1.0];
  //these happen in reverse order
  body.matrix.rotate(bodyAngle, 1, 0 ,0);
  let bodyAngle2 = bodyAngle;
  let bodyAngle3 = bodyAngle;
  if( bodyAngle < 0){
    bodyAngle2 = bodyAngle/3;
  }
else{
    bodyAngle3 = bodyAngle/3;
  }

  body.matrix.translate( -.148, -.27 + bodyAngle2/200, 0.05 + bodyAngle3/150);
  var bodyCoordsTail = new Matrix4( body.matrix);
  var bodyCoordsScallop = new Matrix4( body.matrix);
  var bodyCoordinatesarm= new Matrix4(body.matrix);
  var bodyCoordinatesarmL=new Matrix4(body.matrix);
  var bodcordTest = new Matrix4(body.matrix);
  var bodyCoordinates= new Matrix4(body.matrix);
  var bodyCoordinates3= new Matrix4(body.matrix);
  body.matrix.translate(0,fullBodyAngle/300 -.02,0);
  body.matrix.scale(.4,.45,.37);
  body.render();

  var poof3L = new Cube();
  poof3L.matrix=bodyCoordinates;
  poof3L.color = [0.5450, 0.8196,0.776,1.0];
  //these happen in reverse order
  poof3L.matrix.translate( -0.05, .3, .1);
  poof3L.matrix.rotate(10,0,0,1);

  poof3L.matrix.scale(.15,.15,.15);
  poof3L.render();

  var poof3R = new Cube();
  poof3R.matrix=bodyCoordinates;
  poof3R.color = [0.5450, 0.8196,0.776,1.0];
  //these happen in reverse order
  poof3R.matrix.translate( 2.3, -0.2, 0);
  poof3R.matrix.rotate(-25,0,0,1);
  poof3R.render();

  var poof4R = new Cube();
  poof4R.matrix=bodyCoordinates;

  poof4R.color = [0.5450, 0.8196,0.776,1.0];
  //these happen in reverse order
  poof4R.matrix.translate( 0.23, .03, 1.3);
  poof4R.matrix.scale(.7,.8,.8);
  poof4R.render();

  var poof4L = new Cube();
  poof4L.matrix=bodyCoordinates;
  poof4L.color = [0.5450, 0.8196,0.776,1.0];
  //these happen in reverse order
  poof4L.matrix.translate( -3.35,-1.1,0);
  poof4L.matrix.rotate(30,0,0,1);
  poof4L.render();

  var poof5L = new Cube();
  poof5L.matrix=  bodcordTest;

  poof5L.color = [0.5450, 0.8196,0.776,1.0];
  //these happen in reverse order
  poof5L.matrix.translate( 0.05, .32, .35);
  poof5L.matrix.scale(.15,.12,.12);


  poof5L.render();


  var poof5R = new Cube();
  poof5R.matrix=  bodcordTest;
  poof5R.color = [0.5450, 0.8196,0.776,1.0];
  //these happen in reverse order
  poof5R.matrix.translate( .85, 0, 0);
  poof5R.render();



  var head = new Cube();
  head.matrix=bodyCoordinates3;
  head.color = [0.960,0.941,0.874,1.0];
  //these happen in reverse order
 
  head.matrix.translate( -0.01, .4 + -headAngle/200, -.02 );
  head.matrix.rotate(-headAngle, 1,0,0);
  head.matrix.scale(.43,.33,.4);
  var headCoordinates= new Matrix4(head.matrix);
  head.render();

  var earL = new Cube();
  earL.matrix = headCoordinates;
  earL.color = [0.039,0.035,0.290,1.0];
  //these happen in reverse order
  earL.matrix.translate( -.11, .8, .23);
  earL.matrix.rotate(5, 0,0,1);
  earL.matrix.scale(.26,.29, .26);
  earL.render();

  var earR = new Cube();
  earR.matrix=headCoordinates;
  earR.color = [0.039,0.035,0.290,1.0];
  //these happen in reverse order
  earR.matrix.translate( 3.7, -.19, 0);
  earR.matrix.rotate(-10, 0,0,1);
  earR.render();

  var eyeL = new Cube();
  eyeL.matrix=headCoordinates;
  eyeL.color = [0.039,0.035,0.290,1.0];
  //these happen in reverse order
  eyeL.matrix.translate( -2.7, -1.7, -.9);
  eyeL.matrix.rotate(5, 0,0,1);

  eyeL.matrix.scale(.3,1, 1);
  eyeL.render();

  var eyeR = new Cube();
  eyeR.matrix=headCoordinates;
  eyeR.color = [0.039,0.035,0.290,1.0];
  //these happen in reverse order
  eyeR.matrix.translate( 9, 0, 0);
  eyeR.render();

  var nose = new Cube();
  nose.matrix=headCoordinates;
  nose.color = [0.698,0.396,0.25,1.0];
  //these happen in reverse order
  nose.matrix.translate( -6.5, -.5, -.4);
  nose.matrix.scale(5, .8, 2);
  nose.render();

  var poofL = new Cube();
  poofL.matrix=headCoordinates;
  poofL.color = [0.5450, 0.8196,0.776,1.0];
  //these happen in reverse order
  var headAngletemp= headAngle;
  if (headAngle > 0){
    headAngletemp = 0;
  }
 
  poofL.matrix.translate( -.55, -1.7 +headAngletemp/30, 0 - headAngletemp/100);
  poofL.matrix.scale(.6, 1, .4);

  poofL.render();

  var poofR = new Cube();
  poofR.matrix=headCoordinates;
  poofR.color = [0.5450, 0.8196,0.776,1.0];
  //these happen in reverse order
  poofR.matrix.translate( 2.6, 0,0);
  poofR.render();

  
  var poof2L = new Cube();
  poof2L.matrix=headCoordinates;
  poof2L.color = [0.5450, 0.8196,0.776,1.0];
  //these happen in reverse order
  headAngletemp = headAngle;
  if(headAngle > 0){
    headAngletemp = 0;
  }
  poof2L.matrix.translate( -3.3, -0.3 - headAngletemp/50, .5 - headAngletemp/200);
  poof2L.matrix.rotate(5,0,0,1);
  poof2L.matrix.scale(1.3,1.4,1.4);

  poof2L.render();

  var poof2R = new Cube();
  poof2R.matrix=headCoordinates;

  //poof2R.matrix=headCoordinates;

  poof2R.color = [0.5450, 0.8196,0.776,1.0];
  //these happen in reverse order
  poof2R.matrix.translate( 2.8, 0, 0);
  poof2R.matrix.rotate(-10,0,0,1);

  poof2R.render();

 


  var arm = new Cube();
  arm.matrix = bodyCoordinatesarm;
  arm.color = [0.960,0.941,0.874,1.0];
  arm.matrix.translate( .05 - armAngle/1500, .3 + armAngle/2000, 0.12);
  arm.matrix.rotate(-armAngle + 10, 0,0,1);
  arm.matrix.translate( -.1, -.19, 0);
  arm.matrix.scale(.1,.19,.12);
  arm.render();

 
  var armR = new Cube();
  armR.matrix = bodyCoordinatesarmL;
  armR.color = [0.960,0.941,0.874,1.0];
  armR.matrix.translate( .35 + armAngleR/1500, .3 + armAngleR/2000 , 0.12);
  armR.matrix.rotate(armAngleR - 10, 0,0,1);
  armR.matrix.translate( 0, -.19, 0);
  armR.matrix.scale(.1,.19,.12);
  armR.render();

  

  var tail = new Cube();
  tail.matrix = bodyCoordsTail;
  tail.color = [0.039,0.035,0.290,1.0];
  tail.matrix.translate( 0.12, 0.07 + -tailAngle/150, 0.35);
  tail.matrix.rotate(60 + tailAngle, 1,0,0);
  tail.matrix.scale(.15,.25,.03);
  tail.render();

  var scallopBody = new Cube();
  scallopBody.matrix=bodyCoordsScallop;
  scallopBody.color = [0.945,0.804,0.588,1.0];
  //these happen in reverse order
  scallopBody.matrix.translate( .11, .2, -.05);
  scallopBody.matrix.scale(0.19, .11, .1);
  scallopBody.render();

  var scallopBodyS = new Cube();
  scallopBodyS.matrix=bodyCoordsScallop;
  scallopBodyS.color = [0.945,0.804,0.588,1.0];
  //these happen in reverse order
  scallopBodyS.matrix.translate( .23, -.4, 0);
  scallopBodyS.matrix.scale(0.5, .5, 1);
  scallopBodyS.render();


  
  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration)/10, "numdot");

}

function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if(!htmlElm){
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;

}
