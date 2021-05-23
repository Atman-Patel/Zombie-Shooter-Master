
class HealthBar {
    constructor(x, y, w, h, target, maxHealth, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.target = target;
        this.maxHealth = maxHealth;
        this.maxWidth = w;
        this.health = maxHealth;
        this.color = color;
    }

    show(context) {
        context.lineWidth = 4;
        context.strokeStyle = "#333";
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.w, this.h);
        context.strokeRect(this.x, this.y, this.maxWidth, this.h);
    }

    updateHealthBar(val) {
        if (val >= 0) {
            this.health = val;
            this.w = (this.health / this.maxHealth) * this.maxWidth;
        } if (this.target.name == 'player') {
            if (this.health <= 100 && this.health >= 80) {
                this.color = '#00C22C'
            }else if (this.health <= 80 && this.health > 60) {
                this.color = '#DCE439'
            } else if (this.health <= 60 && this.health > 40) {
                this.color = '#FFDC00'
            } else if (this.health <= 40 && this.health > 20) {
                this.color = '#E55A22'
            } else if (this.health <= 20 && this.health > 0) {
                this.color = '#CE2600'
            }
        }
    }
}

export default HealthBar
