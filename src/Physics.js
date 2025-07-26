/**
 * Handles physics simulation for the basketball, including movement, gravity, and collisions.
 */
export class Physics {
  constructor(ball) {
    this.ball = ball;
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.angularVelocity = new THREE.Vector3(0, 0, 0);

    this.gravity = -9.8;
    this.restitution = 0.8;
    this.courtBoundaries = {
      x: 14.5,
      z: 7,
    };
  }

  /**
   * Updates the ball's position and rotation based on physics.
   * @param {number} deltaTime - The time elapsed since the last frame.
   */
  update(deltaTime) {
    if (this.ball.position.y > 0.4 || this.velocity.y > 0) {
      this.velocity.y += this.gravity * deltaTime;
    }

    this.ball.position.add(this.velocity.clone().multiplyScalar(deltaTime));

    if (this.ball.position.y < 0.4) {
      this.ball.position.y = 0.4;
      if (this.velocity.y < 0) {
        this.velocity.y *= -this.restitution;
      }
      this.velocity.x *= 0.9;
      this.velocity.z *= 0.9;

      if (Math.abs(this.velocity.y) < 0.1) this.velocity.y = 0;
      if (Math.abs(this.velocity.x) < 0.05) this.velocity.x = 0;
      if (Math.abs(this.velocity.z) < 0.05) this.velocity.z = 0;
    }

    if (this.ball.position.x > this.courtBoundaries.x) {
      this.ball.position.x = this.courtBoundaries.x;
      this.velocity.x *= -this.restitution;
    }
    if (this.ball.position.x < -this.courtBoundaries.x) {
      this.ball.position.x = -this.courtBoundaries.x;
      this.velocity.x *= -this.restitution;
    }
    if (this.ball.position.z > this.courtBoundaries.z) {
      this.ball.position.z = this.courtBoundaries.z;
      this.velocity.z *= -this.restitution;
    }
    if (this.ball.position.z < -this.courtBoundaries.z) {
      this.ball.position.z = -this.courtBoundaries.z;
      this.velocity.z *= -this.restitution;
    }
    this.updateRotation(deltaTime);
  }

  /**
   * Rotates the ball based on its linear velocity to simulate rolling/spinning.
   * @param {number} deltaTime
   */
  updateRotation(deltaTime) {
    const speed = this.velocity.length();
    if (speed < 0.01) return;

    const radius = 0.3;
    const axis = new THREE.Vector3()
      .crossVectors(this.velocity, new THREE.Vector3(0, 1, 0))
      .normalize();
    if (axis.lengthSq() < 1e-6) return;
    const angle = -(speed / radius) * deltaTime;
    this.ball.rotateOnWorldAxis(axis, angle);
  }
}
