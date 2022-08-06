import { MAIN_MENU, PRELOADS } from "../enums/sceneKeys.js";

export class Preloads extends Phaser.Scene {
  constructor() {
    super(PRELOADS);
  }

  preload() {
    this.load.image("sad_cow", "public/assets/images/sad_cow.png");
    this.load.image("phaser_logo", "public/assets/images/phaser_logo.png");
    this.load.image(
      "mainmenu_bg",
      "public/assets/images/main_menu_background.png"
    );
    this.load.image("sky", "public/assets/images/sky.png");
    this.load.image("ground", "public/assets/images/platform.png");
    this.load.image("star", "public/assets/images/star.png");
    this.load.image("moon", "public/assets/images/moon.png");
    this.load.image("dwarf", "public/assets/images/dwarf.png");
    this.load.image("bomb", "public/assets/images/bomb.png");
    this.load.image("atomic", "public/assets/images/atomic.png");
    this.load.image("c4", "public/assets/images/c4.png");
    this.load.image("smoke", "public/assets/images/smoke.png");
    this.load.spritesheet("dude", "public/assets/images/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.start(MAIN_MENU);
  }
}
