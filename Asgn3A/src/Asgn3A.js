// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix *u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`;

// Fragment shader program
var FSHADER_SOURCE =
 `precision mediump float; 
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform int u_whichTexture;
  void main() {
    if(u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV); //use texture1
    } else if( u_whichTexture == -2){
      gl_FragColor = u_FragColor;  //use color
    } else if (u_whichTexture == -1){ 
      gl_FragColor = vec4(v_UV,1.0, 1.0); //use UV debug color
    }else if(u_whichTexture == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV); //use texture0
    } else if(u_whichTexture == 2){
      gl_FragColor = texture2D(u_Sampler2, v_UV); //use texture0
    } else if(u_whichTexture == 3){
      gl_FragColor = texture2D(u_Sampler3, v_UV); //use texture0
    }else {
      gl_FragColor = vec4(1, .2,.2,1); //error, put redish
    }
    
  }`;

  //Globals
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_whichTexture;

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

  a_UV = gl.getAttribLocation(gl.program, 'a_UV')
  if (a_UV < 0){
    console.log('Failed to get the storage location of a_UV');
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

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix){
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix =  gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if(!u_ProjectionMatrix){
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if(!u_Sampler0){
    console.log("Failed to get the storage location of u_Sampler0");
    return false;
  }
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if(!u_Sampler1){
    console.log("Failed to get the storage location of u_Sampler1");
    return false;
  }
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if(!u_Sampler2){
    console.log("Failed to get the storage location of u_Sampler2");
    return false;
  }
  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if(!u_Sampler3){
    console.log("Failed to get the storage location of u_Sampler3");
    return false;
  }



  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if(!u_whichTexture){
    console.log("Failed to get the storage location of u_whichTexture");
    return false;
  }
  //set an initial value for tis matrix to identify
  //var identityM = new Matrix4();
  //gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  //gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements);

  //gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);


}


//globals related to UI elements
let g_globalAngle=20;
let g_globalAngle2=5;


function addActionsForHTMLUI(){
  
    document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderScene(); });
    document.getElementById('angleSlideY').addEventListener('mousemove', function() {g_globalAngle2 = this.value; renderScene(); });

}


function initTextures(){
  var image = new Image();
  if(!image){
    console.log("Failed to create the image object");
    return false;
  }

  image.onload = function(){sendTextureToGLSL(u_Sampler0, image, 0)};
  image.src = "ground.jpg";

  var image2 = new Image();
  if(!image2){
    console.log("Failed to create the image object");
    return false;
  }

  image2.onload = function(){sendTextureToGLSL(u_Sampler1, image2, 1)};
  image2.src = "sky.png";

  var image3 = new Image();
  if(!image3){
    console.log("Failed to create the image object");
    return false;
  }

  image3.onload = function(){sendTextureToGLSL(u_Sampler2, image3, 2)};
  image3.src = "sand.jpeg";

  var image4 = new Image();
  if(!image4){
    console.log("Failed to create the image object");
    return false;
  }

  image4.onload = function(){sendTextureToGLSL(u_Sampler3, image4, 3)};
  image4.src = "plank.png";
  return true;
}


//deals with passing to gl
function sendTextureToGLSL(u_Sampler, image, n) {
  var texture = gl.createTexture();
  if(!texture){
    console.log("Failed to create the texture object");
    return false;
  }
  
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image's y axis
  // Activate texture unit0
  switch (n){
    case 0: 
      gl.activeTexture(gl.TEXTURE0);
      break;
    case 1: 
      gl.activeTexture(gl.TEXTURE1);
      break;
    case 2:
      gl.activeTexture(gl.TEXTURE2);
      break;
    case 3:
      gl.activeTexture(gl.TEXTURE3);
      
    }
  
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameter
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the image to texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, n);
  
  console.log("finished loadTexture");
}


function main() {
  setupWebGL();

  connectVariablesToGLSL();
  addActionsForHTMLUI();
  // Register function (event handler) to be called on a mouse press

  // Specify the color for clearing <canvas>
  //gl.clearColor(0.0, 0.0, 0.784, 1.0);
  document.onkeydown = keydown;
  initTextures();

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
  renderScene();
  requestAnimationFrame(tick);
}





function convertCoordinaatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return([x,y]);
}

g_camera = new Camera();





function renderScene(){
    // Clear <canvas>
  var startTime = performance.now();

  var projMat = new Matrix4();
  projMat.setPerspective(50, canvas.width/canvas.height, .1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  viewMat.setLookAt(g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]); //(eye, at, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
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
  var ground = new Cube();
  ground.textureNum = 0;
  ground.color = [0.039,0.035,0.290,1.0];
  ground.matrix.translate(0,-.40, 0.0);
  ground.matrix.scale(10,0,10);
  ground.matrix.translate(-.5,0, -0.5);
  ground.render();

  var sky = new Cube();
  sky.textureNum = 1;
  sky.color = [1.0,0.0,0.0,1.0];
  sky.matrix.scale(50,50,50);
  sky.matrix.translate(-.5,-.35,-0.5);
  sky.render();

  var box1 = new Cube();
  box1.textureNum = 2;
  box1.matrix.scale(.7,.7,.7);
  box1.matrix.translate(-1.7,-.4,.9);
  box1.render();

  var box2 = new Cube();
  box2.color = [.3,0.4,1.0,1.0];
  box2.matrix.scale(.7,.7,.7);
  box2.matrix.translate(1.3,-.4,1.6);
  box2.render();

  
  var box3 = new Cube();
  box3.color = [.5,0.4,1.0,1.0];
  box3.matrix.scale(.7,.7,.7);
  box3.matrix.translate(1.3,.5,1.6);
  box3.render();

  var box4 = new Cube();
  box4.textureNum = 3;
  box4.matrix.scale(.7,.7,.7);
  box4.matrix.translate(-.9,-.4,1.6);
  box4.render();



  
  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration)/10, "numdot");

}
function keydown(ev){
  if(ev.keyCode ==68){
    g_camera.right();
  }else
  if (ev.keyCode == 65){
    g_camera.left();
  }
  console.log(ev.keyCode);
  renderScene();
}
  


function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if(!htmlElm){
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;

}
