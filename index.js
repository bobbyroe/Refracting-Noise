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

const sceneCube = new THREE.Object3D();
scene.add(sceneCube);

// giantCube as background
const cubeGeo = new THREE.BoxGeometry(50, 50, 50);
cubeGeo.scale(-1, 1, 1);
// shader mat:
const vsh = await fetch('./assets/vert.glsl');
const fsh = await fetch('./assets/frag.glsl');

const uniforms = {
  time: { value: 0.0 },
  resolution: { value: new THREE.Vector2(w, h) },
};

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader: await vsh.text(),
  fragmentShader: await fsh.text()
});

const cube = new THREE.Mesh(cubeGeo, material);
sceneCube.add(cube);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

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
const palette = [0x03071e, 0x370617, 0x6a040f, 0x9d0208, 0xd00000, 0xdc2f02, 0xe85d04, 0xf48c06, 0xfaa307, 0xffba08];
function getBox() {
  const hex = palette[Math.floor(Math.random() * palette.length)];
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
  sceneCube.add(obj);
}

const sunlight = new THREE.DirectionalLight(0xffffff, 2.0);
sunlight.position.y = 2;
// scene.add(sunlight);

function animate(t = 0) {
  t *= 0.001;
  requestAnimationFrame(animate);
  sceneCube.rotation.x += 0.001;
  sceneCube.rotation.y += 0.002;
  uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height);
  uniforms.time.value = t;
  renderer.render(scene, camera);
  controls.update();
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}); 

// TODO 2025:
// implement a camera path to fly through the scene