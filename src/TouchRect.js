import Phaser from 'phaser'

export default class TouchRect extends Phaser.GameObjects.Graphics {
  constructor(scene, x, y, width, height, trackId) {
    super(scene, x, y, width, height, trackId)

    this.trackId = trackId
    scene.add.existing(this)
    this.rect = new Phaser.Geom.Rectangle(x, y, width, height)
    this.text = new Phaser.GameObjects.Text(scene, x + width / 2, y + height / 2, '此处可点击').setOrigin(0.5, 0.5)
    scene.add.existing(this.text)
    scene.input.on('pointerdown', this.touch, this)
  }

  draw() {
    this.fillStyle('#333333', 0.3)
    this.fillRectShape(this.rect)
  }

  clearRect() {
    this.setVisible(false)
    this.text.setVisible(false)
  }

  touch(p) {
    if (this.visible === false && this.rect.contains(p.x, p.y)) {
      this.scene.player.handleTouch(this.trackId)
    }
  }
}