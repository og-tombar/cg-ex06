export class Skybox {
  /**
   * Loads the six cubemap faces and sets them as the scene background.
   *
   * @param {THREE.Scene} scene - The Three.js scene whose background will be replaced.
   */
  constructor(scene) {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader
      .setPath("./skybox/")
      .load([
        "left.png",
        "right.png",
        "top.png",
        "bottom.png",
        "back.png",
        "front.png",
      ]);
    scene.background = texture;
  }
}
