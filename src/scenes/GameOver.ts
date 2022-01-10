import DepthKeys from '../consts/DepthKeys'
import SceneKeys from '../consts/SceneKeys'

export default class GameOver extends Phaser.Scene {
  constructor() {
    super(SceneKeys.GameOver)
  }

  create() {
    // object destructuring
    const { width, height } = this.scale
    // x, y will be middle of screen
    const x = width * 0.5
    const y = height * 0.5
    // add the text with some styling

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

    // listen for the Space bar getting pressed once
    this.input.keyboard.once('keydown-SPACE', () => {
      this.restartGame()
    })
  }

  private restartGame() {
    // stop the GameOver scene
    this.scene.stop(SceneKeys.GameOver)

    // stop and restart the Game scene
    this.scene.stop(SceneKeys.MainScene)
    this.scene.start(SceneKeys.MainScene)
  }
}
