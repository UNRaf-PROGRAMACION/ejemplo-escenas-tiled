import Button from "../js/button.js";

export class Retry extends Phaser.Scene {
  constructor() {
    super("Retry");
  }

  init(data) {
    this.score = data.score;
  }

  create() {
    this.add
      .image(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "mainmenu_bg"
      )
      .setScale(1.1);

    this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY / 1.5,
      "sad_cow"
    );

    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        `Puntaje alcanzado: ${this.score}`
      )
      .setOrigin(0.5);

    const boton = new Button(
      this.cameras.main.centerX,
      this.cameras.main.centerY + this.cameras.main.centerY / 3,
      "Retry",
      this,
      () => {
        this.scene.start("Play");
      }
    );
  }
}
