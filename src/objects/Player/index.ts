import DepthKeys from '../../consts/DepthKeys'
import EventKeys from '../../consts/EventKeys'
import SceneKeys from '../../consts/SceneKeys'
import { FauneAnimsKeys } from '../../consts/AnimsKeys'
import TreasureChest from '../TreasureChest'
import { sceneEvents } from '../../events/EventCenter'
import throwFlyingKnife from './throwFlyingKnife'
import playerMovement from './playerMovement'

enum HealthState {
  IDLE,
  DAMAGED,
  DEAD
}

enum MovementState {
  IDLE,
  PUSHED
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private healthState = HealthState.IDLE
  private movementState = MovementState.IDLE
  private damagedTimer = 0
  private pushedTimer = 0
  private movementVelocity = 140
  private flyingKnifesTimer = 0
  private flyingKnifesOnCooldown = false
  private flyingKnifes!: Phaser.Physics.Arcade.Group
  private activeChest?: TreasureChest

  private _maxHealth = 14
  get maxHealth() {
    return this._maxHealth
  }

  private _health = 12
  get health() {
    return this._health
  }

  private _coins = 0
  get coins() {
    return this._coins
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame)

    this.anims.play(FauneAnimsKeys.WalkDown)

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setDepth(DepthKeys.Player)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(32, 32)
    this.setCollideWorldBounds(true)
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)

    switch (this.movementState) {
      case MovementState.IDLE:
        break

      case MovementState.PUSHED:
        this.pushedTimer += delta
        if (this.pushedTimer >= 500) {
          this.movementState = MovementState.IDLE
          this.pushedTimer = 0
        }
        break
    }

    switch (this.healthState) {
      case HealthState.IDLE:
        break

      case HealthState.DAMAGED:
        this.damagedTimer += delta
        if (this.damagedTimer >= 1000) {
          this.healthState = HealthState.IDLE
          this.damagedTimer = 0
          this.clearTint()
        }
        break
    }
  }

  update(delta: number, cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (
      this.healthState === HealthState.DEAD ||
      this.movementState === MovementState.PUSHED
    ) {
      return
    }

    if (cursors.space.isDown) {
      if (this.activeChest) {
        const coins = this.activeChest.open()
        this._coins += coins

        this.activeChest = undefined
        sceneEvents.emit(EventKeys.PlayerCoinsChanged, this._coins)
      } else {
        if (this.flyingKnifesTimer === 0) {
          throwFlyingKnife(this.flyingKnifes, this)
          this.flyingKnifesOnCooldown = true
        }
      }
    }

    if (this.flyingKnifesOnCooldown) {
      this.flyingKnifesTimer += delta

      if (this.flyingKnifesTimer >= 750) {
        this.flyingKnifesTimer = 0
        this.flyingKnifesOnCooldown = false
      }
    }

    playerMovement(cursors, this, this.movementVelocity)
  }

  setFlyingKnifes(flyingKnifes: Phaser.Physics.Arcade.Group) {
    this.flyingKnifes = flyingKnifes
  }

  setChest(chest: TreasureChest) {
    this.activeChest = chest
  }

  handleDamage(direction: Phaser.Math.Vector2) {
    if (this._health <= 0) {
      return
    }

    this._health -= 1

    if (!(this._health <= 0)) {
      this.setVelocity(direction.x * 2, direction.y * 2)
      this.movementState = MovementState.PUSHED
      this.healthState = HealthState.DAMAGED
      this.setTint(0xff9999)
    } else {
      this.healthState = HealthState.DEAD
      this.setDepth(DepthKeys.Enemy - 1)
      this.setVelocity(0, 0)
      this.anims.play({ key: FauneAnimsKeys.DieSide })
      this.scene.time.delayedCall(
        1000,
        () => this.scene.scene.run(SceneKeys.GameOver),
        [],
        this
      )
    }
  }
}
