import { DWARF, STAR, MOON } from "../enums/collectibleTypes.js";
import { sharedInstance as events } from '../js/EventCenter.js'
import { getRandomEnemy } from "../js/utils.js";



export class Play extends Phaser.Scene {
  score = 0;
  health = 100;
  gameOver = false;

  constructor() {
    super("Play");
  }

  preload() {
    this.load.tilemapTiledJSON("map", "public/assets/tilemaps/map.json");
    this.load.image("tilesBelow", "public/assets/images/sky_atlas.png");
    this.load.image("tilesPlatform", "public/assets/images/platform_atlas.png");
  }

  create() {
    this.scene.launch('ui', {score: this.score, health: this.health});
    const map = this.make.tilemap({ key: "map" });

    const tilesetBelow = map.addTilesetImage("sky_atlas", "tilesBelow");
    const tilesetPlatform = map.addTilesetImage(
      "platform_atlas",
      "tilesPlatform"
    );

    const belowLayer = map.createLayer("Fondo", tilesetBelow, 0, 0);
    const worldLayer = map.createLayer("Plataformas", tilesetPlatform, 0, 0);
    const objectsLayer = map.getObjectLayer("Objetos");

    worldLayer.setCollisionByProperty({ collides: true });

    const spawnPoint = map.findObject("Objetos", (obj) => obj.name === "dude");

    this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "dude");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    if (!this.cursors) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    this.collectibles = this.physics.add.group();

    objectsLayer.objects.forEach((objData) => {
      const { x = 0, y = 0, name } = objData;

      switch (name) {
        case STAR: {
          const star = this.collectibles.create(x, y, STAR);
          star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
          star.setData({score: 10, life: 0.5, addTime: 0});
          star.setCollideWorldBounds(true);
          break;
        }
        case DWARF: {
          const dwarf = this.collectibles.create(x, y, DWARF);
          dwarf.setBounceY(Phaser.Math.FloatBetween(0.1, 1));
          dwarf.setBounceX(Phaser.Math.FloatBetween(0.1, 0.4));
          dwarf.setVelocityX(20);
          dwarf.setData({score: 5, life: 0.25, addTime: 4});
          dwarf.setCollideWorldBounds(true);
          break;
        }
        case MOON: {
          const moon = this.collectibles.create(x, y, MOON);
          moon.setBounceX(1);
          moon.setVelocityX(60);
          moon.setData({score: 50, life: 0.25, addTime: 3});
          moon.setCollideWorldBounds(true);
          break;
        }
      }
    });

    this.enemies = this.physics.add.group();

    this.physics.add.collider(this.player, worldLayer);
    this.physics.add.collider(this.collectibles, worldLayer);
    this.physics.add.collider(this.enemies, worldLayer);
    this.physics.add.overlap(this.player, this.collectibles, this.collect, null, this);
    this.physics.add.collider(this.player, this.enemies, this.hitEnemy, null, this);
  }

  update() {
    if (this.gameOver) {
      return;
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-330);
    }
  }

  collect(player, collectible) {
    collectible.disableBody(true, true);
    const score = collectible?.data?.values?.score || null;
    if (score) {
      this.score += score;
      events.emit('update-score', score);
    }
    

    if (this.collectibles.countActive(true) === 0) {
      this.collectibles.children.iterate(function (child) {
        child.enableBody(true, child.x, child.y + 10, true, true);
      });
      this.spawnEnemy(player);
    }
  }

  spawnEnemy(player){
    const x =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    const enemyConfig = getRandomEnemy();
    const enemy = this.enemies.create(x, Phaser.Math.Between(20, 300), enemyConfig.sprite);
    enemy.setCollideWorldBounds(true);
    enemy.setBounce(enemyConfig.bounce);
    enemy.setVelocity(Phaser.Math.Between(-200, 200));
    enemy.setData(enemyConfig);
  }

  hitEnemy(player, enemy) {
    const damage = enemy?.data?.values?.damage || 0;
    if (damage) {
      this.health -= damage;
      events.emit('health-changed', this.health);
    }
    
    if (this.health <= 0) {
      this.gameOver = true;
      this.lost(player);
    }    
  }

  lost(player){
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("turn");

    setTimeout(() => {
      this.scene.start(
        "Retry",
        {
          score: this.score,
        },
      );
    }, 1000);
  }

}
