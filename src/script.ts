import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import UVData from "./uv.json";

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Texture
const textureLoader = new THREE.TextureLoader();
const spriteTexture = textureLoader.load("sprite.png");
spriteTexture.magFilter = THREE.NearestFilter;
spriteTexture.minFilter = THREE.NearestFilter;
spriteTexture.generateMipmaps = false;
spriteTexture.colorSpace = THREE.SRGBColorSpace;

// Setup Debug
const gui = new GUI();
let params = {
  isAnimating: true,
};
gui.add(params, "isAnimating");

// test cube for perspective when rotating camera
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ color: "darkblue" }),
);
cube.position.setY(-2);
scene.add(cube);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;

scene.add(camera);

// Controls
// @ts-ignore
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  // @ts-ignore
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const spritePlane = new THREE.PlaneGeometry(1, 1);
const spriteMaterial = new THREE.MeshBasicMaterial({
  transparent: true,
  map: spriteTexture,
});

// Create the animated sprite mesh
const animatedSpriteMesh = new THREE.Mesh(spritePlane, spriteMaterial);
// set some initial data like direction, frame and uv
let currentDirection = "SW";
let currentAnimation = UVData.find(
  (animation) => animation.name === `sprite_walk_${currentDirection}`,
);
let currentAnimationFrame = 0;
let currentFrameUVs = currentAnimation?.frame[currentAnimationFrame].uv;

scene.add(animatedSpriteMesh);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  currentDirection = getDirection(controls.getAzimuthalAngle());
  currentAnimation = UVData.find(
    (animation) => animation.name === `sprite_walk_${currentDirection}`,
  );

  currentAnimationFrame = Math.floor(elapsedTime * 8) % 3;
  currentFrameUVs =
    currentAnimation?.frame[params.isAnimating ? currentAnimationFrame : 1].uv;

  // ThreeJS creates the vertexes for a plane in the order of top left > top right > bottom right > bottom left
  if (currentFrameUVs) {
    animatedSpriteMesh.geometry.attributes.uv.setXY(
      0,
      currentFrameUVs[1].x,
      currentFrameUVs[1].y,
    );
    animatedSpriteMesh.geometry.attributes.uv.setXY(
      1,
      currentFrameUVs[2].x,
      currentFrameUVs[2].y,
    );
    animatedSpriteMesh.geometry.attributes.uv.setXY(
      2,
      currentFrameUVs[0].x,
      currentFrameUVs[0].y,
    );
    animatedSpriteMesh.geometry.attributes.uv.setXY(
      3,
      currentFrameUVs[3].x,
      currentFrameUVs[3].y,
    );
    animatedSpriteMesh.geometry.attributes.uv.needsUpdate = true;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);
  // Billboarding effect
  animatedSpriteMesh.lookAt(camera.position);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
tick();

// calculate nearest 1/8 direction
function getDirection(angle: number) {
  // Normalize the angle to be between 0 and 2π
  const normalizedAngle =
    ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

  // Define the angles for each direction (in radians)
  const directions = [
    { name: "S", angle: 0 },
    { name: "SW", angle: Math.PI / 4 },
    { name: "W", angle: Math.PI / 2 },
    { name: "NW", angle: (3 * Math.PI) / 4 },
    { name: "N", angle: Math.PI },
    { name: "NE", angle: (5 * Math.PI) / 4 },
    { name: "E", angle: (3 * Math.PI) / 2 },
    { name: "SE", angle: (7 * Math.PI) / 4 },
    { name: "S", angle: 2 * Math.PI },
  ];

  // Find the closest direction
  for (let i = 0; i < directions.length - 1; i++) {
    if (
      normalizedAngle >= directions[i].angle &&
      normalizedAngle < directions[i + 1].angle
    ) {
      // Check which direction is closer
      const diff1 = Math.abs(normalizedAngle - directions[i].angle);
      const diff2 = Math.abs(normalizedAngle - directions[i + 1].angle);
      return diff1 < diff2 ? directions[i].name : directions[i + 1].name;
    }
  }
  return "SW";
}
