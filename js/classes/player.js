import key from "../libs/input.js"
import { width, height } from "../config.js"
import { distance } from "../libs/utils.js"

class Player {
  vector = {
    x: width / 2,
    y: height / 2
  }
  name = 'player'
  speed = 2
  radius = 20
  angle = - Math.PI / 2
  health = 100
  rotate({ x, y }) {
    let dy = y - this.vector.y
    let dx = x - this.vector.x
    this.angle = Math.atan2(dy, dx)
  }

  move() {
    if ((key("w") || key("W") || key("ArrowUp"))&& this.vector.y - this.speed - this.radius > 0 ) {
      this.vector.y -= this.speed
    }
    if ((key("s") || key("S") || key("ArrowDown")) && this.vector.y + this.speed + this.radius < height) {
      this.vector.y += this.speed
    }
    if ((key("a")|| key("A") || key("ArrowLeft")) && this.vector.x - this.speed - this.radius > 0 ) {
      this.vector.x -= this.speed
    }
    if ((key("d") || key("D") || key("ArrowRight")) && this.vector.x + this.speed + this.radius < width) {
      this.vector.x += this.speed
    }
  }

  boundary() {
    // if (this.vector.x > width || this.vector.x < 0) {
    //   this.vector.y *= -1
    // }
    // if (this.vector.y > height || this.vector.y < 0) {
    //   this.vector.y *= -1
    // }
    // if (this.vector.x > width + this.radius) {
    //   this.vector.x = -this.radius
    // }
    // else if (this.vector.x < 0 - this.radius) {
    //   this.vector.x = width + this.radius
    // }
    // else if (this.vector.y < 0 - this.radius) {
    //   this.vector.y = height + this.radius
    // }
    // else if (this.vector.y > height + this.radius) {
    //   this.vector.y = -this.radius
    // }
  }
  updateHealth(zombies) {
    for (const zombie of zombies) {
      let d = distance(zombie.vector.x, zombie.vector.y, this.vector.x, this.vector.y)
      if (d < zombie.radius + 2) {
        zombie.health = 0
        this.health = this.health - zombie.damage

        return
      }
    }
  }
  update() {
    // this.boundary()
    this.move()
  }

  render(ctx) {
    ctx.save()

    let tX = this.vector.x
    let tY = this.vector.y
    ctx.translate(tX, tY)
    ctx.rotate(this.angle)
    ctx.translate(-tX, -tY)

    // Body
    ctx.beginPath()
    ctx.fillStyle = "#ffe0bd"
    ctx.arc(this.vector.x, this.vector.y, this.radius, 0, Math.PI * 2)
    ctx.fill()

    // Gun    
    ctx.beginPath()
    ctx.fillStyle = "#000"
    ctx.rect(this.vector.x + this.radius + 15, this.vector.y - 5, 25, 10)
    ctx.fill()

    // Hands
    ctx.beginPath()
    ctx.strokeStyle = "#ffe0bd"
    ctx.lineCap = "round"
    ctx.lineWidth = 4

    // Right Hand
    ctx.moveTo(this.vector.x + 5, this.vector.y + this.radius - 2)
    ctx.lineTo(this.vector.x + this.radius + 15, this.vector.y + 5)
    ctx.stroke()

    // Left Hand
    ctx.moveTo(this.vector.x + 5, this.vector.y - this.radius + 2)
    ctx.lineTo(this.vector.x + this.radius + 15, this.vector.y - 5)
    ctx.stroke()

    ctx.restore()
  }

  /**
   * ctx.beginPath()
    ctx.fillStyle = "#00cc44"
    // ctx.strokeStyle = "#000"
    // ctx.lineWidth = 3
    ctx.arc(this.vector.x, this.vector.y, this.radius, 0, Math.PI * 2)
    // ctx.stroke()
    ctx.fill()

    // ctx.rect(this.vector.x + this.radius + 15, this.vector.y - 5, 25, 10)
    // Hands
    ctx.beginPath()
    ctx.strokeStyle = "#00cc44"
    ctx.lineCap = "round"
    ctx.lineWidth = 4

    // Right Hand
    ctx.moveTo(this.vector.x + 5, this.vector.y + this.radius - 2) 
    ctx.lineTo(this.vector.x + this.radius + 20, this.vector.y)
    ctx.stroke()

    // Left Hand
    ctx.moveTo(this.vector.x + 5, this.vector.y - this.radius + 2)
    ctx.lineTo(this.vector.x + this.radius + 20, this.vector.y)
    ctx.stroke()
   * 
   */

  /**ctx.save();
ctx.translate(x+width_of_item/2,y+height_of_item/2);
ctx.rotate(degrees*(Math.PI/180));
ctx.translate(-(x+width_of_item/2),-(y+height_of_item/2));

ctx.stroke();
ctx.restore(); */
}

export default Player
