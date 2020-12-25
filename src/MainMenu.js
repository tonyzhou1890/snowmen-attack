import Phaser from 'phaser'

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu')
    this.width,
    this.height
  }

  create() {
    this.width = this.game.config.width
    this.height = this.game.config.height

    this.sound.play('music', { loop: true, delay: 2 })

    let ball1 = this.add.image(-64, this.height / 2, 'sprites', 'snowball1')
    let ball2 = this.add.image(this.width + 288, this.height * 0.6, 'sprites', 'snowball1')
    let ball3 = this.add.image(-64, this.height * 0.5333, 'sprites', 'snowball1')
    let logo = this.add.image(this.width + 900, this.height * 0.64, 'title')

    this.tweens.add({
      targets: ball1,
      x: this.width + 288,
      y: this.height * 0.6,
      ease: 'cubic.out',
      duration: 600,
      onStart: () => {
        this.sound.play('throw')
      }
    })

    this.tweens.add({
      targets: ball2,
      x: -64,
      y: this.height * 0.467,
      ease: 'cubic.out',
      delay: 700,
      duration: 600,
      onStart: () => {
        this.sound.play('throw')
      }
    })

    this.tweens.add({
      targets: ball3,
      x: this.width + 288,
      y: this.height * 0.63,
      ease: 'cubic.out',
      delay: 1200,
      duration: 600,
      onStart: () => {
        this.sound.play('throw')
      }
    })

    this.tweens.add({
      targets: logo,
      x: this.width / 2,
      y: this.height / 2,
      ease: 'back.out',
      delay: 1800,
      duration: 600,
      onStart: () => {
        this.sound.play('throw')
      }
    })

    this.input.keyboard.once('keyboard-SPACE', () => {
      this.scene.start('MainGame')
    }, this)

    this.input.once('pointerdown', () => {
      this.scene.start('MainGame')
    })
  }
}