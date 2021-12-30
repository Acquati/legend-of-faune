import Preloader from './scenes/Preloader'
import MainScene from './scenes/MainScene'

// const windowWidth = Math.floor(window.innerWidth / 2)
const windowWidth = Math.floor(window.innerWidth)
// const windowHeight = Math.floor(window.innerHeight / 2)
const windowHeight = Math.floor(window.innerHeight)

const GameConfig: Phaser.Types.Core.GameConfig = {
  width: windowWidth,
  height: windowHeight,
  // zoom: 2,
  parent: 'game',
  scene: [Preloader, MainScene],
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
  roundPixels: true
  // powerPreference: 'high-performance'
}

export default GameConfig
