import DepthKeys from '../consts/DepthKeys'
import EventKeys from '../consts/EventKeys'
import SceneKeys from '../consts/SceneKeys'
import TextureKeys from '../consts/TextureKeys'
import Lizard01 from '../objects/Lizard01'
import Player from '../objects/Player'
import TreasureChest from '../objects/TreasureChest'
import { sceneEvents } from '../events/EventCenter'
import { debugDraw } from '../utils/debug'

export default class MainScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private player!: Player
  private lizards01!: Phaser.Physics.Arcade.Group
  private playerLizards01Collider!: Phaser.Physics.Arcade.Collider
  private flyingKnifes!: Phaser.Physics.Arcade.Group

  constructor() {
    super({ key: SceneKeys.MainScene })
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    this.scene.run(SceneKeys.UserInterface)

    const map = this.make.tilemap({ key: TextureKeys.Dungeon01 })
    const tileset = map.addTilesetImage(
      TextureKeys.Dungeon01,
      TextureKeys.Dungeon01Tiles,
      16,
      16
    )
    const floorLayer = map.createLayer('floor', tileset)
    floorLayer.setDepth(DepthKeys.Floor)
    const wallsLayer = map.createLayer('walls', tileset)
    wallsLayer.setDepth(DepthKeys.Walls)
    wallsLayer.setCollisionByProperty({ collides: true })
    debugDraw(wallsLayer, this)
    const upperWallsLayer = map.createLayer('upper-walls', tileset)
    upperWallsLayer.setDepth(DepthKeys.UpperWalls)
    upperWallsLayer.setCollisionByProperty({ collides: true })
    debugDraw(upperWallsLayer, this)

    // this.phaserLogo = new PhaserLogo({
    //   scene: this,
    //   x: Math.floor(Number(GameConfig.width) / 2),
    //   y: Math.floor(Number(GameConfig.height) / 2),
    //   texture: TextureKeys.PhaserLogo
    // })
  }
}
