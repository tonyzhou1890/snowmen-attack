import Phaser from 'phaser'
import Track from './Track'
import Player from './Player'

export default class MainGame extends Phaser.Scene {
  constructor() {
    super('MainGame')

    this.player
    this.tracks
    
    this.score = 0
    this.highscore = 0
    this.infoPanel

    this.scoreTimer
    this.scoreText
    this.highscoreText

    this.gameWidth
    this.gameHeight

    this.stop
  }

  create() {
    this.score = 0
    this.highscore = this.registry.get('highscore')

    this.gameWidth = this.game.config.width
    this.gameHeight = this.game.config.height

    this.add.image(this.gameWidth / 2, this.gameHeight / 2, 'background').setDisplaySize(this.gameWidth, this.gameHeight)

    const lineHeight = this.gameHeight * 0.2
    const lineOffsetY = this.gameHeight * 0.1

    this.tracks = [
      new Track(this, 0, lineOffsetY + lineHeight),
      new Track(this, 1, lineOffsetY + lineHeight * 2),
      new Track(this, 2, lineOffsetY + lineHeight * 3),
      new Track(this, 3, lineOffsetY + lineHeight * 4)
    ]

    this.player = new Player(this, this.tracks[0])

    this.add.image(0, 0, 'overlay').setOrigin(0).setDisplaySize(this.gameWidth, this.gameHeight)

    this.add.image(16, 0, 'sprites', 'panel-score').setOrigin(0)
    this.add.image(this.gameWidth - 16, 0, 'sprites', 'panel-best').setOrigin(1, 0)

    this.infoPanel = this.add.image(this.gameWidth / 2, this.gameHeight / 2, 'sprites', 'controls')
    this.scoreText = this.add.text(140, 2, this.score, {
      fontFamily: 'Arial',
      fontSize: 32,
      color: '#ffffff'
    })
    this.highscoreText = this.add.text(this.gameWidth - 200, 2, this.highscore, {
      fontFamily: 'Arial',
      fontSize: 32,
      color: '#ffffff'
    })

    this.input.keyboard.once('keydown-SPACE', this.start, this)
    this.input.on('pointerdown', this.start, this)
    this.input.keyboard.once('keydown-UP', this.start, this)
    this.input.keyboard.once('keydown-DOWN', this.start, this)
  }

  start() {
    this.stop = false
    this.input.keyboard.removeAllListeners()

    this.tweens.add({
      targets: this.infoPanel,
      y: this.gameHeight + 100,
      alpha: 0,
      duration: 500,
      ease: 'Power2'
    })

    this.player.start()

    this.tracks[0].start(4000, 8000)
    this.tracks[1].start(500, 1000)
    this.tracks[2].start(5000, 9000)
    this.tracks[3].start(6000, 10000)

    this.scoreTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.score++,
        this.scoreText.setText(this.score)
      },
      callbackScope: this,
      repeat: -1
    })
  }

  gameOver() {
    if (this.stop) return
    this.stop = true
    console.log('gameover')
    this.infoPanel.setTexture('gameover')

    this.tweens.add({
      targets: this.infoPanel,
      y: this.gameHeight / 2,
      alpha: 1,
      duration: 500,
      ease: 'Power2'
    })

    this.tracks.forEach(track => {
      track.stop()
    })

    this.sound.stopAll()
    this.sound.play('gameover')

    this.player.stop()

    this.scoreTimer.destroy()

    if (this.score > this.highscore) {
      this.highscoreText.setText('NEW!')

      this.registry.set('highscore', this.score)
    }
    console.log(this.score, this.highscore, this.registry.get('highscore'))

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('MainMenu')
    }, this)

    this.input.once('pointerdown', () => {
      this.scene.start('MainMenu')
    }, this)
  }
}