import VirtualJoyStick from 'phaser3-rex-plugins/plugins/virtualjoystick'
import VirtualJoyStickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin'
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
  private joyStick!: VirtualJoyStick
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
    this.scene.run(SceneKeys.UserInterface, { cursors: this.cursors })

    const joyStickConfig = {
      radius: 80,
      x: 40,
      y: 40
    }
    const joyStickPlugin = this.plugins.get(
      'rexVirtualJoystick'
    ) as VirtualJoyStickPlugin

    this.joyStick = joyStickPlugin.add(this, {
      x: joyStickConfig.radius + joyStickConfig.x,
      y: this.scale.height - (joyStickConfig.radius + joyStickConfig.y),
      radius: joyStickConfig.radius,
      base: this.add
        .circle(0, 0, joyStickConfig.radius, 0x888888, 0.2)
        .setDepth(DepthKeys.UserInterface),
      thumb: this.add
        .circle(0, 0, Math.floor(joyStickConfig.radius / 2), 0xcccccc, 0.2)
        .setDepth(DepthKeys.UserInterface),
      dir: '8dir', // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
      // fixed: true,
      forceMin: 10
      // enable: true
    })
    const joyStickEvent = this.joyStick as unknown as Phaser.Events.EventEmitter
    joyStickEvent.on('update', this.joyStickUpdate, this)
    this.joyStickUpdate()

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
  }

  private joyStickUpdate() {
    const cursorKeys = this.joyStick.createCursorKeys()

    if (cursorKeys.up.isDown && cursorKeys.right.isDown) {
      this.cursors.up.isDown = true
      this.cursors.right.isDown = true
      this.cursors.down.isDown = false
      this.cursors.left.isDown = false
    } else if (cursorKeys.right.isDown && cursorKeys.down.isDown) {
      this.cursors.up.isDown = false
      this.cursors.right.isDown = true
      this.cursors.down.isDown = true
      this.cursors.left.isDown = false
    } else if (cursorKeys.down.isDown && cursorKeys.left.isDown) {
      this.cursors.up.isDown = false
      this.cursors.right.isDown = false
      this.cursors.down.isDown = true
      this.cursors.left.isDown = true
    } else if (cursorKeys.left.isDown && cursorKeys.up.isDown) {
      this.cursors.up.isDown = true
      this.cursors.right.isDown = false
      this.cursors.down.isDown = false
      this.cursors.left.isDown = true
    } else if (cursorKeys.up.isDown) {
      this.cursors.up.isDown = true
      this.cursors.right.isDown = false
      this.cursors.down.isDown = false
      this.cursors.left.isDown = false
    } else if (cursorKeys.right.isDown) {
      this.cursors.up.isDown = false
      this.cursors.right.isDown = true
      this.cursors.down.isDown = false
      this.cursors.left.isDown = false
    } else if (cursorKeys.down.isDown) {
      this.cursors.up.isDown = false
      this.cursors.right.isDown = false
      this.cursors.down.isDown = true
      this.cursors.left.isDown = false
    } else if (cursorKeys.left.isDown) {
      this.cursors.up.isDown = false
      this.cursors.right.isDown = false
      this.cursors.down.isDown = false
      this.cursors.left.isDown = true
    } else {
      this.cursors.up.isDown = false
      this.cursors.right.isDown = false
      this.cursors.down.isDown = false
      this.cursors.left.isDown = false
    }
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

  update(time: number, delta: number) {
    if (!this.cursors || !this.player) return

    this.flyingKnifes.children.each(this.removeIfOutOfBounds, this)

    this.player.update(delta, this.cursors)
  }
}
