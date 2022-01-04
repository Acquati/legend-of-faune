import { FauneAnimsKeys } from '../../consts/AnimsKeys'

const moveRight = (player: Phaser.Physics.Arcade.Sprite, speed: number) => {
  player.scaleX = 1
  player.body.offset.x = player.body.width

  player.setVelocity(speed, 0)
  player.anims.play({ key: FauneAnimsKeys.WalkSide }, true)
}

const moveLeft = (player: Phaser.Physics.Arcade.Sprite, speed: number) => {
  player.scaleX = -1
  player.body.offset.x = player.body.width * 2

  player.setVelocity(-speed, 0)
  player.anims.play({ key: FauneAnimsKeys.WalkSide }, true)
}

const moveUp = (player: Phaser.Physics.Arcade.Sprite, speed: number) => {
  player.setVelocity(0, -speed)
  player.anims.play({ key: FauneAnimsKeys.WalkUp }, true)
}

const moveDown = (player: Phaser.Physics.Arcade.Sprite, speed: number) => {
  player.setVelocity(0, speed)
  player.anims.play({ key: FauneAnimsKeys.WalkDown }, true)
}

const playerMovement = (
  cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  player: Phaser.Physics.Arcade.Sprite,
  speed: number
) => {
  if (
    cursors.right?.isDown &&
    cursors.left?.isDown &&
    cursors.up?.isUp &&
    cursors.down?.isUp
  ) {
    if (cursors.right?.timeDown < cursors.left?.timeDown) {
      moveLeft(player, speed)
    } else {
      moveRight(player, speed)
    }
    return
  }

  if (
    cursors.right?.isDown &&
    cursors.left?.isUp &&
    cursors.up?.isDown &&
    cursors.down?.isUp
  ) {
    if (cursors.right?.timeDown < cursors.up?.timeDown) {
      moveUp(player, speed)
    } else {
      moveRight(player, speed)
    }
    return
  }

  if (
    cursors.right?.isDown &&
    cursors.left?.isUp &&
    cursors.up?.isUp &&
    cursors.down?.isDown
  ) {
    if (cursors.right?.timeDown < cursors.down?.timeDown) {
      moveDown(player, speed)
    } else {
      moveRight(player, speed)
    }
    return
  }

  if (
    cursors.right?.isUp &&
    cursors.left?.isDown &&
    cursors.up?.isDown &&
    cursors.down?.isUp
  ) {
    if (cursors.left?.timeDown < cursors.up?.timeDown) {
      moveUp(player, speed)
    } else {
      moveLeft(player, speed)
    }
    return
  }

  if (
    cursors.right?.isUp &&
    cursors.left?.isDown &&
    cursors.up?.isUp &&
    cursors.down?.isDown
  ) {
    if (cursors.left?.timeDown < cursors.down?.timeDown) {
      moveDown(player, speed)
    } else {
      moveLeft(player, speed)
    }
    return
  }

  if (
    cursors.right?.isUp &&
    cursors.left?.isUp &&
    cursors.up?.isDown &&
    cursors.down?.isDown
  ) {
    if (cursors.up?.timeDown < cursors.down?.timeDown) {
      moveDown(player, speed)
    } else {
      moveUp(player, speed)
    }
    return
  }

  if (
    cursors.right?.isDown &&
    cursors.left?.isUp &&
    cursors.up?.isUp &&
    cursors.down?.isUp
  ) {
    moveRight(player, speed)
    return
  }

  if (
    cursors.right?.isUp &&
    cursors.left?.isDown &&
    cursors.up?.isUp &&
    cursors.down?.isUp
  ) {
    moveLeft(player, speed)
    return
  }

  if (
    cursors.right?.isUp &&
    cursors.left?.isUp &&
    cursors.up?.isDown &&
    cursors.down?.isUp
  ) {
    moveUp(player, speed)
    return
  }

  if (
    cursors.right?.isUp &&
    cursors.left?.isUp &&
    cursors.up?.isUp &&
    cursors.down?.isDown
  ) {
    moveDown(player, speed)
    return
  }

  player.setVelocity(0, 0)
  const parts = player.anims.currentAnim.key.split('-')
  parts[1] = 'idle'
  player.anims.play(parts.join('-'))
}

export default playerMovement
