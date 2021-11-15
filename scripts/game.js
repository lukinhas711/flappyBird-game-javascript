console.log('Olá, esta funcionando!');


let frames = 0;
const sprites = new Image();
sprites.src = './sprites/sprites.png';

const soundHIT = new Audio();
soundHIT.src = './effects/hit.wav';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');


const background = {
  spriteX: 390,
  spriteY: 0,
  width: 275,
  height: 204,
  x: 0,
  y: canvas.height - 204,
  draw() {
    context.fillStyle = '#70c5ce';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.drawImage(
      sprites,
      background.spriteX, background.spriteY,
      background.width, background.height,
      background.x, background.y,
      background.width, background.height,
    );

    context.drawImage(
      sprites,
      background.spriteX, background.spriteY,
      background.width, background.height,
      (background.x + background.width), background.y,
      background.width, background.height,
    );
  }
};

function createGround() {
  const ground = {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
    refresh() {
      const groundMoviment = 1
      const repeatIn = ground.width / 2
      const animation = ground.x - groundMoviment

      ground.x = animation % repeatIn
    },
    draw() {
      context.drawImage(
        sprites,
        ground.spriteX, ground.spriteY,
        ground.width, ground.height,
        ground.x, ground.y,
        ground.width, ground.height,
      );

      context.drawImage(
        sprites,
        ground.spriteX, ground.spriteY,
        ground.width, ground.height,
        (ground.x + ground.width), ground.y,
        ground.width, ground.height,
      );
    }
  }
  return ground;
};


function collision(flappyBird, ground) {
  const flappyBirdY = flappyBird.y + flappyBird.height;
  const groundY = ground.y;

  if (flappyBirdY >= groundY) {
    return true;
  }
  return false;
};

function createBird() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50,
    jump: 4.6,
    jumping() {
      flappyBird.speed = - flappyBird.jump;
    },
    gravity: 0.25,
    speed: 0,
    refresh() {
      if (collision(flappyBird, global.ground)) {
        soundHIT.play();
        setTimeout(() => {
          changeScreen(screens.START);
        }, 500);

        return;
      };
      flappyBird.speed = flappyBird.speed + flappyBird.gravity;
      flappyBird.y = flappyBird.y + flappyBird.speed;
    },
    //arrumar bug = o refreshFrame faz os calculos, mas não alterna entre as posições do array
    mov: [
      {spriteX: 0, spriteY: 0,},
      {spriteX: 0, spriteY: 26,},
      {spriteX: 0, spriteY: 52,},
      {spriteX: 0, spriteY: 26,},
    ],
    atualFrame: 0,
    refreshFrame(){
      const frameInterval = 10;
      const breakInterval = frames % frameInterval === 0;
      if(breakInterval) {
        const incrementBase = 1;
        const increment = incrementBase + flappyBird.atualFrame;
        const repeatBase = flappyBird.mov.length;
        // console.log('incremento', increment)
        // console.log('base da repetição', repeatBase)
        // console.log('frame', increment % repeatBase)
        flappyBird.atualFrame = increment % repeatBase;
      }
    },
    draw() {
      flappyBird.refreshFrame();
      const { spriteX, spriteY } = flappyBird.mov[flappyBird.atualFrame];
      context.drawImage(
        sprites,
        spriteX, spriteY,
        flappyBird.width, flappyBird.height,
        flappyBird.x, flappyBird.y,
        flappyBird.width, flappyBird.height,
      )
    }
  };

  return flappyBird
};


const homeScreen = {
  spriteX: 134,
  spriteY: 0,
  width: 147,
  height: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  draw() {
    context.drawImage(
      sprites,
      homeScreen.spriteX, homeScreen.spriteY,
      homeScreen.width, homeScreen.height,
      homeScreen.x, homeScreen.y,
      homeScreen.width, homeScreen.height,
    );
  }
};

function createPipes(){
  const pipes = {
    width: 52,
    height: 400,
    ground: {
      spriteX:0,
      spriteY:169,
    },
    sky: {
      spriteX:52,
      spriteY:169,
    },
    space: 80,
    draw() {
      pipes.pairs.forEach(function(pair){
        const randonY = pair.y;
        const spacePipes = 90;

        const pipeSkyX = pair.x;
        const pipeSkyY = randonY;
        context.drawImage(
          sprites,
          pipes.sky.spriteX, pipes.sky.spriteY,
          pipes.width, pipes.height,
          pipeSkyX, pipeSkyY,
          pipes.width, pipes.height,
        );

        const pipeGroundX = pair.x;
        const pipeGroundY = pipes.height + spacePipes + randonY;
        context.drawImage(
          sprites,
          pipes.ground.spriteX, pipes.ground.spriteY,
          pipes.width, pipes.height,
          pipeGroundX, pipeGroundY,
          pipes.width, pipes.height,
        )

        pair.pipeSky = {
          x: pipeSkyX,
          y: pipes.height + pipeSkyY
        }
        pair.pipeGround = {
          x: pipeGroundX,
          y: pipeGroundY
        }
      })
    },
    collision(pair){
      const head = global.flappyBird.y;
      const foot = global.flappyBird.y + global.flappyBird.height;

      if(global.flappyBird.x >= pair.x){
        if(head <= pair.pipeSky.y){
          return true;
        }
        if(foot >= pair.pipeGround.y){
          return true
        }
        return false
      }
    },
    pairs:[],
    refresh(){
      const passed100frames = frames % 100 === 0;
      if (passed100frames) {
        pipes.pairs.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        })
      }
      pipes.pairs.forEach(function(pair){
        pair.x = pair.x - 2

        if(pipes.collision(pair)){
          soundHIT.play();
          setTimeout(() => {
            changeScreen(screens.START);
          }, 500);

        return;
        }

        if(pair.x + pipes.width <= 0){
          pipes.pairs.shift()
        }
      })
    }
  }
  return pipes;
}

const global = {};
let activeScreen = {};
function changeScreen(newScreen) {
  activeScreen = newScreen
  if (activeScreen.initialize) {
    activeScreen.initialize()
  }
};
const screens = {
  START: {
    initialize() {
      global.flappyBird = createBird();
      global.ground = createGround();
      global.pipes = createPipes();
    },
    draw() {
      background.draw();
      global.flappyBird.draw();
      global.ground.draw();
      homeScreen.draw();
    },
    click() {
      changeScreen(screens.GAME);
    },
    refresh() {
      global.ground.refresh();
    }
  }
}

screens.GAME = {
  draw() {
    background.draw()
    global.pipes.draw()
    global.ground.draw()
    global.flappyBird.draw()
  },
  click() {
    global.flappyBird.jumping()
  },
  refresh() {
    global.flappyBird.refresh()
    global.pipes.refresh()
    global.ground.refresh()
  }
}


function loop() {
  activeScreen.draw();
  activeScreen.refresh();
  frames = frames + 1;
  requestAnimationFrame(loop);
  // console.log('frameatual', frames)
}

window.addEventListener('click', function () {
  if (activeScreen.click) {
    activeScreen.click();
  };
})
changeScreen(screens.START);
loop();