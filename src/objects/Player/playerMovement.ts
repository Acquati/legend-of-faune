import { FauneAnimsKeys } from '../../consts/AnimsKeys'

const moveUpRight = (player: Phaser.Physics.Arcade.Sprite, speed: number) => {
  player.scaleX = 1
  player.body.offset.x = player.body.width

  player.setVelocity(speed, -speed)
  player.anims.play({ key: FauneAnimsKeys.WalkSide }, true)
}

const moveRightDown = (player: Phaser.Physics.Arcade.Sprite, speed: number) => {
  player.scaleX = 1
  player.body.offset.x = player.body.width

  player.setVelocity(speed, speed)
  player.anims.play({ key: FauneAnimsKeys.WalkSide }, true)
}

const moveDownLeft = (player: Phaser.Physics.Arcade.Sprite, speed: number) => {
  player.scaleX = -1
  player.body.offset.x = player.body.width * 2

  player.setVelocity(-speed, speed)
  player.anims.play({ key: FauneAnimsKeys.WalkSide }, true)
}

const moveLeftUp = (player: Phaser.Physics.Arcade.Sprite, speed: number) => {
  player.scaleX = -1
  player.body.offset.x = player.body.width * 2

  player.setVelocity(-speed, -speed)
  player.anims.play({ key: FauneAnimsKeys.WalkSide }, true)
}

const moveUp = (player: Phaser.Physics.Arcade.Sprite, speed: number) => {
  player.setVelocity(0, -speed)
  player.anims.play({ key: FauneAnimsKeys.WalkUp }, true)
}

const moveRight = (player: Phaser.Physics.Arcade.Sprite, speed: number) => {
  player.scaleX = 1
  player.body.offset.x = player.body.width

  player.setVelocity(speed, 0)
  player.anims.play({ key: FauneAnimsKeys.WalkSide }, true)
}

const moveDown = (player: Phaser.Physics.Arcade.Sprite, speed: number) => {
  player.setVelocity(0, speed)
  player.anims.play({ key: FauneAnimsKeys.WalkDown }, true)
}

const moveLeft = (player: Phaser.Physics.Arcade.Sprite, speed: number) => {
  player.scaleX = -1
  player.body.offset.x = player.body.width * 2

  player.setVelocity(-speed, 0)
  player.anims.play({ key: FauneAnimsKeys.WalkSide }, true)
}

const playerMovement = (
  cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  player: Phaser.Physics.Arcade.Sprite,
  speed: number
) => {
  if (
    cursors.up?.isDown &&
    cursors.right?.isDown &&
    cursors.down?.isUp &&
    cursors.left?.isUp
  ) {
    moveUpRight(player, speed)
  } else if (
    cursors.up?.isUp &&
    cursors.right?.isDown &&
    cursors.down?.isDown &&
    cursors.left?.isUp
  ) {
    moveRightDown(player, speed)
  } else if (
    cursors.up?.isUp &&
    cursors.right?.isUp &&
    cursors.down?.isDown &&
    cursors.left?.isDown
  ) {
    moveDownLeft(player, speed)
  } else if (
    cursors.up?.isDown &&
    cursors.right?.isUp &&
    cursors.down?.isUp &&
    cursors.left?.isDown
  ) {
    moveLeftUp(player, speed)
  } else if (
    cursors.up?.isDown &&
    cursors.right?.isUp &&
    cursors.down?.isDown &&
    cursors.left?.isUp
  ) {
    if (cursors.up?.timeDown < cursors.down?.timeDown) {
      moveDown(player, speed)
    } else {
      moveUp(player, speed)
    }
  } else if (
    cursors.up?.isUp &&
    cursors.right?.isDown &&
    cursors.down?.isUp &&
    cursors.left?.isDown
  ) {
    if (cursors.right?.timeDown < cursors.left?.timeDown) {
      moveLeft(player, speed)
    } else {
      moveRight(player, speed)
    }
  } else if (
    cursors.up?.isDown &&
    cursors.right?.isUp &&
    cursors.down?.isUp &&
    cursors.left?.isUp
  ) {
    moveUp(player, speed)
  } else if (
    cursors.up?.isUp &&
    cursors.right?.isDown &&
    cursors.down?.isUp &&
    cursors.left?.isUp
  ) {
    moveRight(player, speed)
  } else if (
    cursors.up?.isUp &&
    cursors.right?.isUp &&
    cursors.down?.isDown &&
    cursors.left?.isUp
  ) {
    moveDown(player, speed)
  } else if (
    cursors.up?.isUp &&
    cursors.right?.isUp &&
    cursors.down?.isUp &&
    cursors.left?.isDown
  ) {
    moveLeft(player, speed)
  } else {
    player.setVelocity(0, 0)
    const parts = player.anims.currentAnim.key.split('-')
    parts[1] = 'idle'
    player.anims.play(parts.join('-'))
  }
}

export default playerMovement
