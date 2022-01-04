import TextureKeys from '../../consts/TextureKeys'
import DepthKeys from '../../consts/DepthKeys'
import { FauneAnimsKeys } from '../../consts/AnimsKeys'
import { FlyingKnifeAnimsKeys } from '../../consts/AnimsKeys'
import EventKeys from '../../consts/EventKeys'
import playerMovement from './playerMovement'
import TreasureChest from '../TreasureChest'
import { sceneEvents } from '../../events/EventCenter'

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      player(
        x: number,
        y: number,
        texture: string,
        frame?: string | number
      ): Player
    }
  }
}

enum HealthState {
  IDLE,
  DAMAGE,
  DEAD
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private healthState = HealthState.IDLE
  private damageTimer = 0
  private flyingKnifesTimer = 0
  private flyingKnifesOnCooldown = false
  private speed = 100
  private flyingKnifes!: Phaser.Physics.Arcade.Group
  private activeChest?: TreasureChest

  private _health = 3
  get health() {
    return this._health
  }

  private _coins = 0

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame)

    this.anims.play(FauneAnimsKeys.WalkDown)
  }

  setFlyingKnifes(flyingKnifes: Phaser.Physics.Arcade.Group) {
    this.flyingKnifes = flyingKnifes
  }

  setChest(chest: TreasureChest) {
    this.activeChest = chest
  }

  private throwFlyingKnife() {
    if (!this.flyingKnifes) return

    const parts = this.anims.currentAnim.key.split('-')
    const direction = parts[2]

    const vector = new Phaser.Math.Vector2(0, 0)

    let flyingKnife: Phaser.Physics.Arcade.Sprite

    switch (direction) {
      case 'up':
        flyingKnife = this.flyingKnifes.get(
          this.x,
          this.y - 10,
          TextureKeys.FlyingKnife
        )
        flyingKnife.setDepth(DepthKeys.Player - 1)
        flyingKnife.anims.play(
          {
            key: FlyingKnifeAnimsKeys.Up,
            repeat: -1
          },
          true
        )
        vector.y = -1
        break

      case 'down':
        flyingKnife = this.flyingKnifes.get(
          this.x,
          this.y + 10,
          TextureKeys.FlyingKnife
        )
        flyingKnife.setDepth(DepthKeys.PlayerWeapon)
        flyingKnife.anims.play(
          {
            key: FlyingKnifeAnimsKeys.Down,
            repeat: -1
          },
          true
        )
        vector.y = 1
        break

      default:
      case 'side':
        if (this.scaleX < 0) {
          flyingKnife = this.flyingKnifes.get(
            this.x - 10,
            this.y,
            TextureKeys.FlyingKnife
          )
          flyingKnife.scaleX = -1
          flyingKnife.body.offset.x = flyingKnife.body.width
          vector.x = -1
        } else {
          flyingKnife = this.flyingKnifes.get(
            this.x + 10,
            this.y,
            TextureKeys.FlyingKnife
          )
          flyingKnife.scaleX = 1
          flyingKnife.body.offset.x = 0
          vector.x = 1
        }

        flyingKnife.setDepth(DepthKeys.PlayerWeapon)
        flyingKnife.anims.play(
          {
            key: FlyingKnifeAnimsKeys.Side,
            repeat: -1
          },
          true
        )
        break
    }

    flyingKnife.setVelocity(vector.x * 175, vector.y * 175)
  }

  handleDamage(direction: Phaser.Math.Vector2) {
    if (this._health <= 0) {
      return
    }

    if (this.healthState === HealthState.DAMAGE) return

    this._health -= 1

    if (this._health <= 0) {
      this.healthState = HealthState.DEAD
      this.setVelocity(0, 0)
      this.anims.play({ key: FauneAnimsKeys.DieSide })
    } else {
      this.setVelocity(direction.x, direction.y)
      this.damageTimer = 0
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
        if (this.damageTimer >= 250) {
          this.healthState = HealthState.IDLE
          this.damageTimer = 0
          this.clearTint()
        }
        break
    }
  }

  update(delta: number, cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (
      this.healthState === HealthState.DAMAGE ||
      this.healthState === HealthState.DEAD
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
          this.throwFlyingKnife()
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

    playerMovement(cursors, this, this.speed)
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  'player',
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    const sprite = new Player(this.scene, x, y, texture, frame)
    sprite.setDepth(DepthKeys.Player)

    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    )

    sprite.body.setSize(16, 16)

    return sprite
  }
)
