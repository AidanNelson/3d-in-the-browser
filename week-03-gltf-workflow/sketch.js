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
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MapControls } from 'three/addons/controls/MapControls.js';

import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';


// create some global variables that we can reference throughout our scene
let scene, renderer, camera;

let torus;

scene = new THREE.Scene();
scene.background = new THREE.Color(0xff00ff);

// create out camera and renderer
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true; // tell three.js to use shadows
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// set environment
new HDRLoader().load('cedar_bridge_sunset_1_1k.hdr', function (envMap) {
    console.log('hdr environment map loaded!');
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envMap;
    // scene.background = envMap;
})

// load our model
new GLTFLoader().load('scene.glb', function (model) {
    console.log('model loaded!');
    console.log(model);
    scene.add(model.scene);

    // go through the entire model, if any of the model pieces are meshes,
    // mark them as shadow casters
    model.scene.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
        }
    })

})


// new HDRLoader().load('cedar_bridge_sunset_1_1k.hdr', function (envMap) {
//     console.log(envMap);
//     envMap.mapping = THREE.EquirectangularReflectionMapping;
//     scene.environment = envMap;
//     scene.background = envMap;
// });



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

let controls = new MapControls(camera, renderer.domElement);
// let gridHelp = new THREE.GridHelper(10, 10);
// scene.add(gridHelp);
// let axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

// create and start a draw loop
function draw() {

    // updateObjects();
    torus.rotateX(0.01);

    renderer.render(scene, camera);
    window.requestAnimationFrame(draw);
}
draw();

// this is a function to populate our 3d scene
// using a function helps contain all of these elements 
// and lets us quickly toggle them on and off

function addObjects() {

    // create and add an ambient light and directional light
    // let ambLight = new THREE.AmbientLight(0xffffff, 0.2);
    // scene.add(ambLight);
    let dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(10, 20, 30);
    dirLight.lookAt(0, 0, 0);
    scene.add(dirLight);
    dirLight.castShadow = true;

    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;



    // let myDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.85);
    // myDirectionalLight.position.set(20, 30, 20);
    // myDirectionalLight.lookAt(0, 0, 0);
    // scene.add(myDirectionalLight);
    // myDirectionalLight.castShadow = true;
    // //Set up shadow properties for the light
    // myDirectionalLight.shadow.mapSize.width = 1024; // default
    // myDirectionalLight.shadow.mapSize.height = 1024; // default
    // myDirectionalLight.shadow.camera.near = 0.1; // default
    // myDirectionalLight.shadow.camera.far = 100; // default
    // myDirectionalLight.shadow.camera.right = 10;
    // myDirectionalLight.shadow.camera.left = - 10;
    // myDirectionalLight.shadow.camera.top = 10;
    // myDirectionalLight.shadow.camera.bottom = - 10;



    // import a model
    // "Ancient Corinth - Peirene Fountain" (https://skfb.ly/onCKZ) by fuzzelhjb is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
    // note that we had to "import" this loader at the top of this sketch to make it available
    // let gltfModelLoader = new GLTFLoader();
    // gltfModelLoader.load('ancient_corinth_-_peirene_fountain.glb', function (model) {
    //     console.log(model);
    //     model.scene.traverse(function (child) {
    //         if (child.isMesh) {
    //             child.castShadow = true;
    //             child.receiveShadow = true;
    //         }
    //     })
    //     scene.add(model.scene);
    // });

    // add some other elements
    let torusGeo = new THREE.TorusKnotGeometry(1, 0.2, 64, 64, 2, 3);
    let torusMat = new THREE.MeshStandardMaterial({
        roughness: 0.8,
        color: "#cbcbcb"
    });
    torus = new THREE.Mesh(torusGeo, torusMat);
    torus.castShadow = true;
    torus.receiveShadow = true;
    torus.position.set(0, 2, 0);
    scene.add(torus);

    let boxG = new THREE.BoxGeometry(20, 0.1, 20);
    let boxM = new THREE.MeshStandardMaterial({ color: "#ababff" });
    let box = new THREE.Mesh(boxG, boxM);
    scene.add(box);
    box.receiveShadow = true;

}

function updateObjects() {
    torus.rotateX(0.001);
    torus.rotateY(0.005);
}