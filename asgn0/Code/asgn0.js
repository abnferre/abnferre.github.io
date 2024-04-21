//asgn0.js
function areaTriangle(v1,v2){
    let v3 = Vector3.cross(v1,v2);
    area = 1/2 * v3.magnitude();
    console.log("Area of the triangle: " + area);
}
function angleBetween(v1,v2){
    let dot = Vector3.dot(v1,v2);
    let m1 = v1.magnitude();
    let m2 = v2.magnitude();
    let angle = dot / (m1*m2);
    angle = Math.acos(angle) * 180/Math.PI;
    console.log("Angle: " + angle);
}
function drawVector(v, color){
    vd = new Vector3();
    vd.set(v);
    vd.mul(20);
    ctx.strokeStyle = color;
    ctx.beginPath();
    midy = canvas.height/2;
    midx = canvas.width/2;
    ctx.moveTo(midy, midx);
    ctx.lineTo( midy+vd.elements[0],midx-vd.elements[1]);
    ctx.stroke();
}

function handleDrawEvent(){
    let v1x = document.getElementById("x1").value;
    let v1y = document.getElementById("y1").value;
    v1 = new Vector3([v1x, v1y]);
    let v2x = document.getElementById("x2").value;
    let v2y = document.getElementById("y2").value;
    v2 = new Vector3([v2x, v2y]);
    ctx.fillRect(0,0, canvas.width, canvas.height);
    drawVector(v1,"red");
    drawVector(v2,"blue");
}

function handleDrawOperationEvent(){
    let v1x = document.getElementById("x1").value;
    let v1y = document.getElementById("y1").value;
    v1 = new Vector3([v1x, v1y]);
    let v2x = document.getElementById("x2").value;
    let v2y = document.getElementById("y2").value;
    v2 = new Vector3([v2x, v2y]);
    ctx.fillRect(0,0, canvas.width, canvas.height);
    drawVector(v1,"red");
    drawVector(v2,"blue");
    
    let operation = document.getElementById("operation-select").value;
    let scalar = document.getElementById("Scalar").value;
    v3 = new Vector3();
    v3.set(v1);
    v4 = new Vector3();
    v4.set(v2);
    switch(operation){
        case "Add":
            v3.add(v2);
            drawVector(v3, "green");
            break;
        case "Subtract":
            v3.sub(v2);
            drawVector(v3, "green");
            break;
        case "Multiply":
            v3.mul(scalar);
            v4.mul(scalar);
            drawVector(v3, "green");
            drawVector(v4, "green");
            break;
        case "Divide":
            v3.div(scalar);
            v4.div(scalar);
            drawVector(v3, "green");
            drawVector(v4, "green");
            break;
        case "Magnitude":
            console.log("Magnitude v1: " + v1.magnitude());
            console.log("Magnitude v2: " + v2.magnitude());
            break;
        case "Normalize":
            v3.normalize();
            v4.normalize();
            drawVector(v3, "green");
            drawVector(v4, "green");
            break;
        case "AngleBetween":
            angleBetween(v1,v2);
            break;
        case "Area":
            areaTriangle(v1,v2);
            break;
    }
    
}
function main(){
    //Retrieve <canvas> element
    canvas = document.getElementById('example');
    if(!canvas){
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    //get the rendering context for 2DCG
    ctx = canvas.getContext('2d');

    //Draw a blue rectangle
    ctx.fillStyle = 'rgba(0,0,0,1.0)'; //set a blue color
    ctx.fillRect(0,0,canvas.width,canvas.height); //fill a rectangle with the color
   
    
}
