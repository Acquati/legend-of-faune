import DepthKeys from '../consts/DepthKeys'
import SceneKeys from '../consts/SceneKeys'

export default class GameOver extends Phaser.Scene {
  constructor() {
    super(SceneKeys.GameOver)
  }

  create() {
    const { width, height } = this.scale
    // x, y will be middle of screen
    const x = width * 0.5
    const y = height * 0.5

    this.input.addPointer(1)
    this.add
      .bitmapText(
        x,
        y,
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
