class Cube{
    constructor(){
      this.type= 'cube';
      //this.position = [0.0, 0.0, 0.0];
      this.color = [1.0,1.0,1.0,1.0];
      //this.size = 20.0;
      //this.segments = 10;
      this.matrix = new Matrix4();
    }
  
  
  
   render(){
       //var xy = this.position;
       var rgba = this.color;
       //var size = this.size;
     // Assign the buffer object to a_Position variable
     
     // Pass the color of a point to u_FragColor variable
     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

     //pass the matrix to u_ModelMatrix attribute
     gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  

     //top of cube
     gl.uniform4f(u_FragColor, rgba[0]*1.1, rgba[1] *1.1, rgba[2]*1.1, rgba[3]);
      drawTriangle3D([ 0,1,0 , 0,1,1, 1,1,1 ]);
      drawTriangle3D([ 0,1,0 , 1,1,1, 1,1,0 ]);


      //front of cube
      gl.uniform4f(u_FragColor, rgba[0]* .98, rgba[1] *.98, rgba[2]*.98, rgba[3]);
      drawTriangle3D([ 0,0,0 , 1,1,0, 1,0,0 ]);
      drawTriangle3D([ 0,0,0 , 0,1,0, 1,1,0 ]);

      
      //back of cube
      gl.uniform4f(u_FragColor, rgba[0]* .88, rgba[1] *.73, rgba[2]*.88, rgba[3]);
      drawTriangle3D([ 0,0,1 , 1,1,1, 1,0,1 ]);
      drawTriangle3D([ 0,0,1 , 0,1,1, 1,1,1 ]);
      
      //side right of cube
      gl.uniform4f(u_FragColor, rgba[0]* .95, rgba[1] *.8, rgba[2]*.95, rgba[3]);
      drawTriangle3D([ 1,0,0 , 1,0,1, 1,1,1 ]);
      drawTriangle3D([ 1,0,0 , 1,1,0, 1,1,1 ]);
      
      //side left of cube
      gl.uniform4f(u_FragColor, rgba[0]* .92, rgba[1] *.77, rgba[2]*.92, rgba[3]);
      drawTriangle3D([ 0,0,0 , 0,0,1, 0,1,1 ]);
      drawTriangle3D([ 0,0,0 , 0,1,0, 0,1,1 ]);
    
      //bottom of cube
      gl.uniform4f(u_FragColor, rgba[0]* .7, rgba[1] *.6, rgba[2]*.7, rgba[3]);
      drawTriangle3D([ 0,0,0 , 0,0,1, 1,0,1 ]);
      drawTriangle3D([ 0,0,0 , 1,0,1, 1,0,0 ]);

    }
}
  
  