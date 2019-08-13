'use strict';

class Scene1 extends Phaser.Scene {
  constructor() {
    super({
      key: 'Scene1'
    })
  }

  preload() {
    this.load.image('SKY', 'assets/sky.png') 
    this.load.image('BACKGROUND', 'assets/maplestory_background.jpg')
    this.load.image('platform', 'assets/platform.png') 
    this.load.image('diamond', 'assets/diamond.png') 
    this.load.spritesheet('snail', 'assets/snail.png', {frameWidth: 40, frameHeight: 35})
    this.load.spritesheet('platforms', 'assets/platforms1.png', {frameWidth: 80, frameHeight: 50})
    this.load.spritesheet('woof', 'assets/woof.png', {frameWidth: 32, frameHeight: 32, centerY: 30})
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
    this.worldWidth = this.game.config.width 

    this.background = this.add.image(this.worldWidth /2, this.worldHeight /2, 'BACKGROUND') 

    this.player = this.add.sprite(32, 300, 'woof', 2)
    this.physics.add.existing(this.player)
    this.player.body.bounce.y = 0.2 
    this.player.body.collideWorldBounds = true 
    this.player.maxHealth = 100 
    this.player.health = 100
    this.player.healthText = this.add.text(16, 50, 'Health: ' + this.player.health + '/' + this.player.maxHealth, {fontSize: '32px', fill: '#000'})  
    this.player.healthBar = this.add.rectangle(20, 80, 300, 20, '#fff')
    this.player.healthBar.setOrigin(0, 0)

    this.platforms = this.add.group() 
    this.platforms.enableBody = true 

    this.ground = this.add.tileSprite(this.worldWidth/2, this.worldHeight - 15, this.worldWidth, 35, 'platforms') 
    this.addImmovablePhysics(this.ground)
    this.platforms.add(this.ground)
    

    this.ledge = this.add.tileSprite(400, 470, 500, 35, 'platforms')
    this.addImmovablePhysics(this.ledge)
    this.platforms.add(this.ledge)

    this.ledge2 = this.add.tileSprite(600, 350, 300, 35, 'platforms')
    this.addImmovablePhysics(this.ledge2)
    this.platforms.add(this.ledge2)    

    this.diamonds = this.add.group() 
    this.diamonds.enableBody = true  

    for (let i = 0; i < 10; i++) {
      let diamond = this['diamond' + i]
      diamond = this.diamonds.create(100 + i * 70, 0, 'diamond') 
      this.physics.add.existing(diamond)
      diamond.body.bounce.y = 0.2
      diamond.body.gravity.y = 1000
    }

    this.enemies = this.add.group() 

    for (let i = 0; i < 3; i++) {
      let snail = this['snail' + i]
      let platform = this.platforms.children.entries[i] 
      snail = this.enemies.create(300 + i*100, platform.y - 35, 'snail') 
      snail.setRandomPosition(200, 200, 600, 300)
      this.physics.add.existing(snail) 
      snail.body.collideWorldBounds = true
      if (i % 2 == 0) {
        snail.direction = 'left'
      } else {
        snail.direction = 'right' 
        snail.flipX = true 
      }
      snail.attack = 20 
    }

    this.score = 0
    this.scoreText = this.add.text(16, 16, 'Score: ' + this.score, {fontSize: '32px', fill: '#000'}) 
    this.cursors = this.input.keyboard.createCursorKeys()

    console.log('platforms', this.platforms.children.entries[0].y)
    console.log('player', this.player)
    console.log('ground', this.ground)
    console.log('diamond', this.diamonds)
    console.log('scoreText', this.scoreText)
    console.log('snail', this.enemies)
  }

  update() {
    this.physics.collide(this.player, this.platforms)
    this.physics.collide(this.diamonds, this.platforms)
    this.physics.collide(this.enemies, this.platforms)
    this.physics.overlap(this.player, this.diamonds, this.collectDiamond, null, this) 
    this.physics.overlap(this.player, this.enemies, this.takeDamageFromEnemy, null, this)

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.jumping = true 
      this.player.body.velocity.y = -350 
    } else {
      this.player.body.touching.down ? this.player.jumping = false : this.player.body.velocity.y += 5
    } 

    if (this.cursors.left.isDown) { 
      this.player.direction = 'left'
      this.player.jumping ? this.player.setFrame(1) : this.player.anims.play('left', true) 
      this.player.body.velocity.x = -200
    } else if (this.cursors.right.isDown) {
      this.player.direction = 'right'
      this.player.jumping ? this.player.setFrame(2) : this.player.anims.play('right', true)
      this.player.body.velocity.x = 200
    } else {
      if (!this.player.movementLocked) { this.player.body.velocity.x = 0 }
      this.player.direction === 'left' ? this.player.setFrame(1) : this.player.setFrame(2)
    }

    this.enemies.children.entries.forEach(enemy => {
      this.paceCharacter(enemy, {speed: 40, distance: 200})
    })
    

    if (this.score >= 100) {
      this.winText = this.add.text(300, 16, 'You Win!', {fontSize: '64px', fill: '#000'}) 
      this.scene.pause()
      setTimeout(() => {
        this.scene.restart()       
      }, 1000)
    }
    if (this.player.health <= 0) {
      this.loseText = this.add.text(300, 16, 'You Died', {fontSize: '64px', fill: '#000'})
      this.scene.pause() 
      setTimeout(() => {
        this.scene.restart() 
      }, 1000)
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

  takeDamageFromEnemy(player, enemy) {
    if (!player.immune) {
      let directionFactor = player.direction === 'left' ? 1 : -1
      player.movementLocked = true 
      setTimeout(() => {
        player.movementLocked = false
      }, 500) 
      player.immune = true 
      setTimeout(() => {
        player.immune = false
      }, 2000)
      player.body.velocity.x = 100 * directionFactor 
      player.body.velocity.y = -100
      player.health -= enemy.attack
      player.healthText.text = 'Health: ' + player.health + '/' + player.maxHealth 
      player.healthBar.width = (this.player.health / this.player.maxHealth) * 300
    }
  }

  paceCharacter(character, {speed, distance}) {
    if (!character.distanceTraveled) { character.distanceTraveled = 0 }
    const directionFactor = character.direction === 'left' ? -1 : 1 
    character.body.velocity.x = speed * directionFactor 
    character.distanceTraveled -= directionFactor
    if (character.distanceTraveled >= distance) {
      character.direction = 'right' 
      character.flipX = true 
    } 
    if (character.distanceTraveled < -1 * distance) {
      character.direction = 'left'
      character.flipX = false
    }
  }
}
