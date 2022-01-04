import DepthKeys from '../consts/DepthKeys'
import EventKeys from '../consts/EventKeys'
import SceneKeys from '../consts/SceneKeys'
import TextureKeys from '../consts/TextureKeys'
import { sceneEvents } from '../events/EventCenter'

export default class UserInterface extends Phaser.Scene {
  private hearts!: Phaser.GameObjects.Group

  constructor() {
    super({ key: SceneKeys.UserInterface })
  }

  create() {
    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image
    })

    this.hearts.createMultiple({
      key: TextureKeys.UIHeartFull,
      setXY: {
        x: 10,
        y: 10,
        stepX: 16
      },
      quantity: 3
    })

    this.hearts.setDepth(DepthKeys.UserInterface)

    sceneEvents.on(
      EventKeys.PlayerHealthChanged,
      this.handlePlayerHealthChanged,
      this
    )

    const coinIcon = this.physics.add.sprite(3, 17, TextureKeys.Coin)
    coinIcon.setOrigin(0, 0)
    // coinIcon.anims.play({
    //   key: CoinAnimsKeys.Rotating,
    //   repeat: -1
    // })

    const coinsLabel = this.add.bitmapText(13, 18, 'pixel-white', '0', 8)

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

      if (index < health) {
        hearth.setTexture(TextureKeys.UIHeartFull)
      } else {
        hearth.setTexture(TextureKeys.UIHeartEmpty)
      }
    })
  }
}
