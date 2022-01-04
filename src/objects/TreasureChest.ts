import DepthKeys from '../consts/DepthKeys'
import { TreasureChestAnimsKeys } from '../consts/AnimsKeys'

export default class TreasureChest extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame)
    this.setOrigin(0, 1)
    this.setDepth(DepthKeys.Items)
    this.anims.play(TreasureChestAnimsKeys.Idle)
  }

  open() {
    if (this.anims.currentAnim.key === TreasureChestAnimsKeys.Open) {
      return 0
    }

    this.play(TreasureChestAnimsKeys.Open)
    return Phaser.Math.Between(1, 5)
  }
}
