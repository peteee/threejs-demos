import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// RENDERER
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x000000, .5 ); // color, opacity
document.body.appendChild( renderer.domElement );

// CAMERA
// with controls
const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
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

// Plane 2
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



//////////////// RESIZE //////////////////////////////
window.addEventListener( 'resize', onWindowResize );
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


// ADD LIGHTS TO SCENE 

scene.add( light );
scene.add( pointLight );

/// ANIMATE & RENDER EVERYTHING
renderer.setAnimationLoop( animation );

function animation( time ) {
    // plane.rotation.y += 5;
    renderer.render( scene, camera );

}
