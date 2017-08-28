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
    try {
      if (vector instanceof Vector) {
        const newObject = new Vector();
        newObject.x = this.x + vector.x;
        newObject.y = this.y + vector.y; 
        return newObject;
      } else throw new Error('Можно прибавлять к вектору только вектор типа Vector');
    }
    catch (error) {
      throw error;
    }
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

// class Actor {
//   constructor (coords={x:0,y:0}, objSize={height:1, width:1}, objSpeed={x:0,y:0}) {
//     try {  
//       if (coords !instanceof Vector || objSize !instanceof Vector || objSpeed !instanceof Vector) {
//         throw new Error('Аргументы должны быть типа Vector');
//       }
//     } catch (e) {
//         throw e;
//     }
//   }
//   get pos (vector) {
//     this.x = coords.x;
//     this.y = coords.y;
//   }
//   get size (vector) {
//     this.height = vector.height;
//     this.width = vector.width;
//   }
//   get speed (vector) {
//     this.x += vector.x;
//     this.y += vector.y;
//   }
//   act () {}
//   set left () {

//   }
//   set right () {

//   }
//   set top () {

//   }
//   set bottom () {

//   }
//   set type () {
//    return 'actor'; 
//   }
// }
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