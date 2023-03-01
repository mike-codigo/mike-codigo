import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';
import { OrbitControls } from './OrbitControls.js';


let camera, controls, scene, renderer, clock, mixer;

	init();
	//render(); // remove when using next line for animation loop (requestAnimationFrame)
	animate();

	function init() {

clock = new THREE.Clock();
		scene = new THREE.Scene();
		scene.background = null;
		scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

		renderer = new THREE.WebGLRenderer( { alpha: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( 300, 350 );
renderer.setClearColor( 0x000000, 0 );
		document.querySelector("#obj_murilo").appendChild( renderer.domElement );

		camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.set( 0, 0, 60 );

		// controls

		controls = new OrbitControls( camera, renderer.domElement );
		controls.listenToKeyEvents( window ); // optional

		//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

		controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		controls.dampingFactor = 0.05;

		controls.screenSpacePanning = false;

		controls.minDistance = 2;
		controls.maxDistance = 2;

		controls.maxPolarAngle = Math.PI / 2;

		const loader = new GLTFLoader();

	loader.load( '../obj/scene.gltf', function ( gltf ) {

	const model = gltf.scene
	model.position.setY(-0.9);
	scene.add( model );

	mixer = new THREE.AnimationMixer( gltf.scene );

	gltf.animations.forEach( ( clip ) => {
	
	mixer.clipAction( clip ).play();
	
} );

	});

		// lights

		const dirLight1 = new THREE.DirectionalLight( 0xffffff );
		dirLight1.position.set( 1, 1, 1 );
		scene.add( dirLight1 );

		const dirLight2 = new THREE.DirectionalLight( 0x002288 );
		dirLight2.position.set( - 1, - 1, - 1 );
		scene.add( dirLight2 );

		const ambientLight = new THREE.AmbientLight( 0x222222 );
		scene.add( ambientLight );

		//

		window.addEventListener( 'resize', onWindowResize );

	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function animate() {

		requestAnimationFrame( animate );

var delta = clock.getDelta();

if ( mixer ) mixer.update( delta );

		controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

		render();

	}

	function render() {

		renderer.render( scene, camera );

	}