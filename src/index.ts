import "./style.css";
import { Chance } from "chance";
import { createNoise2D, NoiseFunction2D } from "simplex-noise";
import chroma from "chroma-js";

const cnv = document.getElementById("cnv");
const ctx = (cnv as HTMLCanvasElement).getContext("2d");
const chance = new Chance(); // initialize the noise function
let noise2D = createNoise2D();
noise2D = fbm2d(noise2D, 20);
const colorScale = chroma.scale(["black", "01001f"]);

let canvasWidth = cnv.clientWidth;
let canvasHeight = cnv.clientHeight;
console.log(`screensize: w: ${cnv.clientWidth}, h: ${cnv.clientHeight}`);
let canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
let dataCopy: Uint8ClampedArray;
let NUM_STAR1 = (800 / 1920) * canvasWidth;
let NUM_STAR2 = (100 / 1920) * canvasWidth;
let NUM_STAR3 = (20 / 1920) * canvasWidth;
let pause: boolean = false;

cnv.setAttribute("width", canvasWidth.toString());
cnv.setAttribute("height", canvasHeight.toString());

let mostNeg: number = 0;
let mostPos: number = 0;

type star = {
  color: string;
  x: number;
  y: number;
  r: number;
  twinkle: {
    isActive: boolean;
    counter: number;
  };
  isAnimated?: boolean;
  animationTik?: number;
};

function fbm2d(noise2D: NoiseFunction2D, octaves: number): NoiseFunction2D {
  return function fbm2dFn(x: number, y: number) {
    let value = 0.0;
    let amplitude = 0.5;
    for (let i = 0; i < octaves; i++) {
      value += noise2D(x, y) * amplitude;
      x *= 0.5;
      y *= 0.5;
      amplitude *= 0.8;
    }
    return value;
  };
}

function hexToR(h: string): number {
  return parseInt(h.substring(0, 2), 16);
}
function hexToG(h: string): number {
  return parseInt(h.substring(2, 4), 16);
}
function hexToB(h: string): number {
  return parseInt(h.substring(4, 6), 16);
}

