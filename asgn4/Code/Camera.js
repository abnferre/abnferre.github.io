class Camera{
    constructor(){
        this.fov = 60;
        
        this.eye=new Vector3([0,.5,-4]);
        this.at= new Vector3([0,1,0]);
        this.up= new Vector3([0,1,0]);
       
        //this.viewMatrix.setLookAt(eye.elements[0], eye.elements[0], up.elements[0])
        //this.projectionMatrix = new Vector4();
        //this.projectionMatrix.setPerspective(fov, canvas.width/canvas.height, 0.1,1000)
    }


    forward(){
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        this.at.add(f);
        this.eye.add(f);
    }
    back(){
        let b = new Vector3();
        b.set(this.at);
        b.sub(this.eye);
        b.normalize();

        this.at.add(b);
        this.eye.sub(b);
    
    }
    left(){
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        let s = new Vector3();
        s = Vector3.cross(this.up, f);
        s.normalize();

        this.at.add(s);
        this.eye.add(s);
    }
    right(){
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        let s = new Vector3();
        s = Vector3.cross(f, this.up);
        s.normalize();

        this.at.add(s);
        this.eye.add(s);
    }
    panLeft(){
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let f_prime = new Vector3();
        f_prime = rotationMatrix.multiplyVector3(f);
        this.at = f_prime.add(this.eye);

    }
    panRight(){
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let f_prime = new Vector3();
        f_prime = rotationMatrix.multiplyVector3(f);
        this.at = f_prime.add(this.eye);

    }

}