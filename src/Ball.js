import { Physics } from "./Physics.js";

/**
 * Represents a basketball object consisting of a textured sphere with seam lines and a ground shadow.
 * @extends THREE.Group
 */
export class Ball extends THREE.Group {
  constructor() {
    super();
    this.createBasketball();
    this.physics = new Physics(this);
  }

  /**
   * Builds the basketball sphere, adds seam lines and a ground shadow, and attaches them to this group.
   * @private
   */
  createBasketball() {
    const ballGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const ballMaterial = new THREE.MeshPhongMaterial({
      color: 0xd2691e,
      shininess: 20,
      specular: 0x442211,
      bumpScale: 0.01,
    });
    const basketball = new THREE.Mesh(ballGeometry, ballMaterial);
    basketball.position.set(0, 0, 0);
    basketball.castShadow = true;
    basketball.receiveShadow = true;
    this.add(basketball);
    this.createBasketballSeams(0, 0, 0);
  }

  /**
   * Resets the ball's position and physics state to their initial values.
   */
  reset() {
    this.position.set(0, 0.4, 0);
    this.physics.velocity.set(0, 0, 0);
    this.physics.angularVelocity.set(0, 0, 0);
  }

  /**
   * Processes arrow-key movement while the ball is on the ground.
   *
   * @param {Record<string, boolean>} keys - Map containing the current pressed state for each key.
   * @param {number} delta - Time elapsed since the previous frame, in seconds.
   */
  processMovement(keys, delta) {
    if (this.position.y > 0.41) return;

    const moveSpeed = 5;
    const movement = new THREE.Vector3();

    if (keys["ArrowLeft"]) movement.x -= moveSpeed * delta;
    if (keys["ArrowRight"]) movement.x += moveSpeed * delta;
    if (keys["ArrowUp"]) movement.z -= moveSpeed * delta;
    if (keys["ArrowDown"]) movement.z += moveSpeed * delta;

    this.position.add(movement);

    const { x: boundsX, z: boundsZ } = this.physics.courtBoundaries;
    this.position.x = THREE.MathUtils.clamp(this.position.x, -boundsX, boundsX);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -boundsZ, boundsZ);

    const distance = movement.length();
    if (distance > 1e-6) {
      const radius = 0.3;
      const axis = new THREE.Vector3()
        .crossVectors(movement, new THREE.Vector3(0, -1, 0))
        .normalize();

      if (axis.lengthSq() > 1e-6) {
        const angle = distance / radius;
        this.rotateOnWorldAxis(axis, angle);
      }
    }
  }

  /**
   * Creates the seam lines that run along the basketball's surface.
   *
   * @param {number} x - X-coordinate of the basketball center.
   * @param {number} y - Y-coordinate of the basketball center.
   * @param {number} z - Z-coordinate of the basketball center.
   * @private
   */
  createBasketballSeams(x, y, z) {
    const seamMaterial = new THREE.LineBasicMaterial({
      color: 0x1a1a1a,
      linewidth: 2,
    });
    const radius = 0.302;
    for (let seamIndex = 0; seamIndex < 6; seamIndex++) {
      const rotationY = (seamIndex * Math.PI) / 3;
      const topPoints = [];
      for (let i = 0; i <= 32; i++) {
        const angle = (i / 32) * Math.PI;
        const localY = Math.cos(angle) * radius;
        const localRadius = Math.sin(angle) * radius;
        const localX = Math.cos(rotationY) * localRadius;
        const localZ = Math.sin(rotationY) * localRadius;
        topPoints.push(new THREE.Vector3(x + localX, y + localY, z + localZ));
      }

      const topGeometry = new THREE.BufferGeometry().setFromPoints(topPoints);
      const topSeam = new THREE.Line(topGeometry, seamMaterial);
      this.add(topSeam);

      const bottomPoints = [];
      for (let i = 0; i <= 32; i++) {
        const angle = (i / 32) * Math.PI;
        const localY = -Math.cos(angle) * radius;
        const localRadius = Math.sin(angle) * radius;

        const localX = Math.cos(rotationY) * localRadius;
        const localZ = Math.sin(rotationY) * localRadius;

        bottomPoints.push(
          new THREE.Vector3(x + localX, y + localY, z + localZ)
        );
      }

      const bottomGeometry = new THREE.BufferGeometry().setFromPoints(
        bottomPoints
      );
      const bottomSeam = new THREE.Line(bottomGeometry, seamMaterial);
      this.add(bottomSeam);
    }
  }
}
