import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js';

// RENDERER
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x000000, .5 ); // color, opacity
document.body.appendChild( renderer.domElement );

// CAMERA
// with controls
const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.set( 55, 2, 48 );

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

// SCENE
const scene = new THREE.Scene();

// CONTENT
// Light
const light = new THREE.AmbientLight( 0x404040 ); // soft white light
const pointLight = new THREE.PointLight(0xffffff, 0.8);
pointLight.position.set(-30, 10, 30);

/////// INTERACTIVE //////////////////////

/**
 * make things clickable part 1
 */

let raycaster = new THREE.Raycaster();
let INTERSECTED;
let theta = 0;
window.pointer = new THREE.Vector2();
const radius = 100;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

document.addEventListener( 'click', onPointerMove );
function onPointerMove( event ) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

/**
 * 3D Objects
 */

// custom scale factor... optional
let planeScaler = 1.777;

// Plane 1
// Adding textures
const texture = new THREE.TextureLoader().load( 'img/about-me.png' );
const geometry = new THREE.PlaneGeometry( 30/planeScaler, 40/planeScaler );
const material = new THREE.MeshPhongMaterial( {
    /*color: 0xffff00, */
    side: THREE.DoubleSide, 
    map: texture, 
    shininess: 55, 
    reflectivity: 0.4
} );
const plane = new THREE.Mesh( geometry, material );
plane.rotation.y = 0;
plane.translateX(20);
scene.add( plane );

// Plane 2
// Adding textures
const texture2 = new THREE.TextureLoader().load( 'textures/pexels-michael-steinberg-342946.jpg' );
const geometry2 = new THREE.PlaneGeometry( 40/planeScaler, 30/planeScaler );
const material2 = new THREE.MeshPhongMaterial( {
    /*color: 0xffff00, */
    side: THREE.DoubleSide, 
    map: texture2, 
    shininess: 55, 
    reflectivity: 0.4
} );
const plane2 = new THREE.Mesh( geometry2, material2 );
//plane2.rotation.y = -3;
plane2.translateZ(-20);
plane2.translateY(10);
plane2.translateX(-15);
scene.add( plane2 );

// Plane 3
// Adding textures
const texture3 = new THREE.TextureLoader().load( 'textures/pexels-monicore-135157.jpg' );
const geometry3 = new THREE.PlaneGeometry( 40/planeScaler, 30/planeScaler );
const material3 = new THREE.MeshPhongMaterial( {
    /*color: 0xffff00, */
    side: THREE.DoubleSide, 
    map: texture3, 
    shininess: 55, 
    reflectivity: 0.4
} );
const plane3 = new THREE.Mesh( geometry3, material3 );
//plane2.rotation.y = -3;
plane3.translateZ(-10);
plane3.translateY(-5);
plane3.translateX(-5);
scene.add( plane3 );




/**
 * Collada/DAE File (from Blender)
 */

// loading manager
let smoothcube;
const loadingManager = new THREE.LoadingManager( function () {

    smoothcube.scale.set(8,8,8);
    smoothcube.position.set(-40, 0, 5)

    // shadows
    smoothcube.castShadow = true;
    smoothcube.receiveShadow = false;

    //smoothcube.rotateX(90);
    //scene.add( smoothcube );

} );

// collada

const daeloader = new ColladaLoader( loadingManager );
daeloader.load( './models/CUBE2.dae', function ( collada ) {

    smoothcube = collada.scene;

} );





/**
 * FLOOR
 */

const texture4 = new THREE.TextureLoader().load( 'textures/TexturesCom_Sand_Muddy2_header.jpg' );
const geometry4 = new THREE.PlaneGeometry( 400, 400 );
const material4 = new THREE.MeshPhongMaterial( {
    /*color: 0xffff00, */
    side: THREE.DoubleSide, 
    map: texture4, 
    //bumpMap: texture4,
    shininess: 55, 
    reflectivity: 1,
    depthWrite: false,
    //blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.5
} );
const floor = new THREE.Mesh( geometry4, material4 );
floor.position.set(0,-23.9,0);
floor.rotation.x = Math.PI / 2;
scene.add( floor );


