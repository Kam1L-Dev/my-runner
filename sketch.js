var PLAY = 1;
var END = 0;
var gameState = PLAY;

var kid, kid_running, kid_collided;
var ground, invisibleGround, groundImage;

var nrgdrinkssGroup, nrgdrinksImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score=0;

var gameOver, restart;



function preload(){
  kid_running =   loadImage("kidrunner.png");
  kid_collided = loadImage("kidrunner.png");
  
  groundImage = loadImage("kidback.jpg");
  
  nrgdrinksImage = loadImage("veggie11.png");
  
  obstacle1 = loadImage("chocolate222.png");
  obstacle2 = loadImage("chocolate222.png");
  obstacle3 = loadImage("chocolate222.png");
  
  gameOverImg = loadImage("game_over_.png");
  restartImg = loadImage("restartbutton.png");
}

function setup() {
  createCanvas(600, 200);
  
  kid = createSprite(50,180,20,50);
  
  kid.addImage("running", kid_running);
  kid.addImage("collided", kid_collided);
  kid.scale = 0.2;
  
  ground = createSprite(200,180,400,20);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.visible = false;  
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.1;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,800,10);
  invisibleGround.visible = true;
  
  nrgdrinkssGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  kid.debug = false;
  background(255);
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && kid.y >= 150) {
      kid.velocityY = -12;
    }
   console.log(kid.y)
    kid.velocityY = kid.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    kid.collide(invisibleGround);
    spawnnrgdrinkss();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(kid)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    kid.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    nrgdrinkssGroup.setVelocityXEach(0);
    
    //change the kid animation
    kid.changeAnimation("collided",kid_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    nrgdrinkssGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnnrgdrinkss() {
  //write code here to spawn the nrgdrinkss
  if (frameCount % 60 === 0) {
    var nrgdrinks = createSprite(600,120,40,10);
    nrgdrinks.y = Math.round(random(80,120));
    nrgdrinks.addImage(nrgdrinksImage);
    nrgdrinks.scale = 0.1;
    nrgdrinks.velocityX = -3;
    
        if(kid.isTouching(nrgdrinkssGroup)){
     nrgdrinkssGroup.destroyEach();
        }
     //assign lifetime to the variable
    nrgdrinks.lifetime = 200;
    
    //adjust the depth
    nrgdrinks.depth = kid.depth;
    kid.depth = kid.depth + 1;
    
    //add each nrgdrinks to the group
    nrgdrinkssGroup.add(nrgdrinks);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    obstacle.debug = true;
  obstacle.setCollider("rectangle",100,100,100,100);
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  nrgdrinkssGroup.destroyEach();
  
  kid.changeAnimation("running",kid_running);
  
 
  
  score = 0;
  
}