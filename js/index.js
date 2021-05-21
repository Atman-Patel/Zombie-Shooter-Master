import animate from "./libs/animate.js"
import pointer from "./libs/pointer.js"
import resize from "./libs/resize.js"
import { width, height } from "./config.js"
import key from "./libs/input.js"

import Player from "./classes/player.js"
import Zombie from "./classes/zombie.js"
import Bullet from "./classes/bullet.js"
import HealthBar from "./classes/healthBar.js"


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
  if (!pause) {
    bullets.push(
      new Bullet(player.vector.x, player.vector.y, player.angle + (gunAcc + Math.random() * -gunAcc))
    )
    bullets[bullets.length - 1].damage += (0.3 * waveCount)

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
      zombie.damage -= (0.07 * waveCount)
      zombie.radius += (1 * waveCount)
      zombie.health += (0.5 * waveCount)
      zombieHealthBar.push(new HealthBar(healthBarX, healthBarY, 75, 10, zombie, zombies[zombies.length - 1].health, "red"))
      if ((zombieCount - ((waveCount - 1) * zombieInAWave)) == (zombieInAWave - 1)) {
        zombie.radius += 10
        zombie.speed += 2
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