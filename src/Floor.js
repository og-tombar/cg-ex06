/**
 * Represents the basketball court floor along with all court markings.
 * @extends THREE.Group
 */
export class Floor extends THREE.Group {
  constructor() {
    super();
    this.createBasketballCourt();
  }

  /**
   * Creates the wooden court surface and triggers creation of the lines.
   * @private
   */
  createBasketballCourt() {
    const courtGeometry = new THREE.BoxGeometry(30, 0.2, 15);
    const courtMaterial = new THREE.MeshPhongMaterial({
      color: 0xc68642,
      shininess: 50,
    });
    const court = new THREE.Mesh(courtGeometry, courtMaterial);
    court.position.set(0, 0, 0);
    court.receiveShadow = true;
    this.add(court);
    this.createCourtLines();
  }

  /**
   * Builds the main set of court lines including center line, boundaries and circles.
   * @private
   */
  createCourtLines() {
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });
    const centerLineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.11, -7.5),
      new THREE.Vector3(0, 0.11, 7.5),
    ]);
    const centerLine = new THREE.Line(centerLineGeometry, lineMaterial);
    this.add(centerLine);
    this.createBoundaryLines();
    this.createCenterCircle();
    this.createThreePointLine(-13.0, 1);
    this.createThreePointLine(13.0, -1);
    this.createFreeThrowLines();
  }

  /**
   * Creates free–throw circles as well as key (paint) areas on both sides of the court.
   * @private
   */
  createFreeThrowLines() {
    this.createFreeThrowCircle(-9.5, 1);
    this.createFreeThrowCircle(9.5, -1);

    this.createKeyArea(-14, -9.5);
    this.createKeyArea(14, 9.5);
  }

  /**
   * Draws a free–throw circle on one side of the court.
   *
   * @param {number} centerX - X coordinate of the circle center.
   * @param {number} direction - Direction multiplier (1 or -1) specifying court side.
   * @private
   */
  createFreeThrowCircle(centerX, direction) {
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });
    const radius = 1.8;
    const circlePoints = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      circlePoints.push(new THREE.Vector3(x, 0.11, z));
    }

    const circleGeometry = new THREE.BufferGeometry().setFromPoints(
      circlePoints
    );
    const circle = new THREE.Line(circleGeometry, lineMaterial);
    this.add(circle);
  }

  /**
   * Creates the rectangular key (paint) area from baseline to free–throw line.
   *
   * @param {number} endX - X coordinate at the baseline end of the key.
   * @param {number} freeThrowX - X coordinate of the free–throw line.
   * @private
   */
  createKeyArea(endX, freeThrowX) {
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });
    const keyWidth = 3.6;
    const keyPoints = [
      new THREE.Vector3(endX, 0.11, -keyWidth),
      new THREE.Vector3(freeThrowX, 0.11, -keyWidth),
      new THREE.Vector3(freeThrowX, 0.11, keyWidth),
      new THREE.Vector3(endX, 0.11, keyWidth),
    ];

    for (let i = 0; i < keyPoints.length - 1; i++) {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        keyPoints[i],
        keyPoints[i + 1],
      ]);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      this.add(line);
    }
  }

  /**
   * Draws the 3-point line consisting of an arc connected to two straight segments.
   *
   * @param {number} centerX - X coordinate for the center of the arc.
   * @param {number} direction - Direction multiplier (1 or -1) determining court side.
   * @private
   */
  createThreePointLine(centerX, direction) {
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });
    const arcRadius = 7.24;
    const straightLineLength = 7.0;
    const arcPoints = [];
    const startAngle =
      direction > 0
        ? -Math.asin(straightLineLength / arcRadius)
        : Math.PI - Math.asin(straightLineLength / arcRadius);
    const endAngle =
      direction > 0
        ? Math.asin(straightLineLength / arcRadius)
        : Math.PI + Math.asin(straightLineLength / arcRadius);

    for (let i = 0; i <= 64; i++) {
      const angle = startAngle + (endAngle - startAngle) * (i / 64);
      const x = centerX + Math.cos(angle) * arcRadius;
      const z = Math.sin(angle) * arcRadius;
      arcPoints.push(new THREE.Vector3(x, 0.11, z));
    }

    const arcGeometry = new THREE.BufferGeometry().setFromPoints(arcPoints);
    const arcLine = new THREE.Line(arcGeometry, lineMaterial);
    this.add(arcLine);
    const straightY = 0.11;
    const baselineOffset = direction > 0 ? -14 : 14;
    const leftStraightPoints = [
      new THREE.Vector3(
        centerX + Math.cos(startAngle) * arcRadius,
        straightY,
        Math.sin(startAngle) * arcRadius
      ),
      new THREE.Vector3(
        baselineOffset,
        straightY,
        Math.sin(startAngle) * arcRadius
      ),
    ];
    const leftStraightGeometry = new THREE.BufferGeometry().setFromPoints(
      leftStraightPoints
    );
    const leftStraightLine = new THREE.Line(leftStraightGeometry, lineMaterial);
    this.add(leftStraightLine);
    const rightStraightPoints = [
      new THREE.Vector3(
        centerX + Math.cos(endAngle) * arcRadius,
        straightY,
        Math.sin(endAngle) * arcRadius
      ),
      new THREE.Vector3(
        baselineOffset,
        straightY,
        Math.sin(endAngle) * arcRadius
      ),
    ];
    const rightStraightGeometry = new THREE.BufferGeometry().setFromPoints(
      rightStraightPoints
    );
    const rightStraightLine = new THREE.Line(
      rightStraightGeometry,
      lineMaterial
    );
    this.add(rightStraightLine);
  }

  /**
   * Renders the center-court circles and dot.
   * @private
   */
  createCenterCircle() {
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });
    const outerRadius = 3.6;
    const outerCirclePoints = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      const x = Math.cos(angle) * outerRadius;
      const z = Math.sin(angle) * outerRadius;
      outerCirclePoints.push(new THREE.Vector3(x, 0.11, z));
    }
    const outerCircleGeometry = new THREE.BufferGeometry().setFromPoints(
      outerCirclePoints
    );
    const outerCircle = new THREE.Line(outerCircleGeometry, lineMaterial);
    this.add(outerCircle);
    const innerRadius = 1.8;
    const innerCirclePoints = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      const x = Math.cos(angle) * innerRadius;
      const z = Math.sin(angle) * innerRadius;
      innerCirclePoints.push(new THREE.Vector3(x, 0.11, z));
    }
    const innerCircleGeometry = new THREE.BufferGeometry().setFromPoints(
      innerCirclePoints
    );
    const innerCircle = new THREE.Line(innerCircleGeometry, lineMaterial);
    this.add(innerCircle);
    const centerDotGeometry = new THREE.CircleGeometry(0.15, 16);
    const centerDotMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const centerDot = new THREE.Mesh(centerDotGeometry, centerDotMaterial);
    centerDot.rotation.x = -Math.PI / 2;
    centerDot.position.set(0, 0.11, 0);
    this.add(centerDot);
  }

  /**
   * Adds the outer boundary lines of the court.
   * @private
   */
  createBoundaryLines() {
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });
    const boundaryOffset = 14;
    const leftBoundaryGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-boundaryOffset, 0.11, -7.5),
      new THREE.Vector3(-boundaryOffset, 0.11, 7.5),
    ]);
    const leftBoundary = new THREE.Line(leftBoundaryGeom, lineMaterial);
    this.add(leftBoundary);
    const rightBoundaryGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(boundaryOffset, 0.11, -7.5),
      new THREE.Vector3(boundaryOffset, 0.11, 7.5),
    ]);
    const rightBoundary = new THREE.Line(rightBoundaryGeom, lineMaterial);
    this.add(rightBoundary);
  }
}
