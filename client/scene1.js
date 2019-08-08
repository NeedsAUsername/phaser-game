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
    this.sky = this.add.image(400, 300, 'SKY') 
    this.worldHeight = this.game.config.height

    this.player = this.physics.add.sprite(32, 300, 'woof')
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

    this.score = this.add.text(16, 16, '', {fontSize: '32px', fill: '#000'}) 
    this.cursors = this.input.keyboard.createCursorKeys()

    console.log('this', this)
  }

  update() {
    this.physics.collide(this.player, this.platforms)
    this.physics.collide(this.diamonds, this.platforms)
  }

  addImmovablePhysics(object) {
    this.physics.add.existing(object)
    object.body.immovable = true 
    object.body.moves = false
  }  
}
