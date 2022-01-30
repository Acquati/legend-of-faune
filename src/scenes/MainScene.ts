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
  private flyingKnifes!: Phaser.Physics.Arcade.Group
  private lizards01!: Phaser.Physics.Arcade.Group
  private playerLizards01Collider!: Phaser.Physics.Arcade.Collider

  constructor() {
    super({ key: SceneKeys.MainScene })
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    const map = this.make.tilemap({ key: TextureKeys.Forest01 })
    const tileset = map.addTilesetImage(
      'forest01',
      TextureKeys.Forest01Tiles,
      32,
      32
    )
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    const groundLayer = map.createLayer('ground', tileset)
    groundLayer.setDepth(DepthKeys.Ground)
    groundLayer.setCollisionByProperty({ collides: true })
    debugDraw(groundLayer, this)
    const wallsLayer = map.createLayer('walls', tileset)
    wallsLayer.setDepth(DepthKeys.Walls)
    wallsLayer.setCollisionByProperty({ collides: true })
    debugDraw(wallsLayer, this)
    const upperWallsLayer = map.createLayer('upper-walls', tileset)
    upperWallsLayer.setDepth(DepthKeys.UpperWalls)
    upperWallsLayer.setCollisionByProperty({ collides: true })
    debugDraw(upperWallsLayer, this)

    const chests = this.physics.add.staticGroup({
      classType: TreasureChest
    })
    const chestsLayer = map.getObjectLayer('treasure-chests')
    chestsLayer.objects.forEach((chest) => {
      chests.get(chest.x, chest.y, TextureKeys.TreasureChest)
    })

    this.flyingKnifes = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite
      // maxSize: 3
    })

    const playerSpawn = map.getObjectLayer('player-spawn')
    playerSpawn.objects.forEach((position) => {
      this.player = new Player(
        this,
        Number(position.x),
        Number(position.y),
        TextureKeys.Faune
      )
    })
    this.player.setFlyingKnifes(this.flyingKnifes)

    this.lizards01 = this.physics.add.group({
      classType: Lizard01
    })
    const lizards01Layer = map.getObjectLayer('lizards01')
    lizards01Layer.objects.forEach((lizard01) => {
      this.lizards01.get(lizard01.x, lizard01.y, TextureKeys.Lizard01)
    })

    this.physics.add.collider(this.player, [
      groundLayer,
      wallsLayer,
      upperWallsLayer
    ])
    this.physics.add.collider(this.lizards01, [
      groundLayer,
      wallsLayer,
      upperWallsLayer
    ])
    this.physics.add.collider(
      this.flyingKnifes,
      [groundLayer, wallsLayer, upperWallsLayer],
      this.handleFlyingKnifesWallsCollision,
      undefined,
      this
    )

    this.physics.add.collider(
      this.player,
      chests,
      this.handlePlayerChestCollision,
      undefined,
      this
    )

    this.playerLizards01Collider = this.physics.add.collider(
      this.player,
      this.lizards01,
      this.handlePlayerLizard01Collision,
      undefined,
      this
    )

    this.physics.add.collider(
      this.flyingKnifes,
      this.lizards01,
      this.handleFlyingKnifesLizards01Collision,
      undefined,
      this
    )

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.startFollow(this.player, true)

    this.scene.run(SceneKeys.JoyStickInterface, {
      cursors: this.cursors
    })
    this.scene.run(SceneKeys.UserInterface, {
      cursors: this.cursors,
      player: this.player
    })
  }

  update(time: number, delta: number) {
    if (!this.cursors || !this.player) return

    this.flyingKnifes.children.each(this.removeIfOutOfBounds, this)

    this.player.update(delta, this.cursors)
  }

  private handlePlayerChestCollision(
    object1: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    object2: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const chest = object2 as TreasureChest
    this.player.setChest(chest)
  }

  private handlePlayerLizard01Collision(
    object1: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    object2: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const lizard01 = object2 as Lizard01

    const dx = this.player.x - lizard01.x
    const dy = this.player.y - lizard01.y

    const direction = new Phaser.Math.Vector2(dx, dy).normalize().scale(75)

    this.player.handleDamage(direction)

    sceneEvents.emit(EventKeys.PlayerHealthChanged, this.player.health)

    if (this.player.health <= 0) {
      this.playerLizards01Collider.destroy()
    }
  }

  private handleFlyingKnifesLizards01Collision(
    object1: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    object2: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    this.flyingKnifes.remove(object1, true, true)

    const lizard01 = object2 as Lizard01

    lizard01.handleDamage()
  }

  private handleFlyingKnifesWallsCollision(
    object1: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    object2: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    this.flyingKnifes.remove(object1, true, true)
  }

  private removeIfOutOfBounds(body: Phaser.GameObjects.GameObject) {
    const sprite = body as Phaser.Physics.Arcade.Sprite

    if (
      !Phaser.Geom.Rectangle.Overlaps(
        this.physics.world.bounds,
        sprite.getBounds()
      )
    ) {
      this.flyingKnifes.remove(sprite, true, true)
    }
  }
}
