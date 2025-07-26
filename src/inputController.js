export class InputController {
    constructor({ onOrbitToggle, onPowerUp, onPowerDown, onShoot, onReset }) {
        this.keys = {};
        this.onOrbitToggle = onOrbitToggle;
        this.onPowerUp = onPowerUp;
        this.onPowerDown = onPowerDown;
        this.onShoot = onShoot;
        this.onReset = onReset;

        document.addEventListener("keydown", (e) => this.handleKeyDown(e));
        document.addEventListener("keyup", (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        this.keys[e.code] = true;
        switch (e.code) {
            case "KeyO":
                this.onOrbitToggle?.();
                break;
            case "KeyW":
                this.onPowerUp?.();
                break;
            case "KeyS":
                this.onPowerDown?.();
                break;
            case "Space":
                this.onShoot?.();
                break;
            case "KeyR":
                this.onReset?.();
                break;
        }
    }

    handleKeyUp(e) {
        this.keys[e.code] = false;
    }
}