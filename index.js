import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 10;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const sceneGroup = new THREE.Group();
sceneGroup.userData.update = () => {
  sceneGroup.rotation.x += 0.001;
  sceneGroup.rotation.y += 0.002;
};
scene.add(sceneGroup);

const cubeGeo = new THREE.BoxGeometry(50, 50, 50);
const vsh = await fetch('./assets/vert.glsl');
const fsh = await fetch('./assets/frag.glsl');
const bgMat = new THREE.ShaderMaterial({
  vertexShader: await vsh.text(),
  fragmentShader: await fsh.text(),
  side: THREE.BackSide,
});

const bgCube = new THREE.Mesh(cubeGeo, bgMat);
sceneGroup.add(bgCube);

function getBall() {
  const geometry = new THREE.SphereGeometry();
  const material = new THREE.MeshPhysicalMaterial({
    roughness: 0,
    transmission: 1,
    thickness: 0.9,
    transparent: true,
  });
  const ball = new THREE.Mesh(geometry, material);
  const x = Math.random() * 30 - 15;
  const y = Math.random() * 30 - 15;
  const z = Math.random() * 30 - 15;
  ball.position.set(x, y, z);
  return ball;
}

function getBox() {
  const color = new THREE.Color(Math.random() * 0xffffff);
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshPhysicalMaterial({
    roughness: 0.0,
    transmission: 1,
    thickness: 5,
    transparent: true,
    color,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(3, 3, 3);
  const x = Math.random() * 30 - 15;
  const y = Math.random() * 30 - 15;
  const z = Math.random() * 30 - 15;
  mesh.position.set(x, y, z);
  return mesh;
}

let obj;
const numObjs = 200;
for (let i = 0; i < numObjs; i += 1) {
  obj = getBox();
  sceneGroup.add(obj);
}

function animate() {
  requestAnimationFrame(animate);
  sceneGroup.userData.update();
  renderer.render(scene, camera);
  controls.update();
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}); 