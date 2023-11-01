import * as THREE from 'three';
//import { TextGeometry } from '../../three.js-master/';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';

/////// STATS /////////////////////////
let container, stats;
stats = new Stats();
container = document.createElement( 'div' );
document.body.appendChild( container );
container.appendChild( stats.dom );


// RENDERER
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// CAMERA
// simple & static
// const camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight, 1, 500 );
// camera.position.set( 0, 0, 100 );
// camera.lookAt( 0, 0, 0 );

// with controls
const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
camera.position.set( 55, 2, 48 );

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = false;
controls.enableDamping = true;



// SCENE
const scene = new THREE.Scene();


//Load background texture
const bgLoader = new THREE.TextureLoader();
bgLoader.load('textures/pexels-monicore-135157.jpg' , function(img) { scene.background = img;  });



// FOG
scene.fog = new THREE.Fog( 0xcccccc, 30, 175 );


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
const pointer = new THREE.Vector2();
const radius = 100;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );
document.addEventListener( 'click', onPointerMove );
function onPointerMove( event ) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}


/**
 * 3D Objects
 */


// Lines
const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

const points = [];
points.push( new THREE.Vector3( - 20, 0, 0 ) );
points.push( new THREE.Vector3( 0, 10, 0 ) );
points.push( new THREE.Vector3( 10, 0, 0 ) );
points.push( new THREE.Vector4( 14, 10, 0 ) );

const geometry = new THREE.BufferGeometry().setFromPoints( points );

const line = new THREE.Line( geometry, material );


// Adding textures
const texture = new THREE.TextureLoader().load( 'textures/poem.png' );
const texture2 = new THREE.TextureLoader().load( 'textures/pexels-monicore-135157.jpg' );
texture2.mapping = THREE.EquirectangularReflectionMapping;

// Box
const geometry2 = new THREE.BoxGeometry( 9, 9, 9 );
//const material2 = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
//const material2 = new THREE.MeshNormalMaterial();
//const material2 = new THREE.MeshPhongMaterial( { map: texture } );

const material2 = new THREE.MeshPhongMaterial( {
    map: texture,
//    bumpMap: texture,
//    bumpScale: 1,
    // color: 0x00ff00,
    shininess: 100,
    reflectivity: 1,
    envMap: texture2
    //wireframe: true
} );


const cube = new THREE.Mesh( geometry2, material2 );

// Sphere
const geometry3 = new THREE.SphereGeometry( 5, 30, 12 );
const material3 = new THREE.MeshPhongMaterial( { color: 0xffff00 } );
const sphere = new THREE.Mesh( geometry3, material3 );
// Move Sphere
sphere.translateZ( 14 );

// Torus
const geometry4 = new THREE.TorusGeometry( 5, 2, 16, 100 );
const material4 = new THREE.MeshPhysicalMaterial( { color: 0xffff00 } );
const torus = new THREE.Mesh( geometry4, material4 );

// Move Torus
torus.translateZ( -14 );

//////////////// RESIZE //////////////////////////////
window.addEventListener( 'resize', onWindowResize );
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
/////////////////////////////////////////////


/////////////////////////////////////////////////


// ADD TO SCENE & RENDER EVERYTHING
//scene.add( line );
scene.add( cube );
scene.add( sphere );
scene.add( torus );

scene.add( light );
scene.add( pointLight );


renderer.setAnimationLoop( animation );
//renderer.render( scene, camera );

function animation( time ) {

    cube.rotation.x = time / 2000;
    cube.rotation.y = time / 1000;

    sphere.rotation.z += 0.3;
    torus.rotation.y = time / 2000;
    stats.update();
    //renderer.render( scene, camera );
    render();

}

function render() {

    // theta += 0.1;

    // camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
    // camera.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
    // camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
    camera.lookAt( scene.position );

    camera.updateMatrixWorld();

    /**
     * make things clickable part 2
     */

    // find intersections
    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects( scene.children, false );

    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0xff0000 );
            console.log("you clicked the box")

        }

    } else {

        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

        INTERSECTED = null;

    }

    renderer.render( scene, camera );

}