'use strict';
/*
## Процесс и порядок реализации

Для того, чтобы максимально просто и быстро получить базовый рабочий вариант проекта, рекомендуем придерживаться следующего плана разработки:

1. Реализовать базовые классы игры: `Vector`, `Actor` и `Level`.*/
class Vector {
	constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }
  plus(vector) {
    if (vector instanceof Vector) {
      const newObject = new Vector();
      newObject.x = this.x + vector.x;
      newObject.y = this.y + vector.y; 
      return newObject;
    } 
      throw new Error('Можно прибавлять к вектору только вектор типа Vector!');
  }
  times (multiplier) {
    const newVector = new Vector();
    newVector.x = this.x * multiplier;
    newVector.y = this.y * multiplier;
    return newVector;
  }
}
/*checking code in console for the 1st class*/
// const start = new Vector(30, 50);
// const moveTo = new Vector(5, 10);
// const finish = start.plus(moveTo.times(2));
// console.log(`Исходное расположение: ${start.x}:${start.y}`);
// console.log(`Текущее расположение: ${finish.x}:${finish.y}`);

class Actor {
  constructor(pos = new Vector(), size = new Vector(1, 1), speed = new Vector()) {
    if (!(pos instanceof Vector) ||
        !(size instanceof Vector) ||
        !(speed instanceof Vector)) {
          throw Error('Объекты должны быть типа Vector!');
        }
    this.pos = pos;
    this.size = size;
    this.speed = speed;
    this._type = 'actor';
  }

  act() {}

  get left() {
    return this.pos.x;
  }

  get top() {
    return this.pos.y;
  }

  get right() {
    return this.pos.x + this.size.x;
  }

  get bottom() {
    return this.pos.y + this.size.y;
  }

  get type() {
    return this._type;
  }

  isIntersect(actor) {
    if (!(actor instanceof Actor) || actor === undefined) {
          throw Error('Объект должен быть типа Actor!');
    }

    if (actor === this || actor.size.x < 0 || actor.size.y < 0) {
          return false;
      }

  return !(actor.left >= this.right || actor.right <= this.left || actor.top >= this.bottom || actor.bottom <= this.top);
  }
}
/*checking code in console for the 2nd class*/
// const items = new Map();
// const player = new Actor();
// items.set('Игрок', player);
// items.set('Первая монета', new Actor(new Vector(10, 10)));
// items.set('Вторая монета', new Actor(new Vector(15, 5)));

// function position(item) {
//   return ['left', 'top', 'right', 'bottom']
//     .map(side => `${side}: ${item[side]}`)
//     .join(', ');  
// }

// function movePlayer(x, y) {
//   player.pos = player.pos.plus(new Vector(x, y));
// }

// function status(item, title) {
//   console.log(`${title}: ${position(item)}`);
//   if (player.isIntersect(item)) {
//     console.log(`Игрок подобрал ${title}`);
//   }
// }

// items.forEach(status);
// movePlayer(10, 10);
// items.forEach(status);
// movePlayer(5, -5);
// items.forEach(status);

class Level {
  constructor(grid = [], actors = []) {
    this.grid = grid;
    this.actors = actors;
    this.height = grid.length;
    this.width = grid.reduce((cell, row) => row.length > cell ? row.length : cell, 0);
    this.status = null;
    this.finishDelay = 1;
    this.player = actors.find(elem => elem.type === 'player');
  }

  isFinished() {
    return this.status !== null && this.finishDelay < 0 ? true : false;
  }

  actorAt(actor) {
    if (!actor || !(actor instanceof Actor)) {
      throw Error('Объект должен быть типа Actor!');
    }
    return this.actors.find(el => el.isIntersect(actor));
  }

  isObstacle(x, y) {
    const wall = 'wall';
    const lava = 'lava';
    const grid = this.grid;
    return (grid[y] && grid[y][x] && ((grid[y][x] === wall) || (grid[y][x] === lava)));
  }

