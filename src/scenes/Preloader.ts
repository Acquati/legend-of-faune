import SceneKeys from '../consts/SceneKeys'
import TextureKeys from '../consts/TextureKeys'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.Preloader })
  }

  preload() {
    this.load.aseprite(
      TextureKeys.Faune,
      'characters/faune.png',
      'characters/faune.json'
    )

    this.load.aseprite(TextureKeys.Chest, 'items/chest.png', 'items/chest.json')
  }

  create() {
    this.scene.start(SceneKeys.MainScene)
  }
}
