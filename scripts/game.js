console.log('Olá, esta funcionando!');
// Sprite 
const sprites = new Image();
sprites.src = '../sprites/sprites.png';
// Selecionando o canvas
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
// Plano de Fundo
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
//Chão
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
// Passaro
const flappyBird = {
  spriteX:0,
  spriteY:0,
  width:33,
  height:24,
  x:10,
  y:50,
  gravity: 0.25,
  speed: 0,
  refresh() {
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
    );
  }
}
//Tela de inicio
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

//Telas 
let activeScreen = {}
function changeScreen(newScreen) {
  activeScreen = newScreen
}
const screens = {
  START: {
    draw(){
      background.draw()
      ground.draw()
      flappyBird.draw()
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
    flappyBird.draw()
  },
  refresh(){
    flappyBird.refresh()
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