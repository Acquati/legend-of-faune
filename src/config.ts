import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js'
import Preloader from './scenes/Preloader'
import MainScene from './scenes/MainScene'
import UserInterface from './scenes/UserInterface'

const windowWidth = Math.floor(window.innerWidth / 2)
const windowHeight = Math.floor(window.innerHeight / 2)

const GameConfig: Phaser.Types.Core.GameConfig = {
  width: windowWidth,
  height: windowHeight,
  zoom: 2,
  parent: 'game',
  scene: [Preloader, MainScene, UserInterface],
  title: 'Legend of Faune',
  url: '',
  version: '0.1',
  disableContextMenu: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  backgroundColor: '#000000',
  antialiasGL: false,
  pixelArt: true,
  roundPixels: true,
  // powerPreference: 'high-performance'
  plugins: {
    global: [
      {
        key: 'rexVirtualJoystick',
        plugin: VirtualJoystickPlugin,
        start: true
      }
    ]
  }
}

export default GameConfig
