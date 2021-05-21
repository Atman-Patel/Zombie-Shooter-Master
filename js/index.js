import animate from "./libs/animate.js"
import pointer from "./libs/pointer.js"
import resize from "./libs/resize.js"
import { width, height } from "./config.js"
import key from "./libs/input.js"

import Player from "./classes/player.js"
import Zombie from "./classes/zombie.js"
import Bullet from "./classes/bullet.js"
import HealthBar from "./classes/healthBar.js"

const Pistol = {
  gun:'Pistol',
  unlockInWave:1,
  num:'1',
  statusH2:'unlocked',
  damage: 20,
  bulletRadius: 4,
  speed: 10,
  accuracy:50,
  fireRate:'Semi-Auto',
  autoFire:false,
  element:{
    damage:'',
    bulletRadius:'',
    speed:'',
    accuracy:'',
    fireRate:'',
    statusH2:'',
    tab:'',
  },
  canvasElements:{
    img:'',
    imgSrc:'./Guns/Pistol-container.png',
    imgCoords:{
      x:460,
      y:55,
      width:71,
      height:60,
    }
  }
};
const Smg = {
  gun:'Smg',
  unlockInWave:3,
  num:'2',
  statusH2:'locked',
  damage: 12,
  bulletRadius: 3,
  speed: 13,
  accuracy:30,
  fireRate:9,
  autoFire:true,
  element:{
    damage:'',
    bulletRadius:'',
    speed:'',
    accuracy:'',
    fireRate:'',
    statusH2:'',
    tab:'',
  },
  canvasElements:{
    img:'',
    imgSrc:'./Guns/Smg-container.png',
    imgCoords:{
      x:460,
      y:55,
      width:142,
      height:68,
    }
  }
};
const Ar = {
  gun:'Ar',
  num:'3',
  unlockInWave:5,
  statusH2:'locked',
  damage: 30,
  bulletRadius: 4,
  speed: 15,
  accuracy:70,
  fireRate:6,
  autoFire:true,
  element:{
    damage:'',
    bulletRadius:'',
    speed:'',
    accuracy:'',
    fireRate:'',
    statusH2:'',
    tab:'',
  },
  canvasElements:{
    img:'',
    imgSrc:'./Guns/Ar-container.png',
    imgCoords:{
      x:460,
      y:55,
      width:143,
      height:75,
    }
  }
};
const Sniper = {
  gun:'Sniper',
  unlockInWave:8,
  num:'4',
  statusH2:'locked',
  damage: 200,
  bulletRadius: 7,
  speed: 20,
  accuracy:100,
  fireRate:1/1,
  autoFire:true,
  element:{
    damage:'',
    bulletRadius:'',
    speed:'',
    accuracy:'',
    fireRate:'',
    statusH2:'',
    tab:'',
  },
  canvasElements:{
    img:'',
    imgSrc:'./Guns/Sniper-container.png',
    imgCoords:{
      x:460,
      y:55,
      width:153,
      height:68,
    }
  }
};
const MachineGun = {
  gun:'MachineGun',
  unlockInWave:13,
  num:'5',
  statusH2:'locked',
  damage: 7.5,
  bulletRadius: 2,
  speed: 11,
  accuracy:20,
  fireRate:15,
  autoFire:true,
  element:{
    damage:'',
    bulletRadius:'',
    speed:'',
    accuracy:'',
    fireRate:'',
    statusH2:'',
    tab:'',
  },
  canvasElements:{
    img:'',
    imgSrc:'./Guns/MachineGun-container.png',
    imgCoords:{
      x:460,
      y:55,
      width:151,
      height:88,
    }
  }
};
const Shotgun = {
  gun:'Shotgun',
  unlockInWave:16,
  num:'6',
  statusH2:'locked',
  damage: 33,
  bulletRadius: 4,
  speed:8,
  accuracy:100,
  spread:[0.1,0.05,0,-0.05,-0.1],
  fireRate:1,
  autoFire:true,
  element:{
    damage:'',
    bulletRadius:'',
    speed:'',
    accuracy:'',
    fireRate:'',
    statusH2:'',
    tab:'',
  },
  canvasElements:{
    img:'',
    imgSrc:'./Guns/Shotgun-container.png',
    imgCoords:{
      x:460,
      y:55,
      width:139,
      height:56,
    }
  }
};

const canvas = document.getElementById("app-scene");
const ctx = canvas.getContext("2d");

let killcount = 0;
let zombieRate = 170;
let waveCount = 0;

resize(canvas)

const player = new Player()
const bullets = []
const zombies = []
let zombieHealthBar = []

let playerSpeed = player.speed
let zombieSpeed = 3.2
let bulletSpeed = 10
let zombieHealth = 5

