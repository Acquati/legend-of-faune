import DepthKeys from '../consts/DepthKeys'
import EventKeys from '../consts/EventKeys'
import SceneKeys from '../consts/SceneKeys'
import TextureKeys from '../consts/TextureKeys'
import Player from '../objects/Player'
import { sceneEvents } from '../events/EventCenter'

export default class UserInterface extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private player!: Player
  private hearts!: Phaser.GameObjects.Group

  constructor() {
    super({ key: SceneKeys.UserInterface })
  }

  init(data: {
    cursors: Phaser.Types.Input.Keyboard.CursorKeys
    player: Player
  }) {
    this.cursors = data.cursors
    this.player = data.player
  }

  create() {
    this.input.addPointer(1)
    this.add
      .image(
        this.scale.width - 52 - 40,
        this.scale.height - 52 - 40,
        TextureKeys.FlyingKnifeButton
      )
      .setScale(2)
      .setDepth(DepthKeys.UserInterface)
      .setInteractive()
    this.input.on(
      'gameobjectdown',
      (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
        this.cursors.space.isDown = true
        gameObject.setTint(0x999999)
      }
    )
    this.input.on(
      'gameobjectup',
      (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
        this.cursors.space.isDown = false
        gameObject.clearTint()
      }
    )

    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image
    })
    const maxHearts =
      this.player.maxHealth % 2 === 0
        ? this.player.maxHealth / 2
        : (this.player.maxHealth + 1) / 2
    this.hearts.createMultiple({
      key: TextureKeys.UIHeartFull,
      setXY: {
        x: 20,
        y: 20,
        stepX: 32
      },
      quantity: maxHearts
    })
    this.handlePlayerHealthChanged(this.player.health)
    this.hearts.setDepth(DepthKeys.UserInterface)
    sceneEvents.on(
      EventKeys.PlayerHealthChanged,
      this.handlePlayerHealthChanged,
      this
    )

    const coinIcon = this.add.sprite(6, 34, TextureKeys.Coin)
    coinIcon.setOrigin(0, 0)
    const coinsLabel = this.add.bitmapText(26, 36, 'pixel-white', '0', 16)
    sceneEvents.on(EventKeys.PlayerCoinsChanged, (coins: number) => {
      coinsLabel.setText(coins.toString())
    })

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(
        EventKeys.PlayerHealthChanged,
        this.handlePlayerHealthChanged,
        this
      ),
        sceneEvents.off(EventKeys.PlayerCoinsChanged)
    })
  }

  private handlePlayerHealthChanged(health: number) {
    this.hearts.children.each((gameObject, index) => {
      const hearth = gameObject as Phaser.GameObjects.Image

      if (index * 2 + 1 <= health) {
        if (health - (index * 2 + 2) >= 0) {
          hearth.setTexture(TextureKeys.UIHeartFull)
        } else {
          hearth.setTexture(TextureKeys.UIHeartHalf)
        }
      } else {
        hearth.setTexture(TextureKeys.UIHeartEmpty)
      }
    })
  }
}
