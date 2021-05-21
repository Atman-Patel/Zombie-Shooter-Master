import { width, height } from "../config.js"
import { distance } from "../libs/utils.js"

class Bullet {
  // radius = 4
  // speed = 10
  // damage = 1
  constructor(x, y, angle,damage,speed,bulletRadius) {
    this.angle = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    }
    this.vector = {
      x: x + this.angle.x * 40,
      y: y + this.angle.y * 40
    }
    this.damage = damage
    this.speed = speed
    this.radius = bulletRadius
  }

  boundary() {
    return (this.vector.x > width + this.radius ||
      this.vector.y > height + this.radius ||
      this.vector.x < 0 - this.radius ||
      this.vector.y < 0 - this.radius)
  }


  update(bullets, zombies, killcount) {
    if (this.boundary()) {
      bullets = bullets.splice(bullets.indexOf(this), 1)
      return
    }

    for (const bullet of bullets) {
      for (const zombie of zombies) {
        let d = distance(zombie.vector.x, zombie.vector.y, this.vector.x, this.vector.y)
        if (d < zombie.radius) {
          bullets = bullets.splice(bullets.indexOf(this), 1)
          zombie.health -= this.damage
          if (zombie.health <= 0) {
            return 1
          }
          return 2
        }
      }
    }

    this.vector.x += this.angle.x * this.speed
    this.vector.y += this.angle.y * this.speed
  }

  render(ctx) {
    ctx.beginPath()
    ctx.arc(this.vector.x, this.vector.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = "#000"
    ctx.fill()
  }
}

export default Bullet