//gun related items
let gunSelector = [[Number(Pistol.num),Pistol],[Number(Smg.num),Smg],[Number(Ar.num),Ar],[Number(Sniper.num),Sniper],[Number(MachineGun.num),MachineGun],[Number(Shotgun.num),Shotgun]];
let gunElementSelector = [Pistol,Smg,Ar,Sniper,MachineGun,Shotgun];
let currentGun = Pistol;
let timer;
let autoFire = currentGun.autoFire;
let clicked = true;
document.querySelector(`#tab-1`).checked = true;

gunElementSelector.forEach((gun)=>{
  let img = new Image();
  gun.element.damage = document.querySelector(`.${gun.gun}--Damage`);
  gun.element.bulletRadius = document.querySelector(`.${gun.gun}--Br`);
  gun.element.speed = document.querySelector(`.${gun.gun}--Speed`);
  gun.element.accuracy = document.querySelector(`.${gun.gun}--Accuracy`);
  gun.element.fireRate = document.querySelector(`.${gun.gun}--FireRate`);
  gun.element.statusH2 = document.querySelector(`.${gun.gun}--Status`);
  gun.element.tab = document.querySelector(`#tab-${gun.num}`);
  img.src = gun.canvasElements.imgSrc;
  gun.canvasElements.img = img;
});
gunSelector.forEach((lst)=>{
  let tab = document.querySelector(`#tab-${lst[0]}`);
  document.addEventListener('keydown',(e)=>{
      if(e.key == lst[0] && lst[1].statusH2 !== 'locked'){
          tab.checked = true;
          currentGun = lst[1];
          clearInterval(timer)
      }
  });
  tab.addEventListener('click',(e)=>{
    if(lst[1].statusH2 == 'unlocked'){
      currentGun = lst[1];
      clearInterval(timer)
    }else if(lst[1].statusH2 == 'locked'){
      currentGun.element.tab.checked = true;
    }
  });
  lst[1].element.damage.textContent = `Damage: ${Math.round(lst[1].damage)}% (of zombie health)`;
  lst[1].element.bulletRadius.textContent = `Bullet Radius: ${lst[1].bulletRadius}`;
  lst[1].element.speed.textContent = `Bullet Speed:${lst[1].speed}`;
  lst[1].element.accuracy.textContent = `Accuracy: ${lst[1].accuracy}%`;
  if(lst[1].fireRate ==Sniper.fireRate){
    lst[1].element.fireRate.textContent = `Firerate: 1 bullet per ${1/lst[1].fireRate} seconds(need to keep the left button(on mouse) pressed for ${1/lst[1].fireRate} seconds to shoot one bullet)`;
  }else if(lst[1].gun == Pistol.gun){
    lst[1].element.fireRate.textContent = `Firerate: ${lst[1].fireRate}`;
  }else{
    lst[1].element.fireRate.textContent = `Firerate: ${lst[1].fireRate} bullets per second`;
  }
  lst[1].element.statusH2.textContent = `${lst[1].gun} (${lst[1].statusH2})`;
  if(lst[1].statusH2 == "locked"){
    document.querySelector(`.${lst[1].gun}--label`).classList.add('locked');
  }
});
setInterval(()=>{
  gunElementSelector.forEach((gun)=>{
    if(gun.unlockInWave <= waveCount){
      gun.statusH2 = "unlocked";
    }
    // else{
    //   gun.statusH2 = "locked";
    // }
    gun.element.damage.textContent = `Damage: ${gun.damage}% (of zombie health)`;
    gun.element.bulletRadius.textContent = `Bullet Radius: ${gun.bulletRadius}`;
    gun.element.speed.textContent = `Bullet Speed:${gun.speed}`;
    gun.element.accuracy.textContent = `Accuracy: ${gun.accuracy}%`;
    if(gun.fireRate ==Sniper.fireRate){
      gun.element.fireRate.textContent = `Firerate: 1 bullet per ${1/gun.fireRate} seconds(need to keep the left button(on mouse) pressed for ${1/gun.fireRate} seconds to shoot one bullet)`;
    }else if(gun.gun == Pistol.gun){
      gun.element.fireRate.textContent = `Firerate: ${gun.fireRate}`;
    }else{
      gun.element.fireRate.textContent = `Firerate: ${gun.fireRate} bullets per second`;
    }
    if(gun.statusH2 == "unlocked"){
      document.querySelector(`.${gun.gun}--label`).classList.remove('locked');
    }
    gun.element.statusH2.textContent = `${gun.gun} (${gun.statusH2})`;
  })
},1000);

