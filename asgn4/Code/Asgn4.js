// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix *u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }`;

// Fragment shader program
var FSHADER_SOURCE =
 `precision mediump float; 
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  varying vec3 v_Normal;

  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  uniform bool u_lightOn;
  varying vec4 v_VertPos;
  uniform vec3 u_SelectedColor;

  void main() {
    if(u_whichTexture == 4){
      gl_FragColor = vec4((v_Normal + 1.0)/2.0, 1.0); //use texture1
    }
    else if(u_whichTexture == 1){
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
    
    vec3 lightVector = u_lightPos- vec3(v_VertPos);
    float r=length(lightVector);

    /*
    if(r<1.0){
      gl_FragColor = vec4(1,0,0,1);
    }else if (r <2.0){
      gl_FragColor=vec4(0,1,0,1);
    }*/
    
    //light falloff visualization 1/r^2
    //gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1);
    
    // N dot L
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);

    //reflection
    vec3 R = reflect (-L, N);

    //eye
    vec3 E = normalize(u_cameraPos-vec3(v_VertPos));

    //specular
    float specular = pow(max(dot(E,R), 0.0), 50.0);
    
    vec3 diffuse = vec3(gl_FragColor) * nDotL *.7;
    vec3 ambient = vec3(gl_FragColor) * 0.3 * u_SelectedColor;
    if(u_lightOn){
      if(u_whichTexture == 2){
        gl_FragColor = vec4(specular + diffuse + ambient,1.0);
      } else{
        gl_FragColor =  vec4(diffuse+ambient, 1.0);

      }
    }
  }`;

  //Globals
let canvas;
let gl;
let a_Position;
let a_Normal;
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
let u_lightPos;
let u_cameraPos;
let u_lightOn;
let u_SelectedColor;
let vertexBuffer = null;
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
  vertexBuffer = gl.createBuffer();
  if(!vertexBuffer){
        console.log('Failed to create the buffer object');
        return -1;
  }
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

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if(a_Normal < 0){
    console.log("Failed to et the storage location of a_Normal");
    return;
  }
  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_SelectedColor = gl.getUniformLocation(gl.program, 'u_SelectedColor');
  if (!u_SelectedColor) {
    console.log('Failed to get the storage location of u_SelectedColor');
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
  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if((!u_cameraPos)){
    console.log("Failed to get the storage location of u_cameraPos");
    return;
  }
  
  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if((!u_lightPos)){
    console.log("Failed to get the storage location of u_lightPos");
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if(!u_lightOn){
    console.log('Failed to get the storage location of u_lightOn');
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
let g_globalAngle=0;
let g_globalAngle2=0;
let g_NormalOn = false;
let g_lightPos = [0,1,-2];
let g_lightOn = true;
let g_selectedColor = [1.0,1.0,1.0];

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
let g_armAnimation = true;
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
    document.getElementById('normalON').onclick = function() {g_NormalOn = true};
    document.getElementById('normalOFF').onclick = function() {g_NormalOn = false};
    
    document.getElementById('lightON').onclick = function() {g_lightOn = true};
    document.getElementById('lightOFF').onclick = function() {g_lightOn = false};

    document.getElementById('colorSlideR').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100;});
    document.getElementById('colorSlideG').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100;});
    document.getElementById('colorSlideB').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100;});
    
    document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderScene(); });
    document.getElementById('angleSlideY').addEventListener('mousemove', function() {g_globalAngle2 = this.value; renderScene(); });

    document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) {if (ev.buttons == 1) {g_lightPos[0] = this.value/100; renderScene(); }});
    document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) {if (ev.buttons == 1) {g_lightPos[1] = this.value/100; renderScene(); }});
    document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) {if (ev.buttons == 1) {g_lightPos[2] = this.value/100; renderScene(); }});

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
  updateAnimationAngles();
  renderScene();
  requestAnimationFrame(tick);
}

