<<<<<<< HEAD
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
      throw new Error('Можно прибавлять к вектору только вектор типа Vector');
  }
  times (multiplier) {
    const newVector = new Vector();
    newVector.x = this.x * multiplier;
    newVector.y = this.y * multiplier;
    return newVector;
  }
}
/*checking code in console for the 1st class*/
const start = new Vector(30, 50);
const moveTo = new Vector(5, 10);
const finish = start.plus(moveTo.times(2));
console.log(`Исходное расположение: ${start.x}:${start.y}`);
console.log(`Текущее расположение: ${finish.x}:${finish.y}`);

class Actor {
  constructor(pos = new Vector(), size = new Vector(1, 1), speed = new Vector()) {
    if (!(pos instanceof Vector) ||
        !(size instanceof Vector) ||
        !(speed instanceof Vector)) {
          throw Error('arguments error');
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
          throw Error('arguments error');
    }

    if (actor === this || actor.size.x < 0 || actor.size.y < 0) {
          return false;
      }

  return !(actor.left >= this.right || actor.right <= this.left || actor.top >= this.bottom || actor.bottom <= this.top);
  }
}
/*checking code in console for the 2nd class*/
const items = new Map();
const player = new Actor();
items.set('Игрок', player);
items.set('Первая монета', new Actor(new Vector(10, 10)));
items.set('Вторая монета', new Actor(new Vector(15, 5)));

function position(item) {
  return ['left', 'top', 'right', 'bottom']
    .map(side => `${side}: ${item[side]}`)
    .join(', ');  
}

function movePlayer(x, y) {
  player.pos = player.pos.plus(new Vector(x, y));
}

function status(item, title) {
  console.log(`${title}: ${position(item)}`);
  if (player.isIntersect(item)) {
    console.log(`Игрок подобрал ${title}`);
  }
}

items.forEach(status);
movePlayer(10, 10);
items.forEach(status);
movePlayer(5, -5);
items.forEach(status);
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
=======
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
       throw new Error('Можно прибавлять к вектору только вектор типа Vector');
  }
  times (multiplier) {
    const newVector = new Vector();
    newVector.x = this.x * multiplier;
    newVector.y = this.y * multiplier;
    return newVector;
  }
}
const start = new Vector(30, 50);
const moveTo = new Vector(5, 10);
const finish = start.plus(moveTo.times(2));
console.log(`Исходное расположение: ${start.x}:${start.y}`);
console.log(`Текущее расположение: ${finish.x}:${finish.y}`);
class Actor {
  constructor(pos = new Vector(), size = new Vector(1, 1), speed = new Vector()) {
    if (!(pos instanceof Vector) ||
        !(size instanceof Vector) ||
        !(speed instanceof Vector)) {
          throw Error('arguments error');
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
          throw Error('arguments error');
    }

    if (actor === this || actor.size.x < 0 || actor.size.y < 0) {
          return false;
      }

  return !(actor.left >= this.right || actor.right <= this.left || actor.top >= this.bottom || actor.bottom <= this.top);
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
>>>>>>> 7740d3dd681edf7c1c6ea5910d7c213e3f51e4a8
*/