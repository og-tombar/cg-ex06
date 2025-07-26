# Computer Graphics - Exercise 6 - WebGL Basketball Game

## Group Members

- Eric Gantman (207114851)
- Tom Bar (302278601)

## Running The Project

1. Clone this repository to your local machine: `git clone https://github.com/og-tombar/cg-ex06.git`
2. Make sure you have Node.js installed
3. Install dependencies: `npm i`
4. Start the local web server: `node index.js`
5. Open your browser and go to http://localhost:8000

## External Assets

- [Procedurally Generated Space Skybox](https://tools.wwwtyro.net/space-3d/index.html)

## Demonstration Video

The video below demonstrates full functioanlity of the game including:

1. Basketball being moved around the court using arrow keys
2. Shot power adjustment demonstration (W/S keys)
3. Basketball shooting mechanics (spacebar)
4. Successful shot with score update
5. Ball rotation animation during movement and flight
6. Complete UI showing scores, statistics, and controls

Pay attention to changes in the UI, which include visual feedback for power adjustment, scores and statistics:

**(Also turn on the sound!)**

https://github.com/user-attachments/assets/42d9f478-479f-46e7-877b-f4016be33857

## Screenshots

Shot ![](./resources/shot.png)

Shot Made ![](./resources/shot_made.png)

Missed Shot ![](./resources/missed_shot.png)

## Controls

| Key            | Action                                                                       |
| -------------- | ---------------------------------------------------------------------------- |
| **O**          | Toggle orbit camera on/off                                                   |
| **Arrow Keys** | Move basketball across the court (while the ball is on the ground)           |
| **W**          | Increase shot power by 5 % (max 100 %)                                       |
| **S**          | Decrease shot power by 5 % (min 0 %)                                         |
| **Spacebar**   | Shoot the ball toward the nearest hoop using the current power setting       |
| **R**          | Reset the ball to the centre of the court and restore the default 50 % power |

---

## Physics System Implementation

1. **Gravity & Trajectory**
   • Constant downward acceleration of **−9.8 m/s^2** is applied every frame once the ball leaves the ground (`src/Physics.js`).
   • Initial shot velocity is split into vertical and horizontal components (`src/hw6.js -> attemptShot`). Horizontal speed is `shotPower × 6 m/s` and vertical speed is `shotPower × 12 m/s`, producing a realistic parabolic arc whose height is determined by the power set with **W/S**.

2. **Ground & Wall Collisions**
   • When the ball’s `y` position drops below the 0.4 m resting height it is snapped back to that height and its vertical velocity is inverted and scaled by a **coefficient of restitution 0.8**.
   • Tangential (x / z) velocity is damped by **10 %** on every bounce to emulate friction, causing the ball to settle after a few rebounds.
   • Court boundaries at ±14.5 m (x-axis) and ±7 m (z-axis) are enforced; hitting a wall reflects the respective velocity component and applies the same restitution.

3. **Rim & Backboard Collisions**
   • A dedicated `checkRimBounce` routine computes radial reflection whenever the ball intersects the rim area (radius 0.55 m, height 4.25 m). Velocity is reflected about the rim’s normal and scaled by the same restitution factor, giving believable rim rattles.
   • Each `Basket` object provides `checkBackboardCollision`, ensuring that direct hits on the backboard also reflect the ball.

4. **Scoring Detection**
   • `checkScore` validates a made shot when the ball is descending (`v_y < 0`) and it passes within 0.55 m of the rim. Successful attempts update score, shot counters, and trigger a green "SHOT MADE!" banner; misses show a red message.

5. **Ball Rotation**
   • While rolling or flying, the ball spins around the axis `v × (0,1,0)` so that the rotation always matches the direction of travel. The angle increment each frame is `(speed / radius) * delta_time`, giving visually correct rolling/slipping behaviour.

6. **Time Based Integration**
   • All physics use the real-time delta returned by `THREE.Clock` ensuring frame-rate-independent simulation at 60 FPS or higher.
