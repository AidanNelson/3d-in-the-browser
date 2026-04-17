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
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// create some global variables that we can reference throughout our scene
let scene, renderer, camera;

let torus;
let startingTime;

let cameraPositions = [
    [
        247.96030383017373,
        82.19391894617156,
        -154.2235938427441
    ],
    [
        -101.4885384764751,
        37.62446520101608,
        -12.62715226219143
    ],
    [
        -11.305017377074838,
        -1.4528718895194743,
        6.26673159617466
    ],
    [
        3.9042946621301455,
        -1.2857190144208184,
        -1.7583251819876422
    ],
    [
        0.00014447678563108456,
        180.97966595663897,
        -0.00010904257191608994
    ]
];
let vectors = [];
for (let i = 0; i < cameraPositions.length; i++){
    vectors.push(new THREE.Vector3(cameraPositions[i][0], cameraPositions[i][1], cameraPositions[i][2]))
}
console.log(vectors);

let cameraCurve = new THREE.CatmullRomCurve3(vectors)

let cameraMovementDuration = 5000; // 20 seconds


let points = [];



scene = new THREE.Scene();
scene.background = new THREE.Color(0xff00ff);

startingTime = Date.now();

// create out camera and renderer
renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// create our camera
let aspectRatio = window.innerWidth / window.innerHeight;
camera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000);
camera.position.set(5, 5, 5)
camera.lookAt(0, 0, 0);

// add things into our 3d scene
addObjects();

// ask our renderer to render the scene 
renderer.render(scene, camera);

// create orbit controls and a grid and axis helper for debugging
// let controls = new OrbitControls(camera, renderer.domElement);
// let gridHelp = new THREE.GridHelper(10, 10);
// scene.add(gridHelp);
// let axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

document.addEventListener('keydown', function(ev){
    if (ev.key === "p"){
        console.log('position: ',camera.position);
        points.push([camera.position.x, camera.position.y, camera.position.z])
        console.log(points);
    }
});



// create and start a draw loop
function draw() {

    updateObjects();

    moveCameraAlongCurve();



    renderer.render(scene, camera);
    window.requestAnimationFrame(draw);
}
draw();




function moveCameraAlongCurve(){
    let elapsedTime = Date.now() - startingTime;

    // gives us a number between 0 and 1 for how far long along the duration
    let t = Math.min(1,Math.max(0,elapsedTime / cameraMovementDuration)); 

    // what is the point in 3d space at time t
    let positionAtTime = cameraCurve.getPointAt(t);

    camera.position.copy(positionAtTime);
    camera.lookAt(0,0,0);
}


// this is a function to populate our 3d scene
// using a function helps contain all of these elements 
// and lets us quickly toggle them on and off

function addObjects() {

    // create and add an ambient light and directional light
    let ambLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambLight);
    let dirLight = new THREE.DirectionalLight(0xffffff, 2);
    scene.add(dirLight);

    // import a model
    // "Ancient Corinth - Peirene Fountain" (https://skfb.ly/onCKZ) by fuzzelhjb is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
    // note that we had to "import" this loader at the top of this sketch to make it available
    let gltfModelLoader = new GLTFLoader();
    gltfModelLoader.load('ancient_corinth_-_peirene_fountain.glb', function (model) {
        console.log(model);
        scene.add(model.scene);
    });

    // add some other elements
    let torusGeo = new THREE.TorusKnotGeometry(1, 0.2, 64, 64, 2, 3);
    let torusMat = new THREE.MeshStandardMaterial();
    torus = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torus);

}

function updateObjects(){
    torus.rotateX(0.001);
    torus.rotateY(0.005);
}