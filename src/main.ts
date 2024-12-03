import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Ring } from "./types";

import earthTexture from "./assets/earth.jpg";
import jupiterTexture from "./assets/jupiter.jpg";
import marsTexture from "./assets/mars.jpg";
import mercuryTexture from "./assets/mercury.jpg";
import neptuneTexture from "./assets/neptune.jpg";
import plutoTexture from "./assets/pluto.jpg";
import saturn_ringTexture from "./assets/saturn_ring.png";
import saturnTexture from "./assets/saturn.jpg";
import starsTexture from "./assets/stars.jpg";
import sunTexture from "./assets/sun.jpg";
import uranus_ringTexture from "./assets/uranus_ring.png";
import uranusTexture from "./assets/uranus.jpg";
import venusTexture from "./assets/venus.jpg";

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth/window.innerHeight,
  0.1,
  10000
);

camera.position.set(200, 200, -50);
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture
]);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 100000);
scene.add(pointLight);

const sunGeo = new THREE.SphereGeometry(30, 50, 50);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture)
})
const sun = new THREE.Mesh(sunGeo, sunMat);

scene.add(sun);

const addPlanet = (radius: number, texture: THREE.Texture, distance: number, ring?: Ring) => {

  const obj = new THREE.Object3D();
  const geo = new THREE.SphereGeometry(radius, 50, 50);
  const mat = new THREE.MeshStandardMaterial({
    map: texture
  });
  const planet = new THREE.Mesh(geo, mat);

  if(ring) {
    const planetRingGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 75);
    const planetRingMat = new THREE.MeshStandardMaterial({
      map: ring.texture,
      side: THREE.DoubleSide
    });
    const planetRing = new THREE.Mesh(planetRingGeo, planetRingMat);

    planetRing.rotation.x = Math.PI/2;

    planet.add(planetRing);
  }

  obj.add(planet);
  scene.add(obj);
  planet.position.z = 30-radius+distance;
  planet.rotateY(0.005);

  return {
    mesh: planet,
    obj
  };

}

const mercury = addPlanet(3.2, textureLoader.load(mercuryTexture), 28);
const venus = addPlanet(5.8, textureLoader.load(venusTexture), 44);
const earth = addPlanet(6, textureLoader.load(earthTexture), 62);
const mars = addPlanet(4, textureLoader.load(marsTexture), 78);
const jupiter = addPlanet(12, textureLoader.load(jupiterTexture), 100);
const saturn = addPlanet(10, textureLoader.load(saturnTexture), 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: textureLoader.load(saturn_ringTexture)
});
const uranus = addPlanet(7, textureLoader.load(uranusTexture), 176, {
  innerRadius: 7,
  outerRadius: 12,
  texture: textureLoader.load(uranus_ringTexture)
});
const neptune = addPlanet(7, textureLoader.load(neptuneTexture), 200);
const pluto = addPlanet(2.8, textureLoader.load(plutoTexture), 216);

const animate: XRFrameRequestCallback = () => {
  // self
  sun.rotateY(0.0005);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);
  pluto.mesh.rotateY(0.008);
  renderer.render(scene, camera);
  // around sun
  mercury.obj.rotateY(0.04);
  venus.obj.rotateY(0.015);
  earth.obj.rotateY(0.01);
  mars.obj.rotateY(0.008);
  jupiter.obj.rotateY(0.002);
  saturn.obj.rotateY(0.0009);
  uranus.obj.rotateY(0.0004);
  neptune.obj.rotateY(0.0001);
  pluto.obj.rotateY(0.00007);
}

THREE.DefaultLoadingManager.onProgress = (_, loaded, total) => {
  if(loaded == total) {
    document.body.appendChild(renderer.domElement);
  }
}

renderer.setAnimationLoop(animate);