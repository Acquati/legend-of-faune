import DepthKeys from '../consts/DepthKeys'
import SceneKeys from '../consts/SceneKeys'

export default class GameOver extends Phaser.Scene {
  constructor() {
    super(SceneKeys.GameOver)
  }

  create() {
    this.input.addPointer(1)
    this.add
      .bitmapText(
        Math.floor(this.scale.width / 2),
        Math.floor(this.scale.height / 2),
        'pixel-white',
        'Press SPACE or touch the screen\nto play again.',
        12,
        1
      )
      .setOrigin(0.5)
      .setDepth(DepthKeys.UserInterface)
      .setInteractive()

    this.input.on(
      'gameobjectdown',
      (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
        this.restartGame()
      }
    )

    this.input.keyboard.once('keydown-SPACE', () => {
      this.restartGame()
    })
  }

  private restartGame() {
    this.scene.stop(SceneKeys.GameOver)

    this.scene.stop(SceneKeys.MainScene)
    this.scene.start(SceneKeys.MainScene)
  }
}