const drawStar = (star: star) => {
  //x,y are percent of canvassize
  let alpha: number = 255;
  if (star.twinkle.isActive && star.twinkle.counter < 3) {
    alpha = 80;
    star.twinkle.counter += 1;
  } else if (star.twinkle.isActive && star.twinkle.counter >= 3) {
    star.twinkle.isActive = false;
    star.twinkle.counter = 0;
  } else {
    //random chance of twinkling
    if (chance.floating({ min: 0.0, max: 100.0 }) <= 0.5) {
      star.twinkle.counter += 1;
      star.twinkle.isActive = true;
    }
  }

  const newX = Math.floor((star.x / 100) * canvasWidth);
  const newY = Math.floor((star.y / 100) * canvasHeight);
  const index = canvasWidth * 4 * (newY - 1) + newX * 4;

  const red = hexToR(star.color);
  const green = hexToG(star.color);
  const blue = hexToB(star.color);

  if (!star.twinkle.isActive) {
    switch (star.r) {
      case 1:
        canvasData.data[index] = red;
        canvasData.data[index + 1] = green;
        canvasData.data[index + 2] = blue;
        canvasData.data[index + 3] = alpha;
        break;
      case 2:
        for (let i = 0; i < 2; i++) {
          canvasData.data[index + canvasWidth * i * 4] = red;
          canvasData.data[index + 1 + canvasWidth * i * 4] = green;
          canvasData.data[index + 2 + canvasWidth * i * 4] = blue;
          canvasData.data[index + 3 + canvasWidth * i * 4] = alpha;
          canvasData.data[index + 4 + canvasWidth * i * 4] = red;
          canvasData.data[index + 5 + canvasWidth * i * 4] = green;
          canvasData.data[index + 6 + canvasWidth * i * 4] = blue;
          canvasData.data[index + 7 + canvasWidth * i * 4] = alpha;
        }

        break;
      case 3:
        for (let i = 0; i < 3; i++) {
          if (i == 0 || i == 2) {
            canvasData.data[index + 4 + canvasWidth * i * 4] = red;
            canvasData.data[index + 5 + canvasWidth * i * 4] = green;
            canvasData.data[index + 6 + canvasWidth * i * 4] = blue;
            canvasData.data[index + 7 + canvasWidth * i * 4] = alpha;
          }
          if (i == 1) {
            canvasData.data[index + canvasWidth * i * 4] = red;
            canvasData.data[index + 1 + canvasWidth * i * 4] = green;
            canvasData.data[index + 2 + canvasWidth * i * 4] = blue;
            canvasData.data[index + 3 + canvasWidth * i * 4] = alpha;
            canvasData.data[index + 4 + canvasWidth * i * 4] = red;
            canvasData.data[index + 5 + canvasWidth * i * 4] = green;
            canvasData.data[index + 6 + canvasWidth * i * 4] = blue;
            canvasData.data[index + 7 + canvasWidth * i * 4] = alpha;
            canvasData.data[index + 8 + canvasWidth * i * 4] = red;
            canvasData.data[index + 9 + canvasWidth * i * 4] = green;
            canvasData.data[index + 10 + canvasWidth * i * 4] = blue;
            canvasData.data[index + 11 + canvasWidth * i * 4] = alpha;
          }
        }
        break;
      case 4:
        for (let i = 0; i < 4; i++) {
          if (i == 0 || i == 3) {
            canvasData.data[index + 4 + canvasWidth * i * 4] = red;
            canvasData.data[index + 5 + canvasWidth * i * 4] = green;
            canvasData.data[index + 6 + canvasWidth * i * 4] = blue;
            canvasData.data[index + 7 + canvasWidth * i * 4] = alpha;
            canvasData.data[index + 8 + canvasWidth * i * 4] = red;
            canvasData.data[index + 9 + canvasWidth * i * 4] = green;
            canvasData.data[index + 10 + canvasWidth * i * 4] = blue;
            canvasData.data[index + 11 + canvasWidth * i * 4] = alpha;
          }
          if (i == 1 || i == 2) {
            canvasData.data[index + canvasWidth * i * 4] = red;
            canvasData.data[index + 1 + canvasWidth * i * 4] = green;
            canvasData.data[index + 2 + canvasWidth * i * 4] = blue;
            canvasData.data[index + 3 + canvasWidth * i * 4] = alpha;
            canvasData.data[index + 4 + canvasWidth * i * 4] = red;
            canvasData.data[index + 5 + canvasWidth * i * 4] = green;
            canvasData.data[index + 6 + canvasWidth * i * 4] = blue;
            canvasData.data[index + 7 + canvasWidth * i * 4] = alpha;
            canvasData.data[index + 8 + canvasWidth * i * 4] = red;
            canvasData.data[index + 9 + canvasWidth * i * 4] = green;
            canvasData.data[index + 10 + canvasWidth * i * 4] = blue;
            canvasData.data[index + 11 + canvasWidth * i * 4] = alpha;
            canvasData.data[index + 12 + canvasWidth * i * 4] = red;
            canvasData.data[index + 13 + canvasWidth * i * 4] = green;
            canvasData.data[index + 14 + canvasWidth * i * 4] = blue;
            canvasData.data[index + 15 + canvasWidth * i * 4] = alpha;
          }
        }
        break;
      case 5:
        if (star.isAnimated) {
          star.animationTik += 1;
          if (star.animationTik >= 8) {
            star.animationTik = 0;
            star.isAnimated = false;
          }
        } else {
          //random chance that
          const roll = chance.floating({ min: 0.1, max: 100.0 });
          if (roll < 2.0) star.isAnimated = true;
        }

        for (let i = 0; i < 7; i++) {
          {
            if (i == 1 || i == 5) {
              canvasData.data[index + 8 + canvasWidth * i * 4] = red;
              canvasData.data[index + 9 + canvasWidth * i * 4] = green;
              canvasData.data[index + 10 + canvasWidth * i * 4] = blue;
              canvasData.data[index + 11 + canvasWidth * i * 4] = alpha;
            }
            if (i == 2 || i == 4) {
              canvasData.data[index + 4 + canvasWidth * i * 4] = red;
              canvasData.data[index + 5 + canvasWidth * i * 4] = green;
              canvasData.data[index + 6 + canvasWidth * i * 4] = blue;
              canvasData.data[index + 7 + canvasWidth * i * 4] = alpha;
              canvasData.data[index + 8 + canvasWidth * i * 4] = red;
              canvasData.data[index + 9 + canvasWidth * i * 4] = green;
              canvasData.data[index + 10 + canvasWidth * i * 4] = blue;
              canvasData.data[index + 11 + canvasWidth * i * 4] = alpha;
              canvasData.data[index + 12 + canvasWidth * i * 4] = red;
              canvasData.data[index + 13 + canvasWidth * i * 4] = green;
              canvasData.data[index + 14 + canvasWidth * i * 4] = blue;
              canvasData.data[index + 15 + canvasWidth * i * 4] = alpha;
            }
            if (i == 3) {
              canvasData.data[index + canvasWidth * i * 4] = red;
              canvasData.data[index + 1 + canvasWidth * i * 4] = green;
              canvasData.data[index + 2 + canvasWidth * i * 4] = blue;
              canvasData.data[index + 3 + canvasWidth * i * 4] = alpha;
              canvasData.data[index + 4 + canvasWidth * i * 4] = red;
              canvasData.data[index + 5 + canvasWidth * i * 4] = green;
              canvasData.data[index + 6 + canvasWidth * i * 4] = blue;
              canvasData.data[index + 7 + canvasWidth * i * 4] = alpha;
              canvasData.data[index + 8 + canvasWidth * i * 4] = red;
              canvasData.data[index + 9 + canvasWidth * i * 4] = green;
              canvasData.data[index + 10 + canvasWidth * i * 4] = blue;
              canvasData.data[index + 11 + canvasWidth * i * 4] = alpha;
              canvasData.data[index + 12 + canvasWidth * i * 4] = red;
              canvasData.data[index + 13 + canvasWidth * i * 4] = green;
              canvasData.data[index + 14 + canvasWidth * i * 4] = blue;
              canvasData.data[index + 15 + canvasWidth * i * 4] = alpha;
              canvasData.data[index + 16 + canvasWidth * i * 4] = red;
              canvasData.data[index + 17 + canvasWidth * i * 4] = green;
              canvasData.data[index + 18 + canvasWidth * i * 4] = blue;
              canvasData.data[index + 19 + canvasWidth * i * 4] = alpha;
            }
          }
          if (star.animationTik == 2 || star.animationTik == 3 || star.animationTik == 6 || star.animationTik == 7) {
            if (i == 0 || i == 6) {
              canvasData.data[index + 8 + canvasWidth * i * 4] = red;
              canvasData.data[index + 9 + canvasWidth * i * 4] = green;
              canvasData.data[index + 10 + canvasWidth * i * 4] = blue;
              canvasData.data[index + 11 + canvasWidth * i * 4] = alpha;
            }
            if (i == 3) {
              canvasData.data[index - 4 + canvasWidth * i * 4] = red;
              canvasData.data[index - 3 + canvasWidth * i * 4] = green;
              canvasData.data[index - 2 + canvasWidth * i * 4] = blue;
              canvasData.data[index - 1 + canvasWidth * i * 4] = alpha;
              canvasData.data[index + 20 + canvasWidth * i * 4] = red;
              canvasData.data[index + 21 + canvasWidth * i * 4] = green;
              canvasData.data[index + 22 + canvasWidth * i * 4] = blue;
              canvasData.data[index + 23 + canvasWidth * i * 4] = alpha;
            }
          }
          if (star.animationTik == 4 || star.animationTik == 5) {
            if (i == 0 || i == 6) {
              canvasData.data[index + 8 + canvasWidth * i * 4] = red;
              canvasData.data[index + 9 + canvasWidth * i * 4] = green;
              canvasData.data[index + 10 + canvasWidth * i * 4] = blue;
              canvasData.data[index + 11 + canvasWidth * i * 4] = alpha;
            }
            if (i == 1 || i == 5) {
              canvasData.data[index + canvasWidth * i * 4] = red;
              canvasData.data[index + 1 + canvasWidth * i * 4] = green;
              canvasData.data[index + 2 + canvasWidth * i * 4] = blue;
              canvasData.data[index + 3 + canvasWidth * i * 4] = alpha;
              canvasData.data[index + 16 + canvasWidth * i * 4] = red;
              canvasData.data[index + 17 + canvasWidth * i * 4] = green;
              canvasData.data[index + 18 + canvasWidth * i * 4] = blue;
              canvasData.data[index + 19 + canvasWidth * i * 4] = alpha;
            }
            if (i == 3) {
              canvasData.data[index - 4 + canvasWidth * i * 4] = red;
              canvasData.data[index - 3 + canvasWidth * i * 4] = green;
              canvasData.data[index - 2 + canvasWidth * i * 4] = blue;
              canvasData.data[index - 1 + canvasWidth * i * 4] = alpha;
              canvasData.data[index + 20 + canvasWidth * i * 4] = red;
              canvasData.data[index + 21 + canvasWidth * i * 4] = green;
              canvasData.data[index + 22 + canvasWidth * i * 4] = blue;
              canvasData.data[index + 23 + canvasWidth * i * 4] = alpha;
            }
          }
        }
        break;
    }
  }
};

