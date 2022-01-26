import { Lizard01AnimsKeys } from '../consts/AnimsKeys'
import DepthKeys from '../consts/DepthKeys'

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  IDLE
}

enum HealthState {
  IDLE,
  DAMAGE,
  DEAD
}

const randomDirection = (exclude: Direction) => {
  const x = Phaser.Math.Between(0, 3)

  for (let i = 0; i <= 4; i += 1) {
    if (exclude === i) {
      if (x < i) {
        return x
      } else {
        return x + 1
      }
    }
  }

  return 4
}

export default class Lizard01 extends Phaser.Physics.Arcade.Sprite {
  private healthState = HealthState.IDLE
  private direction = Direction.RIGHT
  private movementVelocity = 100
  private moveEvent: Phaser.Time.TimerEvent
  private damageTimer = 0
  private deathTimer = 0

  private _health = 2
  get health() {
    return this._health
  }

  // private idle = false
  // private timer = 0

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame)

    scene.physics.add.existing(this)
    this.setDepth(DepthKeys.Enemy)
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(32, 32)
    body.onCollide = true

    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE,
      this.handleTileCollision,
      this
    )

    this.moveEvent = scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.direction = randomDirection(this.direction)
      },
      loop: true
    })

    this.setCollideWorldBounds(true)
  }

  handleDamage() {
    if (this._health <= 0) {
      return
    }

    if (this.healthState === HealthState.DAMAGE) return

    this._health -= 1

    if (this._health <= 0) {
      this.healthState = HealthState.DEAD
      this.body.destroy()
      this.setDepth(DepthKeys.Enemy - 1)
      this.anims.play({ key: Lizard01AnimsKeys.DieSide })
    } else {
      this.damageTimer = 0
      this.healthState = HealthState.DAMAGE
      this.setTint(0xff9999)
    }
  }

  destroy(fromScene?: boolean) {
    this.moveEvent.destroy()

    super.destroy(fromScene)
  }

  private handleTileCollision(
    gameObject: Phaser.GameObjects.GameObject,
    tile: Phaser.Tilemaps.Tile
  ) {
    if (gameObject !== this) return

    this.direction = randomDirection(this.direction)
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)

    if (this.health <= 0) {
      // this.setVelocity(0, 0)
      this.deathTimer += delta

      if (this.deathTimer >= 1000) {
        this.destroy()
      }
    }

    switch (this.healthState) {
      case HealthState.IDLE:
        break

      case HealthState.DAMAGE:
        this.damageTimer += delta
        if (this.damageTimer >= 100) {
          this.healthState = HealthState.IDLE
          this.damageTimer = 0
          this.clearTint()
        }
        break
    }

    // if (this.idle) {
    //   this.timer += delta
    //   if (this.timer >= 3000) {
    //     this.idle = false
    //     this.timer = 0
    //   }
    // }

    if (
      this.healthState === HealthState.DAMAGE ||
      this.healthState === HealthState.DEAD
    ) {
      return
    }

    switch (this.direction) {
      case Direction.UP:
        this.setVelocity(0, -this.movementVelocity)
        this.anims.play(
          {
            key: Lizard01AnimsKeys.WalkSide
          },
          true
        )
        break

      case Direction.DOWN:
        this.setVelocity(0, this.movementVelocity)
        this.anims.play(
          {
            key: Lizard01AnimsKeys.WalkSide
          },
          true
        )
        break

      case Direction.LEFT:
        this.scaleX = -1
        this.body.offset.x = this.body.width * 2
        this.setVelocity(-this.movementVelocity, 0)
        this.anims.play(
          {
            key: Lizard01AnimsKeys.WalkSide
          },
          true
        )
        break

      case Direction.RIGHT:
        this.scaleX = 1
        this.body.offset.x = this.body.width
        this.setVelocity(this.movementVelocity, 0)
        this.anims.play(
          {
            key: Lizard01AnimsKeys.WalkSide
          },
          true
        )
        break

      case Direction.IDLE:
        this.setVelocity(0, 0)
        // this.idle = true
        this.anims.play(
          {
            key: Lizard01AnimsKeys.IdleSide
          },
          true
        )
        break
    }
  }
}
