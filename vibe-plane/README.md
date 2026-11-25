# Vibe Plane

<img src="result.png" />

## Description

A third person flight game built with plain HTML and JavaScript, no libraries. A small canvas 3D renderer draws a glossy racing plane with a three blade propeller, patchwork fields, lakes, trees, a runway, clouds and fog.

The world is alive: farms with houses and barns, windmills, grazing sheep and cows, flocks of birds and party balloons you can shoot.

## Controls

* Arrow Up and Arrow Down: climb and dive.
* Arrow Left and Arrow Right: bank and turn.
* W and S: throttle up and down.
* Space: fire the wing guns. Popping a balloon is worth 100 points.
* 1, 2, 3: toggle rain, snow and night. The buttons at the top right do the same.
* M: toggle sound.
* R: restart.

Fly too slow and the plane stalls. Hit the ground too fast or banked and you crash. A gentle touch down is a landing, the gear comes down near the ground.

Sounds are generated with the Web Audio API: engine, wind, rain, guns, balloon pops, thunder, crash and warning beeps. They start after the first key press or click.

## How to Run the Game

```bash
npm start
```

Or open `index.html` in a web browser.
