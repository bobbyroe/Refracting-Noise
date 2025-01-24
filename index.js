import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 15;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const sceneCube = new THREE.Object3D();
scene.add(sceneCube);
// giantCube as background
const cubeGeo = new THREE.BoxGeometry(50, 50, 50);
const map = new THREE.TextureLoader().load(
  "./assets/p5-noise.png"
);
const cubeMat = new THREE.MeshBasicMaterial({
  map,
  side: THREE.BackSide
});
const cube = new THREE.Mesh(cubeGeo, cubeMat);
sceneCube.add(cube);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// helper
function getRandomPosition(range) {
  const x = Math.random() * range - range * 0.5;
  const y = Math.random() * range - range * 0.5;
  const z = Math.random() * range - range * 0.5;
  return {x, y, z};
}
function getObj() {
  const range = 20;
  let prob = Math.random();
  const objGeo = prob < 0.33 ? 
    THREE.SphereGeometry : prob > 0.66 ?
    THREE.BoxGeometry :
    THREE.IcosahedronGeometry;
  const geometry = new objGeo();
  const material = new THREE.MeshPhysicalMaterial({
    roughness: Math.random() < 0.05 ? 0.2 : 0.0,
    transmission: 1.0,
    thickness: Math.random() < 0.05 ? 2.0 : 1.0,
    flatShading: false, 
  });
  const mesh = new THREE.Mesh(geometry, material);
  const scaleScalar = Math.random() + 1.5;
  mesh.scale.set(scaleScalar, scaleScalar, scaleScalar);
  const { x, y, z } = getRandomPosition(range);
  let goalPos = { x, y, z };
  mesh.position.set(x, y, z);
  let needsNewGoalPos = false;
  const moveRate = 0.02;
  const rotationRate = {
    x: (Math.random() - 0.5) * 0.02,
    y: (Math.random() - 0.5) * 0.02,
    z: (Math.random() - 0.5) * 0.02
  };
  function update () {
    needsNewGoalPos = Math.random() < 0.001;
    if (needsNewGoalPos) {
      goalPos = getRandomPosition(range);
    }
    mesh.rotation.x += rotationRate.x;
    mesh.rotation.y += rotationRate.y;
    mesh.rotation.z += rotationRate.z;
    mesh.position.x -= (mesh.position.x - goalPos.x) * moveRate;
    mesh.position.y -= (mesh.position.y - goalPos.y) * moveRate;
    mesh.position.z -= (mesh.position.z - goalPos.z) * moveRate;
  }
  return {mesh, update};
}


let obj;
const sceneObjects = [];
const numObjs = 40;
for (let i = 0; i < numObjs; i += 1) {
  obj = getObj();
  sceneObjects.push(obj);
  sceneCube.add(obj.mesh);
}

const sunlight = new THREE.DirectionalLight(0xffffff);
sunlight.position.y = 2;
scene.add(sunlight);


function animate() {
  requestAnimationFrame(animate);
  sceneObjects.forEach( o => o.update());
  sceneCube.rotation.x += 0.0005;
  sceneCube.rotation.y += 0.001;
  renderer.render(scene, camera);
}

animate();