  obstacleAt(nextPos, size) {
    if (!(nextPos instanceof Vector) ||
        !(size instanceof Vector)) {
      throw Error('Объекты должны быть типа Vector!');
    }
    const sizeX = size.x - 0.0001;
    const sizeY = size.y - 0.0001;
    const grid = this.grid;
    const x = nextPos.x;
    const y = nextPos.y;
    const left = Math.floor(x);
    const top = Math.floor(y);
    const bottom = Math.floor(y + sizeY);
    const right = Math.floor(x + sizeX);
    const middle = Math.round(top + sizeY / 2);

    if (this.isObstacle(left, top)) {
      return grid[top][left];
    }
    if (this.isObstacle(right, top)) {
      return grid[top][right];
    }
    if (this.isObstacle(left, bottom)) {
        return grid[bottom][left];
    }
    if (this.isObstacle(right, bottom)) {
        return grid[bottom][right];
    }
    if (this.isObstacle(left, middle)) {
        return grid[middle][left];
    }
    if (this.isObstacle(right, middle)) {
        return grid[middle][right];
    }
    if (left < 0 || x + sizeX > this.width || top < 0) {
      return 'wall';
    }
    if (y + sizeY > this.height) {
      return 'lava';
    }
  }

  removeActor(actor) {
    this.actors = this.actors.filter(elem => elem !== actor);
  }

  noMoreActors(type) {
    const result = this.actors.filter(elem => elem.type === type);
    return result.length > 0 ? false : true;
  }

  playerTouched(type, actor) {
    if (this.status !== null) {
      return;
    }
    if (type === 'lava' || type === 'fireball') {
      this.status = 'lost';
    } else if (type === 'coin') {
      this.removeActor(actor);
      if (!this.actors.find(elem => elem.type === 'coin')) {
        this.status = 'won';
      }
    }
  }
}
/*checking code in console for class Level*/
// const grid = [
//   [undefined, undefined],
//   ['wall', 'wall']
// ];

// function MyCoin(title) {
//   this.type = 'coin';
//   this.title = title;
// }
// MyCoin.prototype = Object.create(Actor);
// MyCoin.constructor = MyCoin;

// const goldCoin = new MyCoin('Золото');
// const bronzeCoin = new MyCoin('Бронза');
// const player = new Actor();
// const fireball = new Actor();

// const level = new Level(undefined, [ goldCoin, bronzeCoin, player, fireball ]);

// level.playerTouched('coin', goldCoin);
// level.playerTouched('coin', bronzeCoin);

// if (level.noMoreActors('coin')) {
//   console.log('Все монеты собраны');
//   console.log(`Статус игры: ${level.status}`);
// }

// const obstacle = level.obstacleAt(new Vector(1, 1), player.size);
// if (obstacle) {
//   console.log(`На пути препятствие: ${obstacle}`);
// }

// const otherActor = level.actorAt(player);
// if (otherActor === fireball) {
//   console.log('Пользователь столкнулся с шаровой молнией');
// }
class LevelParser {
  constructor(objectDictionary) {
    this.objectDictionary = objectDictionary;
  }

  actorFromSymbol(gameObject) {
    if (!gameObject) return;
    const prop = Object.keys(this.objectDictionary).find(key => key === gameObject);
    return prop ? this.objectDictionary[prop] : prop;
  }

  obstacleFromSymbol(gameObject) {
    switch(gameObject) {
      case 'x': return 'wall';
      case '!': return 'lava';
      default: return;
    }
  }

  createGrid(arrOfString) {
    return arrOfString.map(str => str.split('').map(elem => {
      if(elem === '!') {
        return 'lava';
      } else if (elem === 'x') {
        return 'wall';
      }
    }));
  }

  createActors(arrOfActors) {
    const arr = arrOfActors.map(str => str.split(''));
    // console.log(arr);
    const actors = [];
    arr.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (this.objectDictionary && this.objectDictionary[cell] && typeof this.objectDictionary[cell] === 'function') {
          const actor = new this.objectDictionary[cell] (new Vector(x, y));
          if (actor instanceof Actor) {
              actors.push(actor);
          }
        }
      });
    });
    return actors;
  }

  parse(plan) {
    const grid = this.createGrid(plan);
    const actors = this.createActors(plan);
    return new Level(grid, actors);
  }
}
/*checking code for the class LevelParser*/
// const plan = [
//   ' @ ',
//   'x!x'
// ];
// console.log(plan);
// const actorsDict = Object.create(null);
// actorsDict['@'] = Actor;

