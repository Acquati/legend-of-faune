import { FauneAnimsKeys } from '../../consts/AnimsKeys'

const moveUpRight = (
  player: Phaser.Physics.Arcade.Sprite,
  movementVelocity: number
) => {
  player.scaleX = 1
  player.body.offset.x = player.body.width

  const velocity = Math.round(Math.cos(Math.PI / 4) * movementVelocity)
  player.setVelocity(velocity, -velocity)
  player.anims.play({ key: FauneAnimsKeys.WalkSide }, true)
}

const moveRightDown = (
  player: Phaser.Physics.Arcade.Sprite,
  movementVelocity: number
) => {
  player.scaleX = 1
  player.body.offset.x = player.body.width

  const velocity = Math.round(Math.cos(Math.PI / 4) * movementVelocity)
  player.setVelocity(velocity, velocity)
  player.anims.play({ key: FauneAnimsKeys.WalkSide }, true)
}

const moveDownLeft = (
  player: Phaser.Physics.Arcade.Sprite,
  movementVelocity: number
) => {
  player.scaleX = -1
  player.body.offset.x = player.body.width * 2

  const velocity = Math.round(Math.cos(Math.PI / 4) * movementVelocity)
  player.setVelocity(-velocity, velocity)
  player.anims.play({ key: FauneAnimsKeys.WalkSide }, true)
}

const moveLeftUp = (
  player: Phaser.Physics.Arcade.Sprite,
  movementVelocity: number
) => {
  player.scaleX = -1
  player.body.offset.x = player.body.width * 2

  const velocity = Math.round(Math.cos(Math.PI / 4) * movementVelocity)
  player.setVelocity(-velocity, -velocity)
  player.anims.play({ key: FauneAnimsKeys.WalkSide }, true)
}

const moveUp = (
  player: Phaser.Physics.Arcade.Sprite,
  movementVelocity: number
) => {
  player.setVelocity(0, -movementVelocity)
  player.anims.play({ key: FauneAnimsKeys.WalkUp }, true)
}

const moveRight = (
  player: Phaser.Physics.Arcade.Sprite,
  movementVelocity: number
) => {
  player.scaleX = 1
  player.body.offset.x = player.body.width

  player.setVelocity(movementVelocity, 0)
  player.anims.play({ key: FauneAnimsKeys.WalkSide }, true)
}

const moveDown = (
  player: Phaser.Physics.Arcade.Sprite,
  movementVelocity: number
) => {
  player.setVelocity(0, movementVelocity)
  player.anims.play({ key: FauneAnimsKeys.WalkDown }, true)
}

const moveLeft = (
  player: Phaser.Physics.Arcade.Sprite,
  movementVelocity: number
) => {
  player.scaleX = -1
  player.body.offset.x = player.body.width * 2

  player.setVelocity(-movementVelocity, 0)
  player.anims.play({ key: FauneAnimsKeys.WalkSide }, true)
}

const playerMovement = (
  cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  player: Phaser.Physics.Arcade.Sprite,
  movementVelocity: number
) => {
  if (
    cursors.up?.isDown &&
    cursors.right?.isDown &&
    cursors.down?.isUp &&
    cursors.left?.isUp
  ) {
    moveUpRight(player, movementVelocity)
  } else if (
    cursors.up?.isUp &&
    cursors.right?.isDown &&
    cursors.down?.isDown &&
    cursors.left?.isUp
  ) {
    moveRightDown(player, movementVelocity)
  } else if (
    cursors.up?.isUp &&
    cursors.right?.isUp &&
    cursors.down?.isDown &&
    cursors.left?.isDown
  ) {
    moveDownLeft(player, movementVelocity)
  } else if (
    cursors.up?.isDown &&
    cursors.right?.isUp &&
    cursors.down?.isUp &&
    cursors.left?.isDown
  ) {
    moveLeftUp(player, movementVelocity)
  } else if (
    cursors.up?.isDown &&
    cursors.right?.isUp &&
    cursors.down?.isDown &&
    cursors.left?.isUp
  ) {
    if (cursors.up?.timeDown < cursors.down?.timeDown) {
      moveDown(player, movementVelocity)
    } else {
      moveUp(player, movementVelocity)
    }
  } else if (
    cursors.up?.isUp &&
    cursors.right?.isDown &&
    cursors.down?.isUp &&
    cursors.left?.isDown
  ) {
    if (cursors.right?.timeDown < cursors.left?.timeDown) {
      moveLeft(player, movementVelocity)
    } else {
      moveRight(player, movementVelocity)
    }
  } else if (
    cursors.up?.isDown &&
    cursors.right?.isUp &&
    cursors.down?.isUp &&
    cursors.left?.isUp
  ) {
    moveUp(player, movementVelocity)
  } else if (
    cursors.up?.isUp &&
    cursors.right?.isDown &&
    cursors.down?.isUp &&
    cursors.left?.isUp
  ) {
    moveRight(player, movementVelocity)
  } else if (
    cursors.up?.isUp &&
    cursors.right?.isUp &&
    cursors.down?.isDown &&
    cursors.left?.isUp
  ) {
    moveDown(player, movementVelocity)
  } else if (
    cursors.up?.isUp &&
    cursors.right?.isUp &&
    cursors.down?.isUp &&
    cursors.left?.isDown
  ) {
    moveLeft(player, movementVelocity)
  } else {
    player.setVelocity(0, 0)
    const parts = player.anims.currentAnim.key.split('-')
    parts[1] = 'idle'
    player.anims.play(parts.join('-'))
  }
}

export default playerMovement
