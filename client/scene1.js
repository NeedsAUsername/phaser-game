'use strict';

class Scene1 extends Phaser.Scene {
  constructor() {
    super({
      key: 'Scene1'
    })
  }

  preload() {
    this.load.image('SKY', 'assets/sky.png') 
    this.load.image('platform', 'assets/platform.png') 
    this.load.image('diamond', 'assets/diamond.png') 
    this.load.spritesheet('woof', 'assets/woof.png', {frameWidth: 32, frameHeight: 32, frameMax: 4})
  }

  create() {
    this.anims.create({
      key: 'left', 
      frames: this.anims.generateFrameNumbers('player', {start: 0, end: 1}), 
      frameRate: 10, 
      repeat: -1
    })
    this.anims.create({
      key: 'right', 
      frames: this.anims.generateFrameNumbers('player', {start: 2, end: 3}), 
      frameRate: 10, 
      repeat: -1
    })

    this.worldHeight = this.game.config.height
    this.sky = this.add.image(400, 300, 'SKY') 

    this.player = this.add.sprite(32, 300, 'woof')
    this.physics.add.existing(this.player)
    this.player.body.bounce.y = 0.2 
    this.player.body.collideWorldBounds = true  

    this.platforms = this.add.group() 
    this.platforms.enableBody = true 

    this.ground = this.platforms.create(100, this.worldHeight - 32, 'platform') 
    this.ground.width *= 4
    this.ground.scale = 4
    this.addImmovablePhysics(this.ground)
    
    this.ledge = this.platforms.create(400, 450, 'platform') 
    this.addImmovablePhysics(this.ledge)
    this.ledge2 = this.platforms.create(750, 300, 'platform')
    this.addImmovablePhysics(this.ledge2)
    

    this.diamonds = this.add.group() 
    this.diamonds.enableBody = true  

    for (let i = 0; i < 10; i++) {
      let diamond = this['diamond' + i]
      diamond = this.diamonds.create(100 + i * 70, 0, 'diamond') 
      this.physics.add.existing(diamond)
    }

    this.score = 0
    this.scoreText = this.add.text(16, 16, '', {fontSize: '32px', fill: '#000'}) 
    this.cursors = this.input.keyboard.createCursorKeys()

    console.log('player', this.player)
    console.log('ground', this.ground)
  }

  update() {
    this.physics.collide(this.player, this.platforms)
    this.physics.collide(this.diamonds, this.platforms)
    this.physics.overlap(this.player, this.diamonds, this.collectDiamond, null, this) 
    this.player.body.velocity.x = 0
    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -150 
      // this.player.anims.play('left', true)
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = 150 
      // this.player.anims.play('right', true)
    } 
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -250
    } else if (this.cursors.down.isDown && !this.player.body.touching.down) {
      this.player.body.velocity.y = 150
    }
  }

  addImmovablePhysics(object) {
    this.physics.add.existing(object)
    object.body.immovable = true 
    object.body.moves = false 
  }  

  collectDiamond(player, diamond) {
    diamond.destroy()
    this.score += 10 
    this.scoreText = 'Score: ' + this.score
  }
}
