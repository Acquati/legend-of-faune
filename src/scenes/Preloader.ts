import SceneKeys from '../consts/SceneKeys'
import TextureKeys from '../consts/TextureKeys'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.Preloader })
  }

  preload() {
    this.load.bitmapFont(
      'pixel-white',
      'fonts/pixel-white.png',
      'fonts/pixel-white.xml'
    )

    this.load.image(TextureKeys.Forest01Tiles, 'maps/tiles/forest01.png')
    this.load.tilemapTiledJSON(TextureKeys.Forest01, 'maps/forest01.json')
    this.load.image(TextureKeys.Dungeon01Tiles, 'maps/tiles/dungeon01.png')
    this.load.tilemapTiledJSON(TextureKeys.Dungeon01, 'maps/dungeon01.json')

    this.load.aseprite(
      TextureKeys.Faune,
      'characters/faune.png',
      'characters/faune.json'
    )
    this.load.aseprite(
      TextureKeys.FlyingKnife,
      'weapons/flying-knife.png',
      'weapons/flying-knife.json'
    )
    this.load.aseprite(
      TextureKeys.Lizard01,
      'enemies/lizard01.png',
      'enemies/lizard01.json'
    )
    this.load.aseprite(
      TextureKeys.TreasureChest,
      'items/treasure-chest.png',
      'items/treasure-chest.json'
    )

    this.load.aseprite(TextureKeys.Coin, 'items/coin.png', 'items/coin.json')
    this.load.image(TextureKeys.UIHeartFull, 'user-interface/ui-heart-full.png')
    this.load.image(TextureKeys.UIHeartHalf, 'user-interface/ui-heart-half.png')
    this.load.image(
      TextureKeys.UIHeartEmpty,
      'user-interface/ui-heart-empty.png'
    )
    this.load.image(
      TextureKeys.FlyingKnifeButton,
      'user-interface/flying-knife-button.png'
    )
  }

  create() {
    this.anims.createFromAseprite(TextureKeys.Faune)
    this.anims.createFromAseprite(TextureKeys.FlyingKnife)
    this.anims.createFromAseprite(TextureKeys.Lizard01)
    this.anims.createFromAseprite(TextureKeys.Coin)
    this.anims.createFromAseprite(TextureKeys.TreasureChest)

    this.scene.start(SceneKeys.MainScene)
  }
}
