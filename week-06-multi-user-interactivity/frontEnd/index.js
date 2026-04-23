import * as THREE from "three";
import { MapControls } from 'three/addons/controls/MapControls.js';

// create variables and make them available globally
let scene, myRenderer, camera;

// keep track of our controls so we can update them in the draw loop
let controls;

let socket;

function setupMySocket() {
  socket = io();
  socket.on('msg', onMessage);
}

function onMessage(msg) {
  console.log(msg);
  let geo = new THREE.BoxGeometry(1, 1, 1);
  let mat = new THREE.MeshNormalMaterial();
  let mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(msg.x, msg.y, msg.z);
  scene.add(mesh);
}

function init() {

  // create a scene and give it a background color
  scene = new THREE.Scene();
  scene.background = new THREE.Color("rgb(20,20,20)");

  // create the renderer which will actually draw our scene and add it to the document
  myRenderer = new THREE.WebGLRenderer();
  myRenderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(myRenderer.domElement);

  // create our camera
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 5);
  camera.lookAt(0, 0, 0);


  // add orbit controls so we can navigate our scene while testing
  controls = new MapControls(camera, myRenderer.domElement);

  // mesh
  let grid = new THREE.GridHelper(100, 100);
  scene.add(grid);

  // add websocket support
  setupMySocket();

  let theground = new THREE.Mesh(new THREE.BoxGeometry(100, 0.001, 100), new THREE.MeshStandardMaterial({ color: "blue" }))
  theground.position.y = -0.1;
  scene.add(theground);

  // add a raycast on click
  let mouse = new THREE.Vector2(0, 0);
  document.addEventListener(
    "mousemove",
    (ev) => {
      // three.js expects 'normalized device coordinates' (i.e. between -1 and 1 on both axes)
      mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;

      if (isMouseDown && drawingActive) {

        // tell our raycaster to project a ray from the camera through the mouse 
        // position that we saved above (as 'normalized device coordinates')
        raycaster.setFromCamera(mouse, camera);

        // run the intersections test against the ground plane
        let intersections = raycaster.intersectObjects(scene.children);

        // if there is an intersection, place a cone there and point it in the direction of the normal
        if (intersections[0]) {
          let pointInSpace = intersections[0].point;

          let myMessage = {
            x: pointInSpace.x,
            y: pointInSpace.y,
            z: pointInSpace.z
          };
          socket.emit('msg', myMessage);

        }
      }

    },
    false
  );

  let raycaster = new THREE.Raycaster();

  let isMouseDown = false;
  // this code runs whenever we click down on the screen
  document.addEventListener("pointerdown", (ev) => {

    isMouseDown = true;

  });

  document.addEventListener("pointerup", () => {
    isMouseDown = false;
  })

  let drawingActive =false;
  document.addEventListener('keydown', (ev) => {
    if (ev.key == "Shift"){
      drawingActive = true;
          controls.enabled = false;

    }
  })

  document.addEventListener('keyup', (ev) => {
    if (ev.key == "Shift"){
      drawingActive = false;
          controls.enabled = true;

    }
  })

  // start the draw loop
  draw();
}

function draw() {
  controls.update();

  myRenderer.render(scene, camera);

  // ask the browser to render another frame when it is ready
  window.requestAnimationFrame(draw);
}

// get everything started by calling init
init();
