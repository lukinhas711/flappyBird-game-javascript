console.log('Olá, esta funcionando!');

const sprites = new Image();
sprites.src = './sprites/sprites.png';
const soundHIT = new Audio()
soundHIT.src = './effects/hit.wav'

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const background = {
  spriteX:390,
  spriteY:0,
  width:275,
  height:204,
  x:0,
  y:canvas.height - 204,
  draw(){
    context.fillStyle = '#70c5ce'
    context.fillRect(0, 0, canvas.width, canvas.height)

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
}

const ground = {
  spriteX:0,
  spriteY:610,
  width:224,
  height:112,
  x:0,
  y:canvas.height - 112,
  draw(){
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

function collision(flappyBird, ground){
  const flappyBirdY = flappyBird.y + flappyBird.height
  const groundY = ground.y

  if(flappyBirdY >= groundY){
    return true
  }
  return false
}

function createBird(){
    const flappyBird = {
    spriteX:0,
    spriteY:0,
    width:33,
    height:24,
    x:10,
    y:50,
    jump: 4.6,
    jumping() {
      flappyBird.speed = - flappyBird.jump
    },
    gravity: 0.25,
    speed: 0,
    refresh() {
      if (collision(flappyBird, ground)) {
        soundHIT.play()
        setTimeout(() => {
          changeScreen(screens.START)
        }, 500)
        
        return
      }
      flappyBird.speed = flappyBird.speed + flappyBird.gravity
      flappyBird.y = flappyBird.y + flappyBird.speed;
    },
    draw(){
      context.drawImage(
        sprites,
        flappyBird.spriteX, flappyBird.spriteY,
        flappyBird.width, flappyBird.height,
        flappyBird.x, flappyBird.y,
        flappyBird.width, flappyBird.height,
      )
    }
  }

  return flappyBird
}


const homeScreen = {
  spriteX:134,
  spriteY:0,
  width:147,
  height:152,
  x:(canvas.width / 2) -174 /2 ,
  y:50,
  draw(){
    context.drawImage(
      sprites,
      homeScreen.spriteX, homeScreen.spriteY,
      homeScreen.width, homeScreen.height,
      homeScreen.x, homeScreen.y,
      homeScreen.width, homeScreen.height,
    );
  }
}

const global = {}
let activeScreen = {}
function changeScreen(newScreen) {
  activeScreen = newScreen
  if(activeScreen.initialize){
    activeScreen.initialize()
  }
}
const screens = {
  START: {
    initialize(){
      global.flappyBird = createBird()
     },
    draw(){
      background.draw()
      ground.draw()
      global.flappyBird.draw()
      homeScreen.draw()
    },
    click(){
      changeScreen(screens.GAME)
    },
    refresh(){

    }
  }
}

screens.GAME = {
  draw(){
    background.draw()
    ground.draw()
    global.flappyBird.draw()
  },
  click(){
    global.flappyBird.jumping()
  },
  refresh(){
    global.flappyBird.refresh()
  }
}


function loop() {
  activeScreen.draw()
  activeScreen.refresh()
  requestAnimationFrame(loop)
}

window.addEventListener('click', function(){
  if(activeScreen.click) {
    activeScreen.click();
  }
})
changeScreen(screens.START)
loop();