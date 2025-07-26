import { OrbitControls } from "./OrbitControls.js";
import { Floor } from "./Floor.js";
import { Basket } from "./Basket.js";
import { Ball } from "./Ball.js";
import { setupLighting } from "./Lighting.js";
import { Skybox } from "./Skybox.js";
import { UI } from "./UI.js";
import { InputController } from "./inputController.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.domElement.tabIndex = 1;
renderer.domElement.focus();

new Skybox(scene);
setupLighting(scene);
renderer.shadowMap.enabled = true;

const floor = new Floor();
const leftBasket = new Basket(-14, 1);
const rightBasket = new Basket(14, -1);
const ball = new Ball();
const ballPhysics = ball.physics;

scene.add(floor);
scene.add(leftBasket);
scene.add(rightBasket);
scene.add(ball);

camera.position.set(0, 25, 25);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;

const ui = new UI();

let shotPower = 0.5;
let score = 0;
let attempts = 0;
let made = 0;

ui.updatePower(shotPower);
ui.updateStats(score, attempts, made);

const input = new InputController({
  onOrbitToggle: () => {
    isOrbitEnabled = !isOrbitEnabled;
    ui.updateOrbitStatus(isOrbitEnabled);
  },
  onPowerUp: () => {
    shotPower = Math.min(1, shotPower + 0.05);
    ui.updatePower(shotPower);
  },
  onPowerDown: () => {
    shotPower = Math.max(0, shotPower - 0.05);
    ui.updatePower(shotPower);
  },
  onShoot: () => attemptShot(),
  onReset: () => resetBall(),
});

function resetBall() {
  ball.reset();
  shotPower = 0.5;
  ui.updatePower(shotPower);
}

const leftHoopPos = new THREE.Vector3(-13.575, 4.25, 0);
const rightHoopPos = new THREE.Vector3(13.575, 4.25, 0);

let shotInProgress = false;

function attemptShot() {
  if (ball.position.y > 0.41 || ballPhysics.velocity.length() > 0.1) return;

  // Determine nearest hoop
  const distLeft = ball.position.distanceTo(leftHoopPos);
  const distRight = ball.position.distanceTo(rightHoopPos);
  const target = distLeft < distRight ? leftHoopPos : rightHoopPos;

  // Direction vector
  const dir = new THREE.Vector3().subVectors(target, ball.position);
  const horizontalDir = new THREE.Vector3(dir.x, 0, dir.z).normalize();
  const horizontalSpeed = shotPower * 6;
  const verticalSpeed = shotPower * 12;

  ballPhysics.velocity.set(
    horizontalDir.x * horizontalSpeed,
    verticalSpeed,
    horizontalDir.z * horizontalSpeed
  );

  attempts++;
  ui.updateStats(score, attempts, made);
  shotInProgress = true;
}

function checkScore() {
  if (!shotInProgress) return;

  const rimRadius = 0.55;
  const target = ball.position.x < 0 ? leftHoopPos : rightHoopPos;
  const dist = ball.position.distanceTo(target);

  if (
    ball.position.y <= target.y &&
    dist < rimRadius &&
    ballPhysics.velocity.y < 0
  ) {
    score += 2;
    made++;
    ui.updateStats(score, attempts, made);
    ui.showMessage("SHOT MADE!", true);
    shotInProgress = false;
  }
  else if (ball.position.y <= 0.41) {
    ui.showMessage("MISSED SHOT", false);
    shotInProgress = false;
  }
}

function checkRimBounce() {
  const rimRadius = 0.55;
  const ballRadius = 0.3;

  const hoops = [leftHoopPos, rightHoopPos];
  hoops.forEach((center) => {
    const horizontalPos = new THREE.Vector3(
      ball.position.x,
      0,
      ball.position.z
    );
    const horizontalCenter = new THREE.Vector3(center.x, 0, center.z);
    const dist = horizontalPos.distanceTo(horizontalCenter);

    if (
      dist < rimRadius + ballRadius &&
      Math.abs(ball.position.y - center.y) < 0.1
    ) {
      const radial = new THREE.Vector3()
        .subVectors(horizontalPos, horizontalCenter)
        .normalize();

      const vHoriz = new THREE.Vector3(
        ballPhysics.velocity.x,
        0,
        ballPhysics.velocity.z
      );
      const dot = vHoriz.dot(radial);
      if (dot < 0) {
        const reflect = radial.multiplyScalar(-2 * dot);
        vHoriz.add(reflect);
        vHoriz.multiplyScalar(ballPhysics.restitution);
        ballPhysics.velocity.x = vHoriz.x;
        ballPhysics.velocity.z = vHoriz.z;
        if (ball.position.y < center.y) {
          ballPhysics.velocity.y =
            Math.abs(ballPhysics.velocity.y) * ballPhysics.restitution;
        }
      }
    }
  });
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

window.addEventListener("resize", onWindowResize);
const clock = new THREE.Clock();

/**
 * Animation loop that updates controls and renders the scene.
 * Recursively schedules itself via requestAnimationFrame.
 *
 * @returns {void}
 */
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  ball.processMovement(input.keys, delta);
  ballPhysics.update(delta);
  checkScore();
  checkRimBounce();
  leftBasket.checkBackboardCollision(ball);
  rightBasket.checkBackboardCollision(ball);
  controls.enabled = isOrbitEnabled;
  controls.update();
  renderer.render(scene, camera);
}

animate();
