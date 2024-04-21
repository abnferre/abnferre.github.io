import * as THREE from '/three';
import {OBJLoader} from '/three/addons/loaders/OBJLoader.js';
import {MTLLoader} from '/three/addons/loaders/MTLLoader.js';


import { OrbitControls } from '/three/addons/controls/OrbitControls.js';
import { GUI } from '/three/addons/libs/lil-gui.module.min.js';


function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		canvas,
		alpha: true,
	  });
	renderer.setSize(704, 352);
	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 25;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set(0, 3, 10);

	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 3, 0 );
	controls.update();
	
	const scene = new THREE.Scene();
	scene.background = new THREE.Color( 'black' );
	

	class ColorGUIHelper {
		constructor(object, prop) {
		  this.object = object;
		  this.prop = prop;
		}
		get value() {
		  return `#${this.object[this.prop].getHexString()}`;
		}
		set value(hexString) {
		  this.object[this.prop].set(hexString);
		}
	  }

	class MinMaxGUIHelper {
		constructor(obj, minProp, maxProp, minDif) {
		  this.obj = obj;
		  this.minProp = minProp;
		  this.maxProp = maxProp;
		  this.minDif = minDif;
		}
		get min() {
		  return this.obj[this.minProp];
		}
		set min(v) {
		  this.obj[this.minProp] = v;
		  this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
		}
		get max() {
		  return this.obj[this.maxProp];
		}
		set max(v) {
		  this.obj[this.maxProp] = v;
		  this.min = this.min;  // this will call the min setter
		}
	  }

	  function updateCamera() {

		camera.updateProjectionMatrix();

	}

	
	

	

	
	{

		const planeSize = 40;

		const loader = new THREE.TextureLoader();
		const texture = loader.load( '/asgn5A/cubemap/floor.webp' );
		

		const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
		const planeMat = new THREE.MeshPhongMaterial( {
			map: texture,
			side: THREE.DoubleSide,
		} );
		const mesh = new THREE.Mesh( planeGeo, planeMat );
		mesh.rotation.x = Math.PI * - .5;
		scene.add( mesh );

	}

	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

	function makeInstance( geometry, url, x, y, z ) {
		
		const loader = new THREE.TextureLoader();
		if (url === 'custom'){
			const materials = [
				new THREE.MeshBasicMaterial({map: loadColorTexture('/asgn5A/Code/red.jpg')}),
				new THREE.MeshBasicMaterial({map: loadColorTexture('/asgn5A/Code/redamongus.webp')}),
				new THREE.MeshBasicMaterial({map: loadColorTexture('/asgn5A/Code/cyan.jpg')}),
				new THREE.MeshBasicMaterial({map: loadColorTexture('/asgn5A/Code/yellow.jpg')}),
				new THREE.MeshBasicMaterial({map: loadColorTexture('/asgn5A/Code/light blue.jpg')}),
				new THREE.MeshBasicMaterial({map: loadColorTexture('/asgn5A/Code/orange.jpg')}),
			
			  ];
			  const cube = new THREE.Mesh(geometry, materials);
 
			function loadColorTexture( path ) {
			const texture = loader.load( path );
  			texture.colorSpace = THREE.SRGBColorSpace;
  			return texture;
			}
			scene.add( cube );
			cube.position.x = x;
			cube.position.y = y;
			cube.position.z = z;

		return cube;
		}
		else{
			const texture = loader.load( url );
			texture.colorSpace = THREE.SRGBColorSpace;
			const material = new THREE.MeshPhongMaterial( { map: texture } );
			const cube = new THREE.Mesh( geometry, material );
			scene.add( cube );
			cube.position.x = x;
			cube.position.y = y;
			cube.position.z = z;

		return cube;
		}
	}
	
	//ALL THE SHAPES 
	//------------------------------------------------

	const radius = .5;  

const tubeRadius = .25;  

const radialSegments = 8;  

const tubularSegments = 24;  

