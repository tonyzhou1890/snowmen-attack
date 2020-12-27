import Phaser from 'phaser'

export default class Snowman extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, track, size) {
    const frame = size === 'Small' ? 'snowman-small-idle0' : 'snowman-big-idle0'
    const x = size === 'Small' ? 80 : -100

    super(scene, x, track.y, 'sprites', frame)

    this.setOrigin(0.5, 1)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    if (size === 'Small') {
      this.body.setSize(100, 100)
      this.body.setOffset(20, 40)
    } else {
      this.body.setSize(100, 120)
      this.body.setOffset(50, 50)
    }

    this.gameWidth = scene.game.config.width

    this.time = scene.time
    this.sound = scene.sound

    this.isAlive = true
    this.isThrowing = false

    this.size = size
    this.speed = 50

    // 0 = walk, 1 = idle, 2 = throw
    this.previouseAction = 0

    this.currentTrack = track

    this.play('snowmanIdle' + this.size)
  }

  start() {
    this.isAlive = true
    this.isThrowing = false
    this.previouseAction = 0
    this.currentHitpoints = this.maxHitpoints

    this.y = this.currentTrack.y

    this.on('animationcomplete-snowmanThrowStart' + this.size, this.releaseSnowBall, this)
    this.on('animationcomplete-snowmanThrowEnd' + this.size, this.throwComplete, this)

    this.setActive(true)
    this.setVisible(true)

    this.play('snowmanWalk' + this.size)

    this.setVelocityX(this.speed)

    this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(3000, 6000), this.chooseAction, [], this)
  }

  chooseAction() {
    // 防止击中导致禁用
    this.isAlive = true
    this.body.enable = true

    this.setVelocityX(0)

    // 0 - 50 = 扔雪球
    // 51 - 60 = 空闲
    // 61 - 100 = 走
    const t = Phaser.Math.Between(0, 100)

    if (t < 50) {
      // 如果上一次扔过了，这一次忽略
      if (this.previouseAction === 2) {
        this.walk()
      } else {
        this.throw()
      }
    } else if (t > 60) {
      this.walk()
    } else {
      // 如果上一次空闲，这次忽略
      if (this.previouseAction === 1) {
        if (t > 55) {
          this.walk()
        } else {
          this.throw()
        }
      } else {
        this.goIdle()
      }
    }
  }

  walk() {
    this.previouseAction = 0
    this.play('snowmanWalk' + this.size, true)
    this.setVelocityX(this.speed)
    this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(3000, 6000), this.chooseAction, [], this)
  }

  goIdle() {
    this.previouseAction = 1
    this.play('snowmanIdle' + this.size, true)
    this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(2000, 4000), this.chooseAction, [], this)
  }

  throw() {
    this.previouseAction = 2
    this.isThrowing = true
    this.play('snowmanThrowStart' + this.size)
  }

  releaseSnowBall() {
    if (!this.isAlive) return
    this.play('snowmanThrowEnd' + this.size)
    this.currentTrack.throwEnemySnowball(this.x)
  }

  throwComplete() {
    if (!this.isAlive) return
    this.isThrowing = false
    this.play('snowmanIdle' + this.size)
    this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(2000, 4000), this.chooseAction, [], this)
  }

  hit() {
    if (this.chooseEvent) {
      this.chooseEvent.remove()
    }

    this.isAlive = false
    this.previouseAction = -1

    this.play('snowmanDie' + this.size)

    this.sound.play('hit-snowman')

    this.body.stop()

    this.body.enable = false

    const knockback = '-=' + Phaser.Math.Between(100, 200).toString()

    this.scene.tweens.add({
      targets: this,
      x: knockback,
      ease: 'sine.out',
      duration: 1000,
      onComplete: () => {
        if (this.x < -100) this.x = -100
      }
    })

    this.chooseEvent = this.time.delayedCall(Phaser.Math.Between(1000, 3000), this.chooseAction, [], this)
  }

  stop() {
    if (this.chooseEvent) {
      this.chooseEvent.remove()
    }

    this.isAlive = false
    this.play('snowmanIdle' + this.size)
    this.setVelocityX(0)
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)
    if (this.x >= this.gameWidth) {
      this.stop()
      this.scene.gameOver()
    }
  }
}