const shiftStars = () => {
  starmap1.forEach(star => {
    star.x += 0.02;
    if (star.x >= 99.5) {
      star.x = 0.2;
      star.y = chance.integer({ min: 0, max: 100 });
    }
  });
  starmap2.forEach(star => {
    star.x += 0.03;
    if (star.x >= 99) {
      star.x = 1;
      star.y = chance.integer({ min: 0, max: 100 });
    }
  });
  starmap3.forEach(star => {
    star.x += 0.05;
    if (star.x >= 98) {
      star.x = 1.5;
      star.y = chance.integer({ min: 0, max: 100 });
    }
  });
};

const fillCanvas = () => {
  for (let i = 0; i < canvasData.data.length; i += 4) {
    //get x,y for this point
    const nX = i % canvasData.height;
    const nY = i % canvasData.width;

    const noisePoint = (noise2D(nX, nY) + 1) * 0.5;
    let [r, g, b] = colorScale(noisePoint).rgb();

    canvasData.data[i] = r;
    canvasData.data[i + 1] = g;
    canvasData.data[i + 2] = b;
    canvasData.data[i + 3] = 255;
  }
  dataCopy = new Uint8ClampedArray(canvasData.data);
};

window.addEventListener("load", () => {
  fillCanvas();
  requestAnimationFrame(update);
});
document.addEventListener("resize", () => {
  /*  let canvasWidth = cnv.clientWidth;
  let canvasHeight = cnv.clientHeight;
  cnv.setAttribute("width", canvasWidth.toString());
  cnv.setAttribute("height", canvasHeight.toString()); */
});
document.addEventListener("keydown", e => {
  if (e.code == "Space") {
    pause = !pause;
    if (!pause) requestAnimationFrame(update);
  }
});

