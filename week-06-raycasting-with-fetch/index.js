/*
This example uses the OrbitControls addon by importing it separately from the main THREE codebase.

*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';


let scene, camera, renderer;
let mouse;

function init() {
  // create a scene in which all other objects will exist
  scene = new THREE.Scene();

  // set environment
  new HDRLoader().load('cedar_bridge_sunset_1_1k.hdr', function (envMap) {
    // console.log('hdr environment map loaded!');
    // envMap.mapping = THREE.EquirectangularReflectionMapping;
    // scene.environment = envMap;
    // scene.background = envMap;
  })

  // create a camera and position it in space
  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.z = 5; // place the camera in space
  camera.position.y = 5;
  camera.lookAt(0, 0, 0);

  // the renderer will actually show the camera view within our <canvas>
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let theground = new THREE.Mesh(new THREE.BoxGeometry(100, 0.001, 100), new THREE.MeshStandardMaterial({ color: "blue" }))
  theground.position.y = -0.1;
  scene.add(theground);

  let gridHelper = new THREE.GridHelper(100, 100);
  scene.add(gridHelper);


  // add orbit controls
  let controls = new OrbitControls(camera, renderer.domElement);

  // create a hover state object (which we'll move whenever the mouse moves)
  let hoverMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshStandardMaterial({ color: "yellow" }))
  scene.add(hoverMesh);

  // add a raycast on click
  mouse = new THREE.Vector2(0, 0);
  document.addEventListener(
    "mousemove",
    (ev) => {
      // three.js expects 'normalized device coordinates' (i.e. between -1 and 1 on both axes)
      mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;

      // use our raycaster to move the hoverMesh to the point on the ground where the mouse is pointing
      raycaster.setFromCamera(mouse, camera);

      // run the intersections test against the ground plane
      let intersections = raycaster.intersectObject(theground);

      // if there is an intersection, place the hoverMesh there
      if (intersections[0]) {
        let pointInSpace = intersections[0].point;
        hoverMesh.position.set(pointInSpace.x, pointInSpace.y, pointInSpace.z);
      }
    },
    false
  );

  let raycaster = new THREE.Raycaster();

  // this code runs whenever we click down on the screen
  document.addEventListener("pointerdown", (ev) => {

    // tell our raycaster to project a ray from the camera through the mouse 
    // position that we saved above (as 'normalized device coordinates')
    raycaster.setFromCamera(mouse, camera);

    // run the intersections test against the ground plane
    let intersections = raycaster.intersectObject(theground);

    // if there is an intersection, place a cone there and point it in the direction of the normal
    if (intersections[0]) {
      let pointInSpace = intersections[0].point;
      addImageToScene(pointInSpace.x, pointInSpace.y, pointInSpace.z);
    }
  });


  loop();
}

function loop() {
  // finally, take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);

  window.requestAnimationFrame(loop); // pass the name of your loop function into this function
}

init();


async function addImageToScene(x,y,z) {
  let {imageUrl, altText} = await getRandomPublicDomainImageLink("");
  console.log(imageUrl);
  let utterance = new SpeechSynthesisUtterance(altText);
speechSynthesis.speak(utterance);
  let textureLoader = new THREE.TextureLoader();
  textureLoader.load(imageUrl, function (texture) {
    console.log(texture);
 let imageWidth = texture.source.data.width;
    let imageHeight = texture.source.data.height;
        console.log('width/height:', imageWidth, '/',imageHeight);

    let aspectRatio = imageWidth/imageHeight;

   
    texture.colorSpace = THREE.SRGBColorSpace;
    let material = new THREE.MeshBasicMaterial({ map: texture })
    let width = 3
    let height = 3/aspectRatio;
    let geometry = new THREE.BoxGeometry(width, height, 0.1);

    let mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);
    mesh.position.set(x, height/2, z);
  })
 

}




async function getRandomPublicDomainImageLink(queryTerm){
  // make our initial search query to the Art Institute of Chicago API, which will return a list of artworks matching our search term
  let url = "https://api.artic.edu/api/v1/artworks/search?q=" + queryTerm + "&query[term][is_public_domain]=true"
  let response = await fetch(url);
  let data = await response.json();


  
  // then query an individual artwork for more info
  let randomIndex = Math.floor(Math.random() * data.data.length);
  let artworkUrl = data.data[randomIndex].api_link;
    let altText = data.data[randomIndex].thumbnail.alt_text;
  let artworkResponse = await fetch(artworkUrl);
  let artworkData = await artworkResponse.json();

  // create the url for the image file
  let imageId = artworkData.data.image_id;
  let imageUrlBase = artworkData.config.iiif_url;
  let imageUrl = imageUrlBase + "/" + imageId + "/full/843,/0/default.jpg";

  // return that image url
  return {imageUrl, altText};
}