const torusgeometry = new THREE.TorusGeometry(
	radius, tubeRadius,
	radialSegments, tubularSegments );
	
	const donuts= [
		makeInstance (torusgeometry, '', -3,3,-1),
	];


	const rectgeometry = new THREE.BoxGeometry( 3, boxHeight, boxDepth );
	const prisms = [
		makeInstance ( rectgeometry, '/asgn5A/Code/wood.jpg', 0, 1, 2 ),
	];
	const cubes = [
		makeInstance( geometry, '/asgn5A/Code/dirt texture.jpg', 4 , 2, -5 ),
		makeInstance( geometry, '/asgn5A/Code/wood.jpg', - 4, 5, -3 ),
		makeInstance( geometry, 'custom', 2, 3, 0 ),
	];
	{
		const mtlLoader = new MTLLoader();
		mtlLoader.load('/asgn5A/horseobj/horse.mtl', (mtl) => {
		  mtl.preload();
		  const objLoader = new OBJLoader();
		  objLoader.setMaterials(mtl);
		  objLoader.load('/asgn5A/horseobj/horse.obj', (root) => {
			scene.add(root);
		  });
		});
	  }

	  function makeXYZGUI(gui, vector3, name, onChangeFn) {
		const folder = gui.addFolder(name);
		folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
		folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
		folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
		folder.open();
	  }

	  {
		const color = 0xFFFFFF;
		const skyColor = 0xCC5500;  // light blue
		const groundColor = 0xB97A20;  // brownish orange
		const intensityDIR = 1;
		const intensityAMB = .94
		const intensityPNT = 120;
		const light = new THREE.HemisphereLight(skyColor, groundColor, intensityAMB);
		const lightd = new THREE.DirectionalLight( color, intensityDIR );
		const lightp = new THREE.PointLight(color, intensityPNT);
		const helper = new THREE.PointLightHelper(lightd);
		scene.add(helper);

		lightd.position.set(-.4, 10, -7.76);
		lightd.target.position.set(-1, 0, 0);
		lightp.position.set(0, 3.2, 0);

		scene.add(lightd.target);
		scene.add(lightd);
		scene.add(light);
		scene.add(lightp);


		function updateLight() {
			helper.update();
		  }

		const gui = new GUI();
		gui.add( camera, 'fov', 1, 180 ).onChange( updateCamera );
		const minMaxGUIHelper = new MinMaxGUIHelper( camera, 'near', 'far', 0.1 );
		gui.add( minMaxGUIHelper, 'min', 0.1, 50, 0.1 ).name( 'near' ).onChange( updateCamera );
		gui.add( minMaxGUIHelper, 'max', 0.1, 50, 0.1 ).name( 'far' ).onChange( updateCamera );
		gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor');
		gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor');
		gui.add(light, 'intensity', 0, 2, 0.01);

		gui.add(lightp, 'intensity', 0, 2, 0.01);
		gui.add(lightp, 'distance', 0, 40).onChange(updateLight);

		makeXYZGUI(gui, lightp.position, 'position', updateLight);
	}


	{
		const loader = new THREE.CubeTextureLoader();
		const texture = loader.load([
		  '/asgn5A/cubemap/walls.png', //posx
		  '/asgn5A/cubemap/walls.png', //negx
		  '/asgn5A/cubemap/sky.webp', //posy
		  '/asgn5A/cubemap/floor.webp', //negy
		  '/asgn5A/cubemap/walls.png', //posz
		  '/asgn5A/cubemap/walls.png', //negz
		]);
		scene.background = texture;
	  }

	  function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}

	function render( time ) {

		time *= 0.001; // convert time to seconds
		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}
		donuts.forEach( ( donut, ndx ) => {

			const speed = .5 + ndx * 2;
			const rot = time * speed;
			donut.rotation.x = rot;
			donut.rotation.y = rot;
		});
		cubes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .00001;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );
		
	

		renderer.render( scene, camera );

		requestAnimationFrame( render );
		

	}

	requestAnimationFrame( render );

	
}

main();
