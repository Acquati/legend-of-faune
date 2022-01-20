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
  DAMAGE,
  DEAD
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private healthState = HealthState.IDLE
  private damageTimer = 0
  private movementVelocity = 140
  private flyingKnifesTimer = 0
  private flyingKnifesOnCooldown = false
  private flyingKnifes!: Phaser.Physics.Arcade.Group
  private activeChest?: TreasureChest

  private _health = 3
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

    if (this.healthState === HealthState.DAMAGE) return

    this._health -= 1

    if (this._health <= 0) {
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
    } else {
      this.setVelocity(direction.x * 1.5, direction.y * 1.5)
      this.healthState = HealthState.DAMAGE
      this.setTint(0xff9999)
    }
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)

    switch (this.healthState) {
      case HealthState.IDLE:
        break

      case HealthState.DAMAGE:
        this.damageTimer += delta
        if (this.damageTimer >= 500) {
          this.healthState = HealthState.IDLE
          this.damageTimer = 0
          this.clearTint()
        }
        break
    }
  }

  update(delta: number, cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (this.healthState === HealthState.DEAD) {
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
}
