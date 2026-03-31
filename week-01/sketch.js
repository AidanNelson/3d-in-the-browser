/*
3D in the Browser

Although we're using the p5.js editor, this is an example of a three.js scene.  

It includes a scene with a camera, made visible with a renderer.  

Finally, it adds a sphere to the scene.

And renders this in a draw loop.

*/

import * as THREE from "three";

// console.log(THREE);

let scene = new THREE.Scene();

let sphereGeo = new THREE.SphereGeometry(1,16,18);
let sphereMat = new THREE.MeshStandardMaterial({color: new THREE.Color(0xff00ff)});
let mesh = new THREE.Mesh(sphereGeo, sphereMat);

// add our sphere to our scene / world
scene.add(mesh);

const geometry = new THREE.IcosahedronGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const icosahedron = new THREE.Mesh( geometry, material );
scene.add( icosahedron );
icosahedron.position.set(-2,2,2);

let gridHelp = new THREE.GridHelper(10,10);
scene.add(gridHelp);

const axesHelper = new THREE.AxesHelper( 2 );
scene.add( axesHelper );


// create and add an ambient light
let ambLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambLight);
let dirLight = new THREE.DirectionalLight(0xffffff,2);
scene.add(dirLight);


// create out camera and renderer
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

// create our camera
let aspectRatio = window.innerWidth / window.innerHeight;
let cam = new THREE.PerspectiveCamera(60,aspectRatio,0.1,1000);
cam.position.set(5,5,5)
cam.lookAt(0,0,0);


// ask our renderer to render the scene
renderer.render(scene, cam);






































// first import the library
// import * as THREE from "three";

// console.log("hello! this is a console statement.");

// let scene = new THREE.Scene();
// let camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
// camera.position.set(3, 2, 5);
// camera.lookAt(0, 0, 0);

// let renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // add a 3d object to our scene
// let geo = new THREE.BoxGeometry(1, 1, 1);
// let mat = new THREE.MeshStandardMaterial({
//   color: new THREE.Color(0xffffff),
// });
// let mesh = new THREE.Mesh(geo, mat);
// scene.add(mesh);

// // create and add lights
// let dirLight = new THREE.DirectionalLight(0xffffff, 0.75);
// scene.add(dirLight);
// let ambLight = new THREE.AmbientLight(0xffffff, 0.25);
// scene.add(ambLight);

// // change the background color
// scene.background = new THREE.Color(200, 0, 0);

// // render the scene
// renderer.render(scene, camera);