//Auto click
canvas.addEventListener('mousedown',(e)=>{
  if(e.button == 2 ||e.button == 3){clearInterval(timer)}
	clearInterval(timer);
  clicked = true;
	timer = setInterval(()=>{
    if(clicked && currentGun.autoFire){
    if(currentGun.gun !== 'Sniper' && currentGun.gun !== 'Shotgun'){
    bullets.push(
      new Bullet(player.vector.x, player.vector.y, player.angle + ((1/currentGun.accuracy) + Math.random() * -(1/currentGun.accuracy)),((currentGun.damage)/100)*zombieHealth,currentGun.speed,currentGun.bulletRadius)
    )
    if (player.health > 0) {
      numBullet += 1
    }
  }else if(currentGun.gun == 'Sniper'){
      bullets.push(
        new Bullet(player.vector.x, player.vector.y, player.angle,((currentGun.damage)/100)*zombieHealth,currentGun.speed,currentGun.bulletRadius)
      )
      if (player.health > 0) {
        numBullet += 1
      }
    }else if(currentGun.gun == 'Shotgun'){
      // console.log('shotgun fired')
      currentGun.spread.forEach((spr)=>{
        bullets.push(
        new Bullet(player.vector.x, player.vector.y, player.angle+spr,((currentGun.damage)/100)*zombieHealth,currentGun.speed,currentGun.bulletRadius))
      })
      if (player.health > 0) {
        numBullet += 5
      }
    }
    }
    },1000/currentGun.fireRate);
});
window.addEventListener('mouseup',(e)=>{
if(e.button == 2||e.button == 3){clearInterval(timer)}
clearInterval(timer);
clicked = false;
});

//healthbar
let prevHealth = 100
let health = 100;
let waveFreq = 20
let numBullet = 0
let numBulletHit = 0
let gunAcc = 0.02
const zombieInAWave = 10
let pause = false

const healthBarWidth = 150;
const healthBarHeight = 20;

let healthBarX = width / 2 - healthBarWidth / 2;
let healthBarY = height / 2 - healthBarHeight / 2;
let healthBar = new HealthBar(healthBarX, healthBarY, healthBarWidth, healthBarHeight, player, health, "#00C22C");

const frame = function () {
  if (player.health > 0) {
    healthBar.show(ctx);
    requestAnimationFrame(frame);
  }
}

document.addEventListener('keyup', (e) => {
  if (e.key == 'p' && !pause) {
    player.speed = 0
    pause = true
    bullets.forEach((bullet) => {
      bullet.speed = 0
    })
  } else if (e.key == 'p' || e.key == 'w' || e.key == 'a' || e.key == 's' || e.key == 'd' || e.key == 'Escape' && pause) {
    pause = false
    player.speed = playerSpeed
    bullets.forEach((bullet) => {
      bullet.speed = bulletSpeed
    })
  }
})
document.addEventListener('keydown', (e) => {

})

document.body.addEventListener("click", () => {
  if (!pause && currentGun.autoFire == false) {
    bullets.push(
      new Bullet(player.vector.x, player.vector.y, player.angle + ((1/currentGun.accuracy) + Math.random() * -(1/currentGun.accuracy)),((currentGun.damage)/100)*zombieHealth,currentGun.speed,currentGun.bulletRadius)
    )

    if (player.health > 0) {
      numBullet += 1
    }
  }
})

document.body.addEventListener("mousemove", (e) => {
  if (!pause) {
    let mouse = pointer(canvas, e)
    player.rotate(mouse)
  }
})

