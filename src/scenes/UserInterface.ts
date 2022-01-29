import DepthKeys from '../consts/DepthKeys'
import EventKeys from '../consts/EventKeys'
import SceneKeys from '../consts/SceneKeys'
import TextureKeys from '../consts/TextureKeys'
import VirtualJoyStick from 'phaser3-rex-plugins/plugins/virtualjoystick'
import VirtualJoyStickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin'
import { sceneEvents } from '../events/EventCenter'

export default class UserInterface extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private joyStick!: VirtualJoyStick
  private hearts!: Phaser.GameObjects.Group

  constructor() {
    super({ key: SceneKeys.UserInterface })
  }

  init(data: { cursors: Phaser.Types.Input.Keyboard.CursorKeys }) {
    this.cursors = data.cursors
  }

  create() {
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
    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image
    })

    this.hearts.createMultiple({
      key: TextureKeys.UIHeartFull,
      setXY: {
        x: 20,
        y: 20,
        stepX: 32
      },
      quantity: 3
    })

    this.hearts.setDepth(DepthKeys.UserInterface)

    sceneEvents.on(
      EventKeys.PlayerHealthChanged,
      this.handlePlayerHealthChanged,
      this
    )

    const coinIcon = this.add.sprite(6, 34, TextureKeys.Coin)
    coinIcon.setOrigin(0, 0)
    // coinIcon.anims.play({
    //   key: CoinAnimsKeys.Rotating,
    //   repeat: -1
    // })

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
