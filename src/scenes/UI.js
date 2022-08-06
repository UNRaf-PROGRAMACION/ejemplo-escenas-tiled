import { UI_SCENE } from '../enums/sceneKeys.js';
import { sharedInstance as events } from '../js/EventCenter.js'

export class UI extends Phaser.Scene {
    constructor(){
        super({key: UI_SCENE});
    }

    create({score = 0, health = 100}){
        this.score = score;
        this.scoreLabel = this.add.text(300, 6, 'Score: 0', {
			fontSize: "32px",
            fill: "#000",
		})

        this.graphics = this.add.graphics();
        this.setHealthBar(this.health);

        events.on('update-score', this.handleScore, this)
		events.on('health-changed', this.handleHealthChanged, this)

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			events.off('update-score', this.handleScore, this)
		})
    }


    setHealthBar(value) {
		const width = 200
		const percent = Phaser.Math.Clamp(value, 0, 100) / 100

		this.graphics.clear()
		this.graphics.fillStyle(0x808080)
		this.graphics.fillRoundedRect(10, 10, width, 20, 5)
		if (percent > 0)
		{
			this.graphics.fillStyle(0x00ff00)
			this.graphics.fillRoundedRect(10, 10, width * percent, 20, 5)
		}
	}

    handleScore(score){
		this.score += score;
		this.scoreLabel.text = `Score: ${this.score}`
	}

    handleHealthChanged(value){
		this.tweens.addCounter({
			from: this.health,
			to: value,
			duration: 200,
			ease: Phaser.Math.Easing.Sine.InOut,
			onUpdate: tween => {
				const value = tween.getValue()
				this.setHealthBar(value)
			}
		})

		this.health = value
	}
}