function updateAnimationAngles(){
  g_lightPos[0] = Math.cos(g_seconds);
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

g_camera = new Camera();




function renderScene(){
    // Clear <canvas>
  var startTime = performance.now();

  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width/canvas.height, .1, 1000);
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
  
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  
  gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);
  
  gl.uniform3f(u_SelectedColor, g_selectedColor[0], g_selectedColor[1], g_selectedColor[2]);

  gl.uniform1i(u_lightOn, g_lightOn);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  /*  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }*/
  var light = new Cube();
  light.color=[2,2,0,1];
  //light.matrix.translate(g_LightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.translate(g_lightPos[0],g_lightPos[1],g_lightPos[2]);

  light.matrix.scale(-.1,-.1,-.1);

  light.render();

  var ground = new Cube();
  ground.textureNum = 0;
  ground.color = [0.039,0.035,0.290,1.0];
  ground.matrix.translate(0,-.8, 0.0);
  ground.matrix.scale(20,0,20);
  ground.matrix.translate(-.5,0, -0.5);
  ground.render();

  var sky = new Cube();
  sky.textureNum = 1;
  if(g_NormalOn) sky.textureNum = 4;
  
  sky.color = [1.0,0.0,0.0,1.0];
  sky.matrix.scale(-50,-50,-50);
  sky.matrix.translate(-.5,-.4,-0.5);
  sky.render();

  var sphere = new Sphere();
  sphere.textureNum = 2;

  if(g_NormalOn) sphere.textureNum = 4;
  sphere.matrix.translate(-3,0,2);
  sphere.render();

  var box1 = new Cube();
  box1.textureNum = 2;
  if(g_NormalOn) box1.textureNum = 4;

  box1.matrix.scale(.7,.7,.7);
  box1.matrix.translate(-1.7,-.4,.9);
  box1.render();

  var box2 = new Cube();
  box2.color = [.3,0.4,1.0,1.0];
  if(g_NormalOn) box2.textureNum = 4;

  box2.matrix.scale(.7,.7,.7);
  box2.matrix.translate(1.3,-.4,1.6);
  box2.render();

  
  var box3 = new Cube();
  box3.color = [.5,0.4,1.0,1.0];
  if(g_NormalOn) box3.textureNum = 4;

  box3.matrix.scale(.7,.7,.7);
  box3.matrix.translate(1.3,.5,1.6);
  box3.render();

  var box4 = new Cube();
  box4.textureNum = 3;
  if(g_NormalOn) box4.textureNum = 4;

  box4.matrix.scale(.7,.7,.7);
  box4.matrix.translate(-.9,-.4,1.6);
  box4.render();

  var legR = new Cube();
  if(g_NormalOn) legR.textureNum = 4;

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
  if(g_NormalOn) legL.textureNum = 4;

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
  if(g_NormalOn) body.textureNum = 4;

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
  if(g_NormalOn) poof3L.textureNum = 4;

  poof3L.matrix=bodyCoordinates;
  poof3L.color = [0.5450, 0.8196,0.776,1.0];
  //these happen in reverse order
  poof3L.matrix.translate( -0.05, .3, .1);
  poof3L.matrix.rotate(10,0,0,1);

  poof3L.matrix.scale(.15,.15,.15);
  poof3L.render();

  var poof3R = new Cube();
  if(g_NormalOn) poof3R.textureNum = 4;

  poof3R.matrix=bodyCoordinates;
  poof3R.color = [0.5450, 0.8196,0.776,1.0];
  //these happen in reverse order
  poof3R.matrix.translate( 2.3, -0.2, 0);
  poof3R.matrix.rotate(-25,0,0,1);
  poof3R.render();

  var poof4R = new Cube();
  if(g_NormalOn) poof4R.textureNum = 4;

  poof4R.matrix=bodyCoordinates;

  poof4R.color = [0.5450, 0.8196,0.776,1.0];
  //these happen in reverse order
  poof4R.matrix.translate( 0.23, .03, 1.3);
  poof4R.matrix.scale(.7,.8,.8);
  poof4R.render();

  var poof4L = new Cube();
  if(g_NormalOn) poof4L.textureNum = 4;

  poof4L.matrix=bodyCoordinates;
  poof4L.color = [0.5450, 0.8196,0.776,1.0];
  //these happen in reverse order
  poof4L.matrix.translate( -3.35,-1.1,0);
  poof4L.matrix.rotate(30,0,0,1);
  poof4L.render();

  var poof5L = new Cube();
  if(g_NormalOn) poof5L.textureNum = 4;

  poof5L.matrix=  bodcordTest;

  poof5L.color = [0.5450, 0.8196,0.776,1.0];
  //these happen in reverse order
  poof5L.matrix.translate( 0.05, .32, .35);
  poof5L.matrix.scale(.15,.12,.12);


  poof5L.render();


  var poof5R = new Cube();
  if(g_NormalOn) poof5R.textureNum = 4;

  poof5R.matrix=  bodcordTest;
  poof5R.color = [0.5450, 0.8196,0.776,1.0];
  //these happen in reverse order
  poof5R.matrix.translate( .85, 0, 0);
  poof5R.render();



  var head = new Cube();
  if(g_NormalOn) head.textureNum = 4;

  head.matrix=bodyCoordinates3;
  head.color = [0.960,0.941,0.874,1.0];
  //these happen in reverse order
 
  head.matrix.translate( -0.01, .4 + -headAngle/200, -.02 );
  head.matrix.rotate(-headAngle, 1,0,0);
  head.matrix.scale(.43,.33,.4);
  var headCoordinates= new Matrix4(head.matrix);
  head.render();

  var earL = new Cube();
  if(g_NormalOn) earL.textureNum = 4;

  earL.matrix = headCoordinates;
  earL.color = [0.039,0.035,0.290,1.0];
  //these happen in reverse order
  earL.matrix.translate( -.11, .8, .23);
  earL.matrix.rotate(5, 0,0,1);
  earL.matrix.scale(.26,.29, .26);
  earL.render();

  var earR = new Cube();
  if(g_NormalOn) earR.textureNum = 4;

  earR.matrix=headCoordinates;
  earR.color = [0.039,0.035,0.290,1.0];
  //these happen in reverse order
  earR.matrix.translate( 3.7, -.19, 0);
  earR.matrix.rotate(-10, 0,0,1);
  earR.render();

  var eyeL = new Cube();
  if(g_NormalOn) eyeL.textureNum = 4;

  eyeL.matrix=headCoordinates;
  eyeL.color = [0.039,0.035,0.290,1.0];
  //these happen in reverse order
  eyeL.matrix.translate( -2.7, -1.7, -.9);
  eyeL.matrix.rotate(5, 0,0,1);

  eyeL.matrix.scale(.3,1, 1);
  eyeL.render();

  var eyeR = new Cube();
  if(g_NormalOn) eyeR.textureNum = 4;

  eyeR.matrix=headCoordinates;
  eyeR.color = [0.039,0.035,0.290,1.0];
  //these happen in reverse order
  eyeR.matrix.translate( 9, 0, 0);
  eyeR.render();

  var nose = new Cube();
  if(g_NormalOn) nose.textureNum = 4;

  nose.matrix=headCoordinates;
  nose.color = [0.698,0.396,0.25,1.0];
  //these happen in reverse order
  nose.matrix.translate( -6.5, -.5, -.4);
  nose.matrix.scale(5, .8, 2);
  nose.render();

  var poofL = new Cube();
  if(g_NormalOn) poofL.textureNum = 4;

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
  if(g_NormalOn) poofR.textureNum = 4;

  poofR.matrix=headCoordinates;
  poofR.color = [0.5450, 0.8196,0.776,1.0];
  //these happen in reverse order
  poofR.matrix.translate( 2.6, 0,0);
  poofR.render();

  
  var poof2L = new Cube();
  if(g_NormalOn) poof2L.textureNum = 4;

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
  if(g_NormalOn) poof2R.textureNum = 4;

  poof2R.matrix=headCoordinates;

  //poof2R.matrix=headCoordinates;

  poof2R.color = [0.5450, 0.8196,0.776,1.0];
  //these happen in reverse order
  poof2R.matrix.translate( 2.8, 0, 0);
  poof2R.matrix.rotate(-10,0,0,1);

  poof2R.render();

 


  var arm = new Cube();
  if(g_NormalOn) arm.textureNum = 4;

  arm.matrix = bodyCoordinatesarm;
  arm.color = [0.960,0.941,0.874,1.0];
  arm.matrix.translate( .05 - armAngle/1500, .3 + armAngle/2000, 0.12);
  arm.matrix.rotate(-armAngle + 10, 0,0,1);
  arm.matrix.translate( -.1, -.19, 0);
  arm.matrix.scale(.1,.19,.12);
  arm.render();

 
  var armR = new Cube();
  if(g_NormalOn) armR.textureNum = 4;

  armR.matrix = bodyCoordinatesarmL;
  armR.color = [0.960,0.941,0.874,1.0];
  armR.matrix.translate( .35 + armAngleR/1500, .3 + armAngleR/2000 , 0.12);
  armR.matrix.rotate(armAngleR - 10, 0,0,1);
  armR.matrix.translate( 0, -.19, 0);
  armR.matrix.scale(.1,.19,.12);
  armR.render();

  

  var tail = new Cube();
  if(g_NormalOn) tail.textureNum = 4;

  tail.matrix = bodyCoordsTail;
  tail.color = [0.039,0.035,0.290,1.0];
  tail.matrix.translate( 0.12, 0.07 + -tailAngle/150, 0.35);
  tail.matrix.rotate(60 + tailAngle, 1,0,0);
  tail.matrix.scale(.15,.25,.03);
  tail.render();

  var scallopBody = new Cube();
  if(g_NormalOn) scallopBody.textureNum = 4;

  scallopBody.matrix=bodyCoordsScallop;
  scallopBody.color = [0.945,0.804,0.588,1.0];
  //these happen in reverse order
  scallopBody.matrix.translate( .11, .2, -.05);
  scallopBody.matrix.scale(0.19, .11, .1);
  scallopBody.render();

  var scallopBodyS = new Cube();
  if(g_NormalOn) scallopBodyS.textureNum = 4;

  scallopBodyS.matrix=bodyCoordsScallop;
  scallopBodyS.color = [0.945,0.804,0.588,1.0];
  //these happen in reverse order
  scallopBodyS.matrix.translate( .23, -.4, 0);
  scallopBodyS.matrix.scale(0.5, .5, 1);
  scallopBodyS.render();




  
  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration)/10, "numdot");

}
function keydown(ev){
  if(ev.keyCode ==68){
    g_camera.right();
  }else if (ev.keyCode == 65){
    g_camera.left();
  }else if(ev.keyCode == 87){
    g_camera.forward();
  }else if(ev.keyCode == 83){
    g_camera.back();
  }else if (ev.keyCode == 81){
    g_camera.panLeft();
  }else if(ev.keyCode == 69){
    g_camera.panRight();
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
