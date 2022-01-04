import DepthKeys from '../consts/DepthKeys'
import GameConfig from '../config'

export const debugDraw = (
  layer: Phaser.Tilemaps.TilemapLayer,
  scene: Phaser.Scene
) => {
  if (GameConfig.physics?.arcade?.debug) {
    const debugGraphics = scene.add.graphics().setAlpha(0.7)
    debugGraphics.setDepth(DepthKeys.DebugGraphics)

    layer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    })
  }
}