const geometry5 = new THREE.CircleGeometry( 40, 64 );
const groundMirror = new Reflector( geometry4, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0xb5b5b5,
} );
groundMirror.position.y = -24;
groundMirror.rotateX( - Math.PI / 2 );
scene.add( groundMirror );

/**
 * SVG
 */

// instantiate a loader
const loader = new SVGLoader();

// load a SVG resource
loader.load(
	// resource URL
    'img/Logo_NIKE.svg',
	//'https://threejs.org/examples/models/svg/tiger.svg',
	// called when the resource is loaded
	function ( data ) {

		const paths = data.paths;
		const group = new THREE.Group();

		for ( let i = 0; i < paths.length; i ++ ) {

			const path = paths[ i ];

			const material = new THREE.MeshPhongMaterial( {
		        color: path.color,
				side: THREE.DoubleSide,
				depthWrite: true,
                transparent: false,
                shininess: 15, 
                reflectivity: 0.4
			} );

			const shapes = SVGLoader.createShapes( path );

			for ( let j = 0; j < shapes.length; j ++ ) {

				const shape = shapes[ j ];
				const geometry = new THREE.ShapeGeometry( shape );
				const mesh = new THREE.Mesh( geometry, material );				

                mesh.scale.set(0.07,-0.07,0.07)
                mesh.position.set(-20,30,5)
                mesh.rotation.y = 0
                mesh.rotation.z = 0
                mesh.rotation.x = 0
                
                // shadows
                mesh.castShadow = true;
                mesh.receiveShadow = false;
                
                group.add( mesh );
			}

		}

		scene.add( group );
        


	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);




//////////////// RESIZE //////////////////////////////
window.addEventListener( 'resize', onWindowResize );
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    groundMirror.getRenderTarget().setSize(
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio
    );

    renderer.setSize( window.innerWidth, window.innerHeight );

}




/**
 * Shadows
 */

// enabling shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

// enabling casting shadows
//light.castShadow = true;
pointLight.castShadow = true;


plane.castShadow = true;
plane.receiveShadow = false;

plane2.castShadow = true;
plane2.receiveShadow = false;

plane3.castShadow = true;
plane3.receiveShadow = false;


floor.castShadow = false;
floor.receiveShadow = true;


// ADD LIGHTS TO SCENE 
scene.add( light );
scene.add( pointLight );



/**
 * Trigger Actions
 */

function triggerAction(objId) {
    let panel1 = document.getElementById("panel1");
    panel1.classList.remove("slide-in");
    let panel2 = document.getElementById("panel2");
    panel2.classList.remove("slide-in");


    if(objId==13) {
        console.log("ABOUT ME");
        scene.add( smoothcube );
        //top.location.href = "https://facebook.com";

    }
    if(objId==14) {
        console.log("Portfolio Item 1");
        panel1.classList.add("slide-in");
        scene.remove( smoothcube );
    }
    if(objId==15) {
        console.log("Portfolio Item 2");
        panel2.classList.add("slide-in");
        scene.remove( smoothcube );

    }

}






/// ANIMATE & RENDER EVERYTHING
renderer.setAnimationLoop( animation );

function animation( time ) {
    //plane.rotation.y += 5;
    
    //renderer.render( scene, camera );
    render();
}



function render() {
    camera.lookAt( scene.position );

    camera.updateMatrixWorld();

    /**
     * make things clickable part 2
     */

    // find intersections
    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects( scene.children, false );
    // console.log(intersects)
    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            window.intersected = INTERSECTED;
            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            //INTERSECTED.material.emissive.setHex( 0xff0000 );
            console.log("you clicked the object: " + INTERSECTED.id);
            pointer.x, pointer.y = 15000;
            triggerAction(INTERSECTED.id)

        }

    } else {

        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

        INTERSECTED = null;

    }
    renderer.render( scene, camera );
}
