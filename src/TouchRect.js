import Phaser from 'phaser'

export default class TouchRect extends Phaser.GameObjects.Graphics {
  constructor(scene, x, y, width, height) {
    super(scene, x, y, width, height)

    scene.add.existing(this)
    this.fillStyle('#333333', 0.3)
    this.rect = new Phaser.Geom.Rectangle(x, y, width, height)
    this.text = new Phaser.GameObjects.Text(scene, x + width / 2, y + height / 2, '此处可点击')
  }

  draw() {
    this.fillRectShape(this.rect)
  }

  clear() {
    
  }
}