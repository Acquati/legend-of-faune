import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin'
import Preloader from './scenes/Preloader'
import MainScene from './scenes/MainScene'
import JoyStickInterface from './scenes/JoyStickInterface'
import UserInterface from './scenes/UserInterface'
import GameOver from './scenes/GameOver'

const GameConfig: Phaser.Types.Core.GameConfig = {
  width: Math.floor(window.innerWidth),
  height: Math.floor(window.innerHeight),
  parent: 'game',
  scene: [Preloader, MainScene, JoyStickInterface, UserInterface, GameOver],
  title: 'Legend of Faune',
  url: '',
  version: '0.1',
  disableContextMenu: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 0 }
    }
  },
  backgroundColor: '#000000',
  antialiasGL: false,
  pixelArt: true,
  roundPixels: true,
  // powerPreference: 'high-performance',
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