let imgLoad = function(img,x,y,width,height,ctx) {
  ctx.drawImage(img,x,y,width,height);
};
// let frequency = 400
let zombieCount = 0
const update = (frame) => {
  prevHealth = health
  health = player.health
  ctx.clearRect(0, 0, width, height)

  if (player.health <= 1) {
    ctx.rect((width / 2) - 280, (height / 2) - 170, 575, 380);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.font = '50px Courier';
    ctx.fillStyle = "black";
    ctx.fillText("GAME OVER", (width / 2) - 125, (height / 2) - 90)
    ctx.font = '30px Courier';
    ctx.fillText(`Kills: ${killcount}`, (width / 2) - 220, (height / 2) - 20)
    ctx.fillText(`Wave: ${waveCount}`, (width / 2) - 220, (height / 2) + 20)
    ctx.fillText(`Bullet shots: ${numBullet}`, (width / 2) - 220, (height / 2) + 60)
    ctx.fillText(`Bullets hit to zombies: ${numBulletHit}`, (width / 2) - 220, (height / 2) + 100)
    let aimAcc = Math.round((numBulletHit / numBullet) * 100)
    if (!aimAcc) {
      aimAcc = 0
    }
    ctx.fillText(`Aim accuracy: ${aimAcc}%`, (width / 2) - 220, (height / 2) + 140)
    healthBar = 0
  } else if (pause) {
    ctx.rect((width / 2) - 280, (height / 2) - 170, 575, 440);
    ctx.fillStyle = 'grey';
    ctx.fill();
    ctx.font = '50px Courier';
    ctx.fillStyle = "black";
    ctx.fillText("PAUSED", (width / 2) - 75, (height / 2) - 90)
    ctx.font = '30px Courier';
    ctx.fillText(`Health: ${Math.round(health)}%`, (width / 2) - 220, (height / 2) - 20)
    ctx.fillText(`Kills: ${killcount}`, (width / 2) - 220, (height / 2) + 20)
    ctx.fillText(`Wave: ${waveCount}`, (width / 2) - 220, (height / 2) + 60)
    ctx.fillText(`Bullet shots: ${numBullet}`, (width / 2) - 220, (height / 2) + 100)
    ctx.fillText(`Bullets hit to zombies: ${numBulletHit}`, (width / 2) - 220, (height / 2) + 140)
    let aimAcc = Math.round((numBulletHit / numBullet) * 100)
    if (!aimAcc) {
      aimAcc = 0
    }
    ctx.fillText(`Aim accuracy: ${aimAcc}%`, (width / 2) - 220, (height / 2) + 180)
    ctx.fillText('*Press "P" to unpause', (width / 2) - 220, (height / 2) + 220)
    healthBar.x = (width / 2) + 30
    healthBar.y = (height / 2) - 37
  } else {
    //top left info
    ctx.rect(180, 55, 270, 270);
    ctx.fillStyle = 'grey';
    ctx.fill();
    ctx.font = '20px Courier';
    ctx.fillStyle = "white";
    ctx.fillText(`Kills: ${killcount}`, 200, 100)
    ctx.fillText(`Player Health: ${Math.round(health)}%`, 200, 140)
    ctx.fillText(`Wave: ${waveCount}`, 200, 180)
    ctx.fillText(`Bullet shot: ${numBullet}`, 200, 220)
    let aimAcc = Math.round((numBulletHit / numBullet) * 100)
    if (!aimAcc) {
      aimAcc = 0
    }
    ctx.fillText(`Aim accuracy: ${aimAcc}%`, 200, 260)
    ctx.fillText('*Press "P" to pause', 200, 300)
    imgLoad(currentGun.canvasElements.img,currentGun.canvasElements.imgCoords.x,currentGun.canvasElements.imgCoords.y,currentGun.canvasElements.imgCoords.width,currentGun.canvasElements.imgCoords.height,ctx);


    bullets.forEach(bullet => {
      const arg = bullet.update(bullets, zombies, killcount)
      if (arg == 1) {
        numBulletHit += 1
        killcount += 1

      } else if (arg == 2) {
        numBulletHit += 1
      }
      bullet.render(ctx)
    })

    player.updateHealth(zombies)

    zombies.forEach(zombie => {
      zombie.update(player, zombies, pause)
      zombie.render(ctx, frame)
    })

    player.update()
    player.render(ctx)

    if (killcount / zombieInAWave == waveCount) {
      waveCount += 1
      zombieRate = zombieRate - waveFreq
      waveFreq -= 2
      player.speed += 0.3
      if (player.health !== 100 && (player.health + 15) <= 100) {
        player.health += 15
        health += 15
        healthBar.updateHealthBar(player.health)
      } else {
        player.health = 100
        health = 100
        healthBar.updateHealthBar(player.health)
      }
    }

    if (frame % zombieRate == 0 && !pause) {
      zombies.push(new Zombie(player))
      let zombie = zombies[zombies.length - 1]
      zombie.speed += (0.15 * waveCount)
      zombie.damage += (0.01 * waveCount)
      zombie.radius += (1 * waveCount)
      zombie.health += (0.5 * waveCount)
      zombieHealth = zombie.health
      zombieHealthBar.push(new HealthBar(healthBarX, healthBarY, 75, 10, zombie, zombies[zombies.length - 1].health, "red"))
      if ((zombieCount - ((waveCount - 1) * zombieInAWave)) == (zombieInAWave - 1)) {
        zombie.radius *= 1.5
        zombie.speed *= 1.5
        zombie.damage += 20
        zombie.color = '#79BE00';
        zombie.health *= 2;
        zombieHealthBar[zombieHealthBar.length - 1].maxHealth = zombie.health
        zombie.x = width
      }
      zombieCount += 1
    }

    if (prevHealth !== health) {
      healthBar.updateHealthBar(health)
    }

    healthBar.x = player.vector.x - (healthBar.maxWidth / 2)
    healthBar.y = player.vector.y - player.radius - 30
    let index = 0
    zombieHealthBar.forEach((hB) => {
      if (hB.target.health <= 0) {
        zombieHealthBar.splice(index, 1)
      } else {
        hB.x = hB.target.vector.x - (hB.maxWidth / 2)
        hB.y = hB.target.vector.y - hB.target.radius - 30
        hB.updateHealthBar(hB.target.health)
        hB.show(ctx)
      }
      index += 1
    })
    if (!pause) {
      playerSpeed = player.speed
    }

  }
}

animate(update)
frame()
