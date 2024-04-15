var alpha = 1;

function drawPogoTransparent(alph){
    alpha = alph;
    gl.clearColor(0.0, 0.0, 0.0, 1);  
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    
    drawHead();
    drawSpikes();
    drawHat();
    drawFace();
    drawBody();
    drawFur(); 
}

function buildPogo(step){
    alpha = 1;
    gl.clearColor(0.745, 0.807, 0.807, alpha);
    gl.clear(gl.COLOR_BUFFER_BIT);
    switch(Number(step)){
        
             
        case 8:
            drawSunRays();
        case 7:
            drawSun();
        case 6:
            drawHead();
        case 5:
            drawSpikes();
        case 4:
            drawHat();
        case 3: 
            drawFace();
        case 2:    
            drawBody();
        case 1:    
            drawFur();
        case 0:
            
     }

}
function drawPogo(){
    alpha = 1;
    gl.clearColor(0.745, 0.807, 0.807, alpha);
    gl.clear(gl.COLOR_BUFFER_BIT);

    drawSunRays();
    drawSun()

    drawHead();
    drawSpikes();
    drawHat();
    drawFace();
    drawBody();
    drawFur();
}
function drawHead(){
    gl.uniform4f(u_FragColor, .984,.7568,0.239,alpha);
    drawTriangle([0,-.25,  -.375, .4375, .375, .4375]);
    drawTriangle([0,-.25,   -.5625, .375, -.375, .4375]);
    drawTriangle([0,-.25,   .5625, .375, .375, .4375]);
    drawTriangle([0,-.25,-.5625, .375, -.6875, .25]);
    drawTriangle([0,-.25, .5625, .375, .6875, .25]);
    drawTriangle([0,-.25, -.75,0, -.6875, .25]);
    drawTriangle([0,-.25, .75,0, .6875, .25]);
    drawTriangle([0,-.25, -.75,0, -.625, -.25]);
    drawTriangle([0,-.25, .75,0, .625, -.25]);

}

function drawSpikes(){
    gl.uniform4f(u_FragColor, 0.925,.69,0.1529,alpha);
    drawTriangle([-.5, .5,   -.5625, .375, -.375, .4375]);
    drawTriangle([.5, .5,   .5625, .375, .375, .4375]);
    drawTriangle([-.75, .375, -.5625, .375, -.6875, .25]);
    drawTriangle([.75, .375, .5625, .375, .6875, .25]);
    drawTriangle([-0.9375,.125, -.75,0, -.6875, .25]);
    drawTriangle([0.9375,.125, .75,0, .6875, .25]);
    drawTriangle([-0.9375, -.25, -.75,0, -.625, -.25]);
    drawTriangle([0.9375,-.25, .75,0, .625, -.25]);
}

function drawHat(){

    gl.uniform4f(u_FragColor, 0.102,.469,.556,alpha);
    drawTriangle([0,.25,  -.25, .4375,   .25, .4375,]);
    drawTriangle([0, .6875,  -.25, .4375,   .25, .4375,]);

    gl.uniform4f(u_FragColor, 0.113,.6,.643, alpha);
    drawTriangle([0,.25,  -.375, .4375,  -.25, .625]);
    drawTriangle([0,.25,  .375, .4375,  .25, .625]);
}

