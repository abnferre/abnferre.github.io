class Cube{
    static VERTS= new Float32Array([ 0,1,0 , 0,1,1, 1,1,1 ,     0,0, 0,1, 1,1])
    constructor(){
      this.type= 'cube';
      //this.position = [0.0, 0.0, 0.0];
      this.color = [1.0,1.0,1.0,1.0];
      //this.size = 20.0;
      //this.segments = 10;
      this.matrix = new Matrix4();
      this.textureNum = -2;

    }
  
  
  
   render(){
       //var xy = this.position;
       var rgba = this.color;
       //var size = this.size;
     // Assign the buffer object to a_Position variable
     

     gl.uniform1i(u_whichTexture, this.textureNum);
     // Pass the color of a point to u_FragColor variable
     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

     //pass the matrix to u_ModelMatrix attribute
     gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
    //top of cube
      gl.uniform4f(u_FragColor, rgba[0]*1.1, rgba[1] *1.1, rgba[2]*1.1, rgba[3]);
      drawTriangle3DUVNormal([ 0,1,0 , 0,1,1, 1,1,1 ], [0,0, 0,1, 1,1], [0,1,0 , 0,1,0 , 0,1,0]);
      drawTriangle3DUVNormal([ 0,1,0 , 1,1,1, 1,1,0 ], [0,0, 1,1, 1,0], [0,1,0 , 0,1,0 , 0,1,0]);


      //front of cube
      gl.uniform4f(u_FragColor, rgba[0]* .98, rgba[1] *.98, rgba[2]*.98, rgba[3]);
      drawTriangle3DUVNormal([0,0,0 , 1,1,0 , 1,0,0], [0,0, 1,1, 1,0], [0,0,-1 , 0,0,-1 , 0,0,-1]);
      drawTriangle3DUVNormal([0,0,0 , 0,1,0 , 1,1,0], [0,0, 0,1, 1,1], [0,0,-1 , 0,0,-1 , 0,0,-1]);
      
      //back of cube
      gl.uniform4f(u_FragColor, rgba[0]* .88, rgba[1] *.73, rgba[2]*.88, rgba[3]);
      drawTriangle3DUVNormal([ 0,0,1 , 1,1,1, 1,0,1 ], [1,0, 0,1, 0,0], [0,0,1 , 0,0,1 , 0,0,1]);
      drawTriangle3DUVNormal([ 0,0,1 , 0,1,1, 1,1,1 ], [1,0, 1,1, 0,1], [0,0,1 , 0,0,1 , 0,0,1]);
      
      //side right of cube
      gl.uniform4f(u_FragColor, rgba[0]* .95, rgba[1] *.8, rgba[2]*.95, rgba[3]);
      drawTriangle3DUVNormal([ 1,0,0 , 1,0,1, 1,1,1 ], [0,0, 1,0, 1,1], [1,0,0 , 1,0,0 , 1,0,0]);
      drawTriangle3DUVNormal([ 1,0,0 , 1,1,0, 1,1,1 ], [0,0, 0,1, 1,1], [1,0,0 , 1,0,0 , 1,0,0]);
      
      //side left of cube
      gl.uniform4f(u_FragColor, rgba[0]* .92, rgba[1] *.77, rgba[2]*.92, rgba[3]);
      drawTriangle3DUVNormal([ 0,0,0 , 0,0,1, 0,1,1 ],[1,0, 0,0, 0,1], [-1,0,0 , -1,0,0 , -1,0,0]);
      drawTriangle3DUVNormal([ 0,0,0 , 0,1,0, 0,1,1 ], [1,0, 1,1, 0,1], [-1,0,0 , -1,0,0 , -1,0,0]);
    
      //bottom of cube
      gl.uniform4f(u_FragColor, rgba[0]* .7, rgba[1] *.6, rgba[2]*.7, rgba[3]);
      drawTriangle3DUVNormal([ 0,0,0 , 0,0,1, 1,0,1 ], [0,1, 0,0, 1,0], [0,-1,0 , 0,-1,0 , 0,-1,0]);
      drawTriangle3DUVNormal([ 0,0,0 , 1,0,1, 1,0,0 ], [0,1, 1,0, 1,1], [0,-1,0 , 0,-1,0 , 0,-1,0]);

    }
    renderFast(){
      //var xy = this.position;
      var rgba = this.color;
      //var size = this.size;
    // Assign the buffer object to a_Position variable
    

    gl.uniform1i(u_whichTexture, this.textureNum);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    //pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
 
   //top of cube
     var allVerts= [];
     allVerts=allVerts.concat([ 0,1,0 , 0,1,1, 1,1,1 ]);
     allVerts=allVerts.concat([ 0,1,0 , 1,1,1, 1,1,0 ]);
    

     //front of cube
     allVerts=allVerts.concat([0,0,0 , 1,1,0 , 1,0,0]);
     allVerts=allVerts.concat([0,0,0 , 0,1,0 , 1,1,0]);
     
     //back of cube
     allVerts=allVerts.concat([ 0,0,1 , 1,1,1, 1,0,1 ]);
     allVerts=allVerts.concat([ 0,0,1 , 0,1,1, 1,1,1 ]);
     
     //side right of cube
     allVerts=allVerts.concat([ 1,0,0 , 1,0,1, 1,1,1 ]);
     allVerts=allVerts.concat([ 1,0,0 , 1,1,0, 1,1,1 ]);
     
     //side left of cube
     allVerts=allVerts.concat([ 0,0,0 , 0,0,1, 0,1,1 ]);
     allVerts=allVerts.concat([ 0,0,0 , 0,1,0, 0,1,1 ]);
   
     //bottom of cube
     allVerts=allVerts.concat([ 0,0,0 , 0,0,1, 1,0,1 ]);
     allVerts=allVerts.concat([ 0,0,0 , 1,0,1, 1,0,0 ]);
      drawTriangle3D(allVerts);
   }
    renderFast1(){
      //var xy = this.position;
      var rgba = this.color;
      //var size = this.size;
    // Assign the buffer object to a_Position variable
    

    gl.uniform1i(u_whichTexture, this.textureNum);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    //pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
 
   //top of cube
     var allVerts= [];
     gl.uniform4f(u_FragColor, rgba[0]*1.1, rgba[1] *1.1, rgba[2]*1.1, rgba[3]);
     allVerts=allVerts.concat([ 0,1,0 , 0,1,1, 1,1,1 ], [0,0, 0,1, 1,1]);
     allVerts=allVerts.concat([ 0,1,0 , 1,1,1, 1,1,0 ], [0,0, 1,1, 1,0]);
    

     //front of cube
     //gl.uniform4f(u_FragColor, rgba[0]* .98, rgba[1] *.98, rgba[2]*.98, rgba[3]);
     allVerts=allVerts.concat([0,0,0 , 1,1,0 , 1,0,0], [0,0, 1,1, 1,0]);
     allVerts=allVerts.concat([0,0,0 , 0,1,0 , 1,1,0], [0,0, 0,1, 1,1]);
     
     //back of cube
     //gl.uniform4f(u_FragColor, rgba[0]* .88, rgba[1] *.73, rgba[2]*.88, rgba[3]);
     allVerts=allVerts.concat([ 0,0,1 , 1,1,1, 1,0,1 ], [1,0, 0,1, 0,0]);
     allVerts=allVerts.concat([ 0,0,1 , 0,1,1, 1,1,1 ], [1,0, 1,1, 0,1]);
     
     //side right of cube
     //gl.uniform4f(u_FragColor, rgba[0]* .95, rgba[1] *.8, rgba[2]*.95, rgba[3]);
     allVerts=allVerts.concat([ 1,0,0 , 1,0,1, 1,1,1 ], [0,0, 1,0, 1,1]);
     allVerts=allVerts.concat([ 1,0,0 , 1,1,0, 1,1,1 ], [0,0, 0,1, 1,1]);
     
     //side left of cube
     //gl.uniform4f(u_FragColor, rgba[0]* .92, rgba[1] *.77, rgba[2]*.92, rgba[3]);
     allVerts=allVerts.concat([ 0,0,0 , 0,0,1, 0,1,1 ],[1,0, 0,0, 0,1]);
     allVerts=allVerts.concat([ 0,0,0 , 0,1,0, 0,1,1 ], [1,0, 1,1, 0,1]);
   
     //bottom of cube
     //gl.uniform4f(u_FragColor, rgba[0]* .7, rgba[1] *.6, rgba[2]*.7, rgba[3]);
     allVerts=allVerts.concat([ 0,0,0 , 0,0,1, 1,0,1 ], [0,1, 0,0, 1,0]);
     allVerts=allVerts.concat([ 0,0,0 , 1,0,1, 1,0,0 ], [0,1, 1,0, 1,1]);
    
      drawTriangle3DUVCombined(allVerts);
   }
}
  
  