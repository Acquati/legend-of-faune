import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin'
import Preloader from './scenes/Preloader'
import MainScene from './scenes/MainScene'
import UserInterface from './scenes/UserInterface'
import GameOver from './scenes/GameOver'

const windowWidth = Math.floor(window.innerWidth)
const windowHeight = Math.floor(window.innerHeight)

const GameConfig: Phaser.Types.Core.GameConfig = {
  width: windowWidth,
  height: windowHeight,
  parent: 'game',
  scene: [Preloader, MainScene, UserInterface, GameOver],
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
  // scale: {
  //   zoom: Phaser.Scale.Zoom.ZOOM_2X
  // },
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
