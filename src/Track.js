import Phaser from 'phaser'
import Snowman from './Snowman'
import PlayerSnowball from './PlayerSnowball'
import EnemySnowball from './EnemySnowball'
import TouchRect from './TouchRect'

export default class Track {
  constructor(scene, id, trackY) {
    this.scene = scene
    this.id = id
    this.y = trackY
    this.gameWidth = scene.game.config.width
    this.gameHeight = scene.game.config.height

    this.nest = scene.physics.add.image(this.gameWidth, trackY - 10, 'sprites', 'nest').setOrigin(1, 1)

    this.snowmanBig = new Snowman(scene, this, 'Big')
    this.snowmanSmall = new Snowman(scene, this, 'Small')

    this.playerSnowballs = scene.physics.add.group({
      frameQuantity: 8,
      key: 'sprites',
      frame: 'snowball2',
      active: false,
      visible: false,
      classType: PlayerSnowball
    })

    this.enemySnowballs = scene.physics.add.group({
      frameQuantity: 8,
      key: 'sprites',
      frame: 'snowball3',
      active: false,
      visible: false,
      classType: EnemySnowball
    })

    this.touchRect = new TouchRect(scene, this.gameWidth - 200, this.y - this.gameHeight * 0.15, 200, this.gameHeight * 0.15, id)
    this.touchRect.draw()

    this.snowBallCollider = scene.physics.add.overlap(this.playerSnowballs, this.enemySnowballs, this.hitSnowball, null, this)
    this.snowmanSmallCollider = scene.physics.add.overlap(this.snowmanSmall, this.playerSnowballs, this.hitSnowman, null, this)
    this.snowBigCollider = scene.physics.add.overlap(this.snowmanBig, this.playerSnowballs, this.hitSnowman, null, this)

    this.releaseTimerSmall
    this.releaseTimerBig
  }

  start(minDelay, maxDelay) {
    const delay = Phaser.Math.Between(minDelay, maxDelay)

    this.releaseTimerSmall = this.scene.time.addEvent({
      delay,
      callback: () => {
        this.snowmanSmall.start()
      }
    })

    this.releaseTimerBig = this.scene.time.addEvent({
      delay: delay * 3,
      callback: () => {
        this.snowmanBig.start()
      }
    })

    this.touchRect.clearRect()
  }

  stop() {
    this.snowmanSmall.stop()
    this.snowmanBig.stop()

    for (let snowball of this.playerSnowballs.getChildren()) {
      snowball.stop()
    }

    for (let snowball of this.enemySnowballs.getChildren()) {
      snowball.stop()
    }

    this.releaseTimerSmall.remove()
    this.releaseTimerBig.remove()
  }

  hitSnowball(ball1, ball2) {
    ball1.stop()
    ball2.stop()
  }

  hitSnowman(snowman, ball) {
    if (snowman.isAlive && snowman.x > 0) {
      ball.stop()
      snowman.hit()
    }
  }

  throwPlayerSnowball(x) {
    let snowball = this.playerSnowballs.getFirstDead(false)

    if (snowball) {
      snowball.fire(x, this.y)
    }
  }

  throwEnemySnowball(x) {
    let snowball = this.enemySnowballs.getFirstDead(false)

    if (snowball) {
      snowball.fire(x, this.y)
    }
  }
}