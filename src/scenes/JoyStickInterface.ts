import DepthKeys from '../consts/DepthKeys'
import SceneKeys from '../consts/SceneKeys'
import VirtualJoyStick from 'phaser3-rex-plugins/plugins/virtualjoystick'
import VirtualJoyStickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin'

export default class JoyStickInterface extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private joyStick!: VirtualJoyStick

  constructor() {
    super({ key: SceneKeys.JoyStickInterface })
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
}