const starmap1: star[] = [];
const starmap2: star[] = [];
const starmap3: star[] = [];

for (let i = 0; i < NUM_STAR1; i++) {
  const color = chance.weighted(["FFFFFF", "0AF040", "2387F9", "F22626", "E88A20"], [50, 1, 1, 1, 1]);
  const x = chance.integer({ min: 0, max: 100 });
  const y = chance.integer({ min: 0, max: 100 });
  const r = chance.integer({ min: 1, max: 3 });
  starmap1.push({
    color: color,
    x: x,
    y: y,
    r: r,
    twinkle: {
      isActive: false,
      counter: 0,
    },
  });
}

for (let i = 0; i < NUM_STAR2; i++) {
  const color = chance.weighted(["FFFFFF", "0AF040", "2387F9", "F22626", "E88A20"], [40, 1, 1, 1, 1]);
  const x = chance.integer({ min: 0, max: 100 });
  const y = chance.integer({ min: 0, max: 100 });
  const r = chance.integer({ min: 2, max: 3 });
  starmap2.push({
    color: color,
    x: x,
    y: y,
    r: r,
    twinkle: {
      isActive: false,
      counter: 0,
    },
  });
}

for (let i = 0; i < NUM_STAR3; i++) {
  const color = chance.weighted(["FFFFFF", "0AF040", "2387F9", "F22626", "E88A20"], [30, 1, 1, 1, 1]);
  const x = chance.integer({ min: 0, max: 100 });
  const y = chance.integer({ min: 0, max: 100 });
  const r = chance.integer({ min: 4, max: 5 });
  if (r == 5) {
    starmap3.push({
      color: color,
      x: x,
      y: y,
      r: r,
      twinkle: {
        isActive: false,
        counter: 0,
      },
      isAnimated: false,
      animationTik: 0,
    });
  } else {
    starmap3.push({
      color: color,
      x: x,
      y: y,
      r: r,
      twinkle: {
        isActive: false,
        counter: 0,
      },
    });
  }
}

let startime: number,
  lasttime: number,
  fps: string,
  lastRenderUpdate: number = 0;
let renderInterval: number = 0.016;

const update = (timestamp: number) => {
  let runagain = true;
  if (startime == undefined) {
    startime = timestamp;
    lasttime = timestamp;
  }
  let deltaTime = (timestamp - lasttime) / 1000;
  if (deltaTime > 1.5) {
    deltaTime = 0;
    lasttime = timestamp;
  }

  fps = (1 / deltaTime).toFixed(2);
  lasttime = timestamp;
  lastRenderUpdate += deltaTime;

  while (lastRenderUpdate >= renderInterval) {
    shiftStars();

    canvasData.data.set(dataCopy);
    starmap1.forEach(star => drawStar(star));
    starmap2.forEach(star => drawStar(star));
    starmap3.forEach(star => drawStar(star));
    ctx.putImageData(canvasData, 0, 0);

    lastRenderUpdate -= renderInterval;
  }
  if (!pause) requestAnimationFrame(update);
};
