import DepthKeys from '../../consts/DepthKeys'
import TextureKeys from '../../consts/TextureKeys'
import { FlyingKnifeAnimsKeys } from '../../consts/AnimsKeys'
import Player from './'

const throwFlyingKnife = (
  flyingKnifes: Phaser.Physics.Arcade.Group,
  player: Player
) => {
  const movementVelocity = 250
  const parts = player.anims.currentAnim.key.split('-')
  const direction = parts[2]

  const vector = new Phaser.Math.Vector2(0, 0)

  let flyingKnife: Phaser.Physics.Arcade.Sprite

  switch (direction) {
    case 'up':
      flyingKnife = flyingKnifes.get(
        player.x,
        player.y - 20,
        TextureKeys.FlyingKnife
      )
      flyingKnife.setDepth(DepthKeys.Player - 1)
      flyingKnife.anims.play(
        {
          key: FlyingKnifeAnimsKeys.Up,
          repeat: -1
        },
        true
      )
      vector.y = -1
      break

    case 'down':
      flyingKnife = flyingKnifes.get(
        player.x,
        player.y + 20,
        TextureKeys.FlyingKnife
      )
      flyingKnife.setDepth(DepthKeys.PlayerWeapon)
      flyingKnife.anims.play(
        {
          key: FlyingKnifeAnimsKeys.Down,
          repeat: -1
        },
        true
      )
      vector.y = 1
      break

    default:
    case 'side':
      if (player.scaleX < 0) {
        flyingKnife = flyingKnifes.get(
          player.x - 20,
          player.y,
          TextureKeys.FlyingKnife
        )
        flyingKnife.scaleX = -1
        flyingKnife.body.offset.x = flyingKnife.body.width
        vector.x = -1
      } else {
        flyingKnife = flyingKnifes.get(
          player.x + 20,
          player.y,
          TextureKeys.FlyingKnife
        )
        flyingKnife.scaleX = 1
        flyingKnife.body.offset.x = 0
        vector.x = 1
      }

      flyingKnife.setDepth(DepthKeys.PlayerWeapon)
      flyingKnife.anims.play(
        {
          key: FlyingKnifeAnimsKeys.Side,
          repeat: -1
        },
        true
      )
      break
  }

  flyingKnife.setVelocity(
    vector.x * movementVelocity,
    vector.y * movementVelocity
  )
}

export default throwFlyingKnife