// const parser = new LevelParser(actorsDict);
// const level = parser.parse(plan);

// level.grid.forEach((line, y) => {
//   line.forEach((cell, x) => console.log(`(${x}:${y}) ${cell}`));
// });

// level.actors.forEach(actor => console.log(`(${actor.pos.x}:${actor.pos.y}) ${actor.type}`));

class Fireball extends Actor {
  constructor(location = new Vector(), speed = new Vector()) {
    super(location, undefined, speed);
    this._type = 'fireball';
  }

  act(time, level) {
    const nextPos = this.getNextPosition(time);
    const obj = level.obstacleAt(nextPos, this.size);
    if (obj) {
      this.handleObstacle();
      return;
    }
    this.pos = nextPos;
  }

  getNextPosition(time = 1) {
    return new Vector(this.pos.x + this.speed.x * time, this.pos.y + this.speed.y * time);
  }

  handleObstacle() {
    if (this.speed.x > 0 || this.speed.y > 0) {
      this.speed.x = -this.speed.x;
      this.speed.y = -this.speed.y;
    } else {
      this.speed.x = Math.abs(this.speed.x);
      this.speed.y = Math.abs(this.speed.y);
    }
  }
}
/*checking code for class Fireball*/
// const time = 5;
// const speed = new Vector(1, 0);
// const position = new Vector(5, 5);

// const ball = new Fireball(position, speed);

// const nextPosition = ball.getNextPosition(time);
// console.log(`Новая позиция: ${nextPosition.x}: ${nextPosition.y}`);

// ball.handleObstacle();
// console.log(`Текущая скорость: ${ball.speed.x}: ${ball.speed.y}`);

class HorizontalFireball extends Fireball {
  constructor(location) {
    super(location, new Vector(2, 0));
  }
}

class VerticalFireball extends Fireball {
  constructor(location) {
    super(location, new Vector(0, 2));
  }
}
class FireRain extends Fireball {
  constructor(location) {
    super(location, new Vector(0, 3));
    this.start = location;
  }

  handleObstacle() {
    this.pos = this.start;
  }
}

/*
2. После этого вы уже сможете запустить игру.
  ```javascript
  const grid = [
    new Array(3),
    ['wall', 'wall', 'lava']
  ];
  const level = new Level(grid);
  runLevel(level, DOMDisplay);
  ```

  На экране отобразится схема уровня. Узнайте подробнее про функцию `runLevel` и класс `DOMDisplay` ниже.

3. Реализуйте `LevelParser`, что позволит вам описывать уровни с помощью текстовой схемы:
  ```javascript
  const schema = [
    '         ',
    '         ',
    '         ',
    '         ',
    '     !xxx',
    '         ',
    'xxx!     ',
    '         '
  ];
  const parser = new LevelParser();
  const level = parser.parse(schema);
  runLevel(level, DOMDisplay);
  ```
4. Реализуйте `Player`, поместите его символ на схему и добавьте словарь при создании парсера:
  ```javascript
  const schema = [
    '         ',
    '         ',
    '         ',
    '         ',
    '     !xxx',
    ' @       ',
    'xxx!     ',
    '         '
  ];
  const actorDict = {
    '@': Player
  }
  const parser = new LevelParser(actorDict);
  const level = parser.parse(schema);
  runLevel(level, DOMDisplay);
  ```
5. Реализуйте другие движущиеся объекты игрового поля и помещайте их символы на схему и в словарь парсера.
6. Реализуйте загрузку уровней с помощью функции `loadLevels` и запуск игры с помощью `runGame`.
7. Когда игрок пройдет все уровни, используйте функцию `alert`, чтобы сообщить о победе.
*/