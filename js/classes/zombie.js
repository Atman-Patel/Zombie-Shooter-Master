import { width, height } from "../config.js"
import { random } from "../libs/utils.js"


class Zombie {
  speed = 3
  radius = 20
  health = 5
  damage = 5
  color = "#00cc44"
  // costume = "closed"

  constructor(player) {
    this.vector = {
      x: (random(-this.radius, width + this.radius) === player.x) ? random(-this.radius, width + this.radius) : random(-this.radius, width + this.radius),
      y: (random(-this.radius, height + this.radius) === player.y) ? random(-this.radius, height + this.radius) : random(-this.radius, height + this.radius)
    }
    this.rotate(player)
  }

  rotate(player) {
    let dy = player.vector.y - this.vector.y
    let dx = player.vector.x - this.vector.x
    this.angle = Math.atan2(dy, dx)
  }

  update(player, zombies, pause) {
    if (this.health <= 0) {
      zombies = zombies.splice(zombies.indexOf(this), 1)
      return
    }
    if (!pause) {
      this.rotate(player)
      this.vector.x += Math.cos(this.angle) * this.speed
      this.vector.y += Math.sin(this.angle) * this.speed
    }
  }

  render(ctx, frame) {
    ctx.save()

    let tX = this.vector.x
    let tY = this.vector.y
    ctx.translate(tX, tY)
    ctx.rotate(this.angle)
    ctx.translate(-tX, -tY)

    ctx.beginPath()
    ctx.fillStyle = this.color
    ctx.arc(this.vector.x, this.vector.y, this.radius, 0, Math.PI * 2)
    // ctx.stroke()
    ctx.fill()

    // Hands
    ctx.beginPath()
    ctx.strokeStyle = this.color
    ctx.lineCap = "round"
    ctx.lineWidth = 4

    // Right Hand
    // if(frame % 50 == 0) {
    //   this.costume = this.costume == "closed" ? "open" : "closed"
    // }

    // if(this.costume == "closed") {
    ctx.moveTo(this.vector.x + 5, this.vector.y + this.radius - 2)
    ctx.lineTo(this.vector.x + this.radius + 15, this.vector.y + this.radius - 5)
    ctx.stroke()

    // Left Hand
    ctx.moveTo(this.vector.x + 5, this.vector.y - this.radius + 2)
    ctx.lineTo(this.vector.x + this.radius + 15, this.vector.y - this.radius + 5)
    ctx.stroke()
    // }
    // else {
    //   ctx.moveTo(this.vector.x + 5, this.vector.y + this.radius - 2) 
    //   ctx.lineTo(this.vector.x + this.radius, this.vector.y + 10)
    //   ctx.stroke()

    //   // Left Hand
    //   ctx.moveTo(this.vector.x + 5, this.vector.y - this.radius + 2)
    //   ctx.lineTo(this.vector.x + this.radius, this.vector.y - 10)
    //   ctx.stroke()
    // }


    ctx.restore()
  }
}


export default Zombie
