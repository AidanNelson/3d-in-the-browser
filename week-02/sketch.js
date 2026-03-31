/*
3D in the Browser

Local development with VS Code & LiveServer
Adding image or video textures to your materials
Using physical materials with environment maps
If we have time: 
Adding shadows
Antialiasing


*/

import * as THREE from "three";

// console.log(THREE);





let scene = new THREE.Scene();

// create texture loader and load a texture
let myTextureLoader = new THREE.TextureLoader();
let myCheckerboardTex = myTextureLoader.load('./checkerboard.jpg');
console.log(myCheckerboardTex);

// tell three.js that this texture should wrap
myCheckerboardTex.wrapS = THREE.RepeatWrapping;
myCheckerboardTex.wrapT = THREE.RepeatWrapping;
myCheckerboardTex.repeat.set(1,1);

let sphereGeo = new THREE.SphereGeometry(2,16,18);
let sphereMat = new THREE.MeshStandardMaterial({ map: myCheckerboardTex, roughnessMap: myCheckerboardTex });
let mesh = new THREE.Mesh(sphereGeo, sphereMat);

// add our sphere to our scene / world
scene.add(mesh);

// add a video material
let videoEl = document.getElementById('oceanVideo')
let videoTex = new THREE.VideoTexture(videoEl);

let oceanGeo = new THREE.BoxGeometry(40,0.1,40);
let oceanMat = new THREE.MeshStandardMaterial({map: videoTex});
let oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
scene.add(oceanMesh);

// const geometry = new THREE.IcosahedronGeometry();
// const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
// const icosahedron = new THREE.Mesh( geometry, material );
// scene.add( icosahedron );
// icosahedron.position.set(-2,2,2);

let gridHelp = new THREE.GridHelper(10,10);
scene.add(gridHelp);

const axesHelper = new THREE.AxesHelper( 2 );
scene.add( axesHelper );


// create and add an ambient light
let ambLight = new THREE.AmbientLight(0xffffff, 1);
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

function draw(){

    renderer.render(scene, cam);

    window.requestAnimationFrame(draw);
}
draw();


// /*
// 3D in the Browser

// Although we're using the p5.js editor, this is an example of a three.js scene.  

// It includes a scene with a camera, made visible with a renderer.  

// Finally, it adds a sphere to the scene.

// And renders this in a draw loop.

// */

// import * as THREE from "three";

// // console.log(THREE);

// let scene = new THREE.Scene();

// let sphereGeo = new THREE.SphereGeometry(1,16,18);
// let sphereMat = new THREE.MeshStandardMaterial({color: new THREE.Color(0xff00ff)});
// let mesh = new THREE.Mesh(sphereGeo, sphereMat);

// // add our sphere to our scene / world
// scene.add(mesh);


// // create a texture loader:
// let textureLoader = new THREE.TextureLoader();
// let myTexture = textureLoader.load("./checkerboard.jpg");

// // change the texture parameters if you like!
// myTexture.wrapS = THREE.RepeatWrapping;
// myTexture.wrapT = THREE.RepeatWrapping;
// myTexture.repeat.set(1, 1);


// const geometry = new THREE.IcosahedronGeometry(0.5,1);
// const material = new THREE.MeshBasicMaterial( { map:myTexture } );
// const icosahedron = new THREE.Mesh( geometry, material );
// icosahedron.castShadow = true;
// scene.add( icosahedron );
// icosahedron.position.set(-2,2,2);

// let oceanVideo = document.getElementById( 'oceanVideo' );
// let oceanTex = new THREE.VideoTexture( oceanVideo );
// oceanTex.wrapS = THREE.RepeatWrapping;
// oceanTex.wrapT = THREE.RepeatWrapping;
// oceanTex.repeat.set(50,50);
// let ground = new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshPhysicalMaterial({map: oceanTex}));
// scene.add(ground);
// ground.rotateX(-Math.PI/2);
// ground.receiveShadow = true;



// let gridHelp = new THREE.GridHelper(10,10);
// scene.add(gridHelp);

// const axesHelper = new THREE.AxesHelper( 2 );
// scene.add( axesHelper );


// // create and add an ambient light
// let ambLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambLight);
// // let dirLight = new THREE.DirectionalLight(0xffffff,2);
// // scene.add(dirLight);

// // add a directional light
// let myDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.85);
// myDirectionalLight.position.set(20, 20, 0);
// myDirectionalLight.lookAt(0, 0, 0);
// scene.add(myDirectionalLight);
// myDirectionalLight.castShadow = true;
// //Set up shadow properties for the light
// myDirectionalLight.shadow.mapSize.width = 512; // default
// myDirectionalLight.shadow.mapSize.height = 512; // default
// myDirectionalLight.shadow.camera.near = 0.1; // default
// myDirectionalLight.shadow.camera.far = 100; // default

// // create out camera and renderer
// let renderer = new THREE.WebGLRenderer();
// renderer.shadowMap.enabled = true;
// renderer.setSize(window.innerWidth,window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // create our camera
// let aspectRatio = window.innerWidth / window.innerHeight;
// let cam = new THREE.PerspectiveCamera(60,aspectRatio,0.1,1000);
// cam.position.set(5,1,5)
// cam.lookAt(0,0,0);


// // ask our renderer to render the scene
// renderer.render(scene, cam);

// function draw(){
//     icosahedron.position.x += 0.01;

//     renderer.render(scene, cam);

//     window.requestAnimationFrame(draw);
// }
// draw();