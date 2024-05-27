const BYTES = 4;
class Triangle{
  
  constructor(){
    this.type= 'triangle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0,1.0,1.0,1.0];
    this.size = 20.0;
  }



 render(){
     var xy = this.position;
     var rgba = this.color;
     var size = this.size;
   // Assign the buffer object to a_Position variable
  gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
   
   // Pass the color of a point to u_FragColor variable
   gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
   
   gl.uniform1f(u_Size, size);

    var d = this.size/200.0;
    drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]);
 }
}

function drawTriangle(vertices){
   var n = 3;
    var vBuffer = gl.createBuffer();
    if(!vBuffer){
        console.log('Failed to create the buffer object');
        return -1;
    }


    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_Position,2,gl.FLOAT, false, 0,0);

    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES,0,n);

}     // Write the positions of vertices to a vertex shader


function initTriangle3D(){
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

   gl.vertexAttribPointer(a_Position,3,gl.FLOAT, false, 0,0);

   gl.enableVertexAttribArray(a_Position);
}


function drawTriangle3D(vertices){
  var n = vertices.length/3;
   if(vertexBuffer == null){
    initTriangle3D();
   }
   

   gl.drawArrays(gl.TRIANGLES,0,n);

}     // Write the positions of vertices to a vertex shader


function drawTriangle3DUV(vertices, uv){
  
  var n = vertices.length/3;

  {/*var vertexBuffer = gl.createBuffer();
  if(!vertexBuffer){
    console.log('Failed to create the buffer object');
    return -1;
  }
  */}
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Position,3,gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

   var uvBuffer = gl.createBuffer();
   if(!uvBuffer){
    console.log('Failed to create the buffer object');
       return -1;
   }

  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_UV,2,gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_UV);

  gl.drawArrays(gl.TRIANGLES, 0,n);
  g_vertexBuffer = null;
}

function drawTriangle3DUVCombined(vertTex){
  
  var n = vertTex.length/3; //num vertices


  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
  gl.vertexAttribPointer(a_Position,3,gl.FLOAT, false, BYTES * 5, 0);
  gl.enableVertexAttribArray(a_Position);

  
  var a_UV = gl.getAttribLocation(gl.program, 'a_TexCoord');
  gl.vertexAttribPointer(a_UV,2,gl.FLOAT, false, BYTES * 5, BYTES * 3);
  gl.enableVertexAttribArray(a_UV);

  gl.drawArrays(gl.TRIANGLES, 0,n);

}

function drawTriangle3DUVNormal(vertices, uv, normals){
  
  var n = vertices.length/3;

  {/*var vertexBuffer = gl.createBuffer();
  if(!vertexBuffer){
    console.log('Failed to create the buffer object');
    return -1;
  }
  */}
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Position,3,gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

   var uvBuffer = gl.createBuffer();
   if(!uvBuffer){
    console.log('Failed to create the buffer object');
       return -1;
   }

  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_UV,2,gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_UV);

  var normalBuffer = gl.createBuffer();
  if(!normalBuffer){
   console.log('Failed to create the buffer object');
      return -1;
  }

 gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
 gl.vertexAttribPointer(a_Normal,3,gl.FLOAT, false, 0, 0);
 gl.enableVertexAttribArray(a_Normal);

  gl.drawArrays(gl.TRIANGLES, 0,n);
  g_vertexBuffer = null;
}

