export class UI {
  constructor() {
    this.injectStyles();
    this.createScoreContainer();
    this.createInstructions();
  }

  /**
   * Creates the base stylesheet link for UI components if it does not already exist.
   * @private
   */
  injectStyles() {
    if (!document.getElementById("ui-css")) {
      const link = document.createElement("link");
      link.id = "ui-css";
      link.rel = "stylesheet";
      link.href = "./ui.css";
      document.head.appendChild(link);
    }
  }

  /**
   * Creates and positions the on-screen score display.
   * @private
   */
  createScoreContainer() {
    const scoreContainer = document.createElement("div");
    scoreContainer.id = "score-container";
    scoreContainer.style.position = "absolute";
    scoreContainer.style.top = "20px";
    scoreContainer.style.left = "50%";
    scoreContainer.style.transform = "translateX(-50%)";
    scoreContainer.style.color = "white";
    scoreContainer.style.fontSize = "24px";
    scoreContainer.style.fontFamily = "Arial, sans-serif";
    scoreContainer.style.fontWeight = "bold";
    scoreContainer.style.textAlign = "center";
    scoreContainer.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    scoreContainer.style.padding = "10px 20px";
    scoreContainer.style.borderRadius = "10px";
    scoreContainer.innerHTML = `
      <div id="score-display">Score: 0</div>
      <div id="attempts-display">Attempts: 0</div>
      <div id="made-display">Shots Made: 0</div>
      <div id="shootingPercentage-display">Shooting Percentage: 0%</div>
      <div id="power-display">Power: 50%</div>
      <div id="message-display" style="margin-top:8px;"></div>
    `;
    document.body.appendChild(scoreContainer);
  }

  /**
   * Updates score, attempts, and shooting percentage.
   * @param {number} score - total score
   * @param {number} attempts - total attempts
   * @param {number} made - shots made
   */
  updateStats(score, attempts, made) {
    const shootingPercentage = attempts > 0 ? ((made / attempts) * 100).toFixed(0) : 0;
    document.getElementById("score-display").textContent = `Score: ${score}`;
    document.getElementById("attempts-display").textContent = `Attempts: ${attempts}`;
    document.getElementById("made-display").textContent = `Shots Made: ${made}`;
    document.getElementById("shootingPercentage-display").textContent = `Shooting Percentage: ${shootingPercentage}%`;
  }

  /**
   * Updates the power indicator.
   * @param {number} power - value between 0 and 1
   */
  updatePower(power) {
    const pct = Math.round(power * 100);
    document.getElementById("power-display").textContent = `Power: ${pct}%`;
  }

  /**
   * Shows a temporary message (e.g., "SHOT MADE!" or "MISSED SHOT").
   * @param {string} text - message to display
   * @param {boolean} success - Indicates success (affects color)
   */
  showMessage(text, success = true) {
    const msgEl = document.getElementById("message-display");
    msgEl.textContent = text;
    msgEl.style.color = success ? "#00ff00" : "#ff5555";
    msgEl.style.opacity = 1;
    setTimeout(() => {
      msgEl.style.transition = "opacity 1s";
      msgEl.style.opacity = 0;
    }, 2000);
  }

  buildControlsHTML(isOrbitEnabled = true) {
    const statusText = isOrbitEnabled
      ? "O - Toggle orbit camera (ON)"
      : "O - Toggle orbit camera (OFF)";

    return `
      <h3 style="margin: 0 0 10px 0; color: #ffaa00;">Basketball Game - HW06</h3>
      <p style="margin: 5px 0;"><strong>Controls:</strong></p>
      <p style="margin: 5px 0;">${statusText}</p>
      <p style="margin: 5px 0;">Arrow Keys - Move Ball</p>
      <p style="margin: 5px 0;">W / S - Increase / Decrease Shot Power</p>
      <p style="margin: 5px 0;">Spacebar - Shoot</p>
      <p style="margin: 5px 0;">R - Reset Ball</p>
    `;
  }

  /**
   * Builds the instruction that lists available keyboard controls.
   * @private
   */
  createInstructions() {
    const instructionsElement = document.createElement("div");
    instructionsElement.id = "controls-container";
    instructionsElement.style.position = "absolute";
    instructionsElement.style.bottom = "20px";
    instructionsElement.style.left = "20px";
    instructionsElement.style.color = "white";
    instructionsElement.style.fontSize = "16px";
    instructionsElement.style.fontFamily = "Arial, sans-serif";
    instructionsElement.style.textAlign = "left";
    instructionsElement.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    instructionsElement.style.padding = "15px";
    instructionsElement.style.borderRadius = "10px";
    instructionsElement.innerHTML = this.buildControlsHTML(true);
    document.body.appendChild(instructionsElement);
  }

  /**
   * Updates the orbit camera status label within the instruction.
   *
   * @param {boolean} isOrbitEnabled - If orbit camera is currently enabled.
   * @public
   */
  updateOrbitStatus(isOrbitEnabled) {
    const controlsContainer = document.getElementById("controls-container");
    if (!controlsContainer) return;
    controlsContainer.innerHTML = this.buildControlsHTML(isOrbitEnabled);
  }
}
