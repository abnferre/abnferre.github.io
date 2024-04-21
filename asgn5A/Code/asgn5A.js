import * as THREE from 'three';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
	renderer.setSize(704, 352);
	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 5;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 4;

	const scene = new THREE.Scene();

	{

		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( - 1, 2, 4 );
		scene.add( light );

	}

	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

	function makeInstance( geometry, url, x ) {
		
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

		return cube;
		}
		else{
			const texture = loader.load( url );
			texture.colorSpace = THREE.SRGBColorSpace;
			const material = new THREE.MeshPhongMaterial( { map: texture } );
			const cube = new THREE.Mesh( geometry, material );
			scene.add( cube );
			cube.position.x = x;

		return cube;
		}
		
		

		

	}

	const cubes = [
		makeInstance( geometry, '/asgn5A/Code/dirt texture.jpg', 0 ),
		makeInstance( geometry, '/asgn5A/Code/wood.jpg', - 4 ),
		makeInstance( geometry, 'custom', 2 ),
	];

	function render( time ) {

		time *= 0.001; // convert time to seconds

		cubes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
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
