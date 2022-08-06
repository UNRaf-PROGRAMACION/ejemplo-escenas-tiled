import { ATOMIC, BOMB, C4, SMOKE } from "../enums/enemyTypes.js";

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

const getRandomEnemy = () => {
    const randomIndex = getRandomInt(0,4);

    const enemies = {
      [0]: BOMB,
      [1]: ATOMIC,
      [2]: C4,
      [3]: SMOKE,
    };

    return enemies[randomIndex];
}

export {
    getRandomInt,
    getRandomEnemy,
}