function drawFace(){
    gl.uniform4f(u_FragColor, .0 ,0.0, 0.2,alpha);
    drawTriangle([-0.3125, .1875,  -.5, .25,   -.5625, .1875,]);
    drawTriangle([0.3125, .1875,  .5, .25,   .5625, .1875,]);

    drawTriangle([-.125, 0.0625, -.25, .125, -.25, .0925 ]);
    drawTriangle([.125, 0.0625, .25, .125, .25, .0925 ]);
    
    drawTriangle([0, 0, -.375, -.125 , 0, -.0625 ]);
    drawTriangle([0, 0, .375, -.125 , 0, -.0625 ]);

    drawTriangle([-0.5625, 0, -.25, -.25 ,  .1875 , -.25 ]);
    drawTriangle([0.5625, 0, .25, -.25 ,  -.1875 , -.25 ]);

    drawTriangle([0, -.1875, -.375, -.125 , 0, -.0625 ]);
    drawTriangle([0, -.1875, .375, -.125 , 0, -.0625 ]);

    gl.uniform4f(u_FragColor, .557 ,0.239, 0.196,alpha);
    drawTriangle([-.25, -.25, 0, -.125, .25, -.25])


}
function drawFur(){
    gl.uniform4f(u_FragColor, 0.99,.96,.91,alpha);
    drawTriangle([-0.75, -.25, -.75, -0.5625 , .75, -.25 ]);
    drawTriangle([0.75, -.25, .75, -0.5625 , -.75, -.5625 ]);

    drawTriangle([-0.5625, -.25, -.5625, -0.1875 , -.375, -.25 ]);
    drawTriangle([0.5625, -.25, .5625, -0.1875 , .375, -.25 ]);

    drawTriangle([-.625, -.25, -.8125, -.25, -.75, -.375 ]);
    drawTriangle([.625, -.25, .8125, -.25, .75, -.375 ]);

    drawTriangle([-.75, -.375, -.875, -.5625, -.75, -.5625 ]);
    drawTriangle([.75, -.375, .875, -.5625, .75, -.5625 ]);

    drawTriangle([-.625, -.5625, -.5, -.625, -.25, -.5625 ]);
    drawTriangle([.625, -.5625, .5, -.625, .25, -.5625 ]);

    drawTriangle([-.25, -.5625, -.125, -.625, 0, -.5625 ]);
    drawTriangle([.25, -.5625, .125, -.625, 0, -.5625 ]);

}
function drawBody(){
    gl.uniform4f(u_FragColor, 0.113,.6,.643, alpha);

    drawTriangle([-.6875, -.5625, -.6875, -1 , .6875, -.5625 ]);
    drawTriangle([.6875, -.5625, .6875, -1 , -.6875, -1 ]);

    drawTriangle([-.6875, -.5625, -.9375, -1, -.6875, -1 ]);
    drawTriangle([.6875, -.5625, .6875, -1 , .9375, -1 ]);

}
function drawSun(){
    gl.uniform4f(u_FragColor, 929,.784,0.326,alpha);

    drawTriangle([0, .875, -.0625, 1 , 0, 1 ]);
    drawTriangle([0, .875, .0625, 1 , 0, 1 ]);

    drawTriangle([0, .875, -.0625, 1 , -.125, .9375 ]);
    drawTriangle([0, .875, .0625, 1 , .125, .9375 ]);

    drawTriangle([0, .875, -.125, .9375 , -.125, .8125 ]);
    drawTriangle([0, .875, .125, .9375 , .125, .8125 ]);

    drawTriangle([0, .875, -.125, .875 , -.125, .8125 ]);
    drawTriangle([0, .875, .125, .875 , .125, .8125 ]);

    drawTriangle([0, .875, -.0625, .75 , -.125, .8125 ]);
    drawTriangle([0, .875, .0625, .75, .125, .8175 ]);

    drawTriangle([0, .875, -.0625, .75 , 0, .75]);
    drawTriangle([0, .875, .0625, .75, 0, .75 ]);


}

function drawSunRays(){
    gl.uniform4f(u_FragColor, .89,.843, 0.6,alpha);
//left
    //drawTriangle([-.125, .9375, -.125, 1 , -.0625, 1 ]);

    drawTriangle([-.125, .9375, -.5625, 1 , -.1875, 1 ]);
    drawTriangle([-.125, .875, -.5625, 1 , -.125, .9375 ]);
    
    drawTriangle([-.125, .875, -1, .9375 , -1, .6875 ]);
    drawTriangle([-.125, .875, -.125, .8125 , -1, .6875 ]);

    drawTriangle([-.125, .8125, -1, .375 , -1, -.1875 ]);
    drawTriangle([-.125, .8125, -1, -.1875 , -.0625, .75 ]);

    drawTriangle([-.0625, .75, -1,-1, -.5, -1] );
    drawTriangle([-.0625, .75, 0, .75, -.5, -1] );
 //right
 //drawTriangle([.125, .9375, .125, 1 , .0625, 1 ]);


    drawTriangle([.125, .9375,.5625, 1 , .1875, 1 ]);
    drawTriangle([.125, .875, .5625, 1 , .125, .9375 ]);
 
    drawTriangle([.125, .875, 1, .9375 , 1, .6875 ]);
    drawTriangle([.125, .875, .125, .8125 , 1, .6875 ]);

    drawTriangle([.125, .8125, 1, .375 , 1, -.1875 ]);
    drawTriangle([.125, .8125, 1, -.1875 , .0625, .75 ]);

    drawTriangle([.0625, .75, 1,-1, .5, -1] );
    drawTriangle([.0625, .75, 0, .75, .5, -1] );
}
