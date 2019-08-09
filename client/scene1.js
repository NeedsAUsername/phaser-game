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
    this.load.spritesheet('woof', 'assets/woof.png', {frameWidth: 32, frameHeight: 32})
  }

  create() {
    this.anims.create({
      key: 'left', 
      frames: this.anims.generateFrameNumbers('woof', {start: 0, end: 1}), 
      frameRate: 10, 
      repeat: -1
    })
    this.anims.create({
      key: 'right', 
      frames: this.anims.generateFrameNumbers('woof', {start: 2, end: 3}), 
      frameRate: 10, 
      repeat: -1
    })

    this.worldHeight = this.game.config.height
    this.sky = this.add.image(400, 300, 'SKY') 

    this.player = this.add.sprite(32, 300, 'woof', 2)
    this.physics.add.existing(this.player)
    this.player.body.bounce.y = 0.2 
    this.player.body.collideWorldBounds = true  

    this.platforms = this.add.group() 
    this.platforms.enableBody = true 

    this.ground = this.platforms.create(100, this.worldHeight - 32, 'platform') 
    this.ground.width *= 4
    this.ground.scale = 4
    this.addImmovablePhysics(this.ground)
    
    this.ledge = this.platforms.create(400, 400, 'platform') 
    this.addImmovablePhysics(this.ledge)
    this.ledge2 = this.platforms.create(750, 300, 'platform')
    this.addImmovablePhysics(this.ledge2)
    

    this.diamonds = this.add.group() 
    this.diamonds.enableBody = true  

    for (let i = 0; i < 10; i++) {
      let diamond = this['diamond' + i]
      diamond = this.diamonds.create(100 + i * 70, 0, 'diamond') 
      this.physics.add.existing(diamond)
      diamond.body.bounce.y = 0.2
      diamond.body.gravity.y = 1000
    }

    this.score = 0
    this.scoreText = this.add.text(16, 16, 'Score: ' + this.score, {fontSize: '32px', fill: '#000'}) 
    this.cursors = this.input.keyboard.createCursorKeys()

    console.log('player', this.player)
    console.log('ground', this.ground)
    console.log('diamond', this.diamonds)
    console.log('scoreText', this.scoreText)
  }

  update() {
    this.physics.collide(this.player, this.platforms)
    this.physics.collide(this.diamonds, this.platforms)
    this.physics.overlap(this.player, this.diamonds, this.collectDiamond, null, this) 

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.jumping = true 
      this.player.body.velocity.y = -350 
    } else {
      this.player.body.touching.down ? this.player.jumping = false : this.player.body.velocity.y += 5
    } 

    if (this.cursors.left.isDown) { 
      this.player.direction = 'left'
      this.player.jumping ? this.player.setFrame(1) : this.player.anims.play('left', true) 
      this.player.body.velocity.x = -150
    } else if (this.cursors.right.isDown) {
      this.player.direction = 'right'
      this.player.jumping ? this.player.setFrame(2) : this.player.anims.play('right', true)
      this.player.body.velocity.x = 150
    } else {
      this.player.body.velocity.x = 0
      this.player.direction === 'left' ? this.player.setFrame(1) : this.player.setFrame(2)
    }

    if (this.score >= 100) {
      this.winText = this.add.text(300, 16, 'You Win!', {fontSize: '64px', fill: '#000'}) 
      this.scene.pause()
      setTimeout(() => {
        this.scene.restart()       
      }, 1000);
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
    this.scoreText.text = 'Score: ' + this.score 
  }
}
