'use strict';
class Vector {
	constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }
  plus(vector) {
    if (!(vector instanceof Vector)) {
      throw new Error('Можно прибавлять к вектору только вектор типа Vector!');
    } else {
      return new Vector(this.x + vector.x, this.y + vector.y);
    }
  }
  times (multiplier) {
    return new Vector(this.x * multiplier, this.y * multiplier);
  }
}

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
    return 'actor';
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
    if (grid[y] && grid[y][x] && ((grid[y][x] === wall) || (grid[y][x] === lava))) {
      return true;
    } else {
      return false;
    }
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

class Fireball extends Actor {
  constructor(location = new Vector(), speed = new Vector()) {
    super(location, undefined, speed);
  }
  get type() {
    return 'fireball';
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
    let fireballVector = new Vector();
    fireballVector = this.pos.plus(this.speed.times(time));
    return fireballVector;
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
class Coin extends Actor {
  constructor(location = new Vector()) {
    super(location, new Vector(0.6, 0.6));
    this.pos.x += 0.2;
    this.pos.y += 0.1;
    this.location = location;
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring = Math.random() * (Math.PI * 2);
  }
  get type() {
    return 'coin';
  }
  updateSpring(time = 1) {
    this.spring += this.springSpeed * time;
  }

  getSpringVector() {
    return new Vector(0, Math.sin(this.spring) * this.springDist);
  }

  getNextPosition(time = 1) {
    this.updateSpring(time);
    let sprVector = new Vector();
    sprVector = this.getSpringVector();
    return this.location.plus(sprVector);
  }

  act(time) {
    const next = this.getNextPosition(time);
    this.pos = next;
  }
}

class Player extends Actor {
  constructor(location) {
    super(location, new Vector(0.8, 1.5));
    this.pos.y -= 0.5;
  }
  get type() {
    return 'player';
  }
}

const actorDict = {
 '@': Player,
 '=':HorizontalFireball,
 'o':Coin,
 '|':VerticalFireball
  };
  const parser = new LevelParser(actorDict);
  loadLevels()
  .then(schemas => runGame(JSON.parse(schemas), parser, DOMDisplay))
  .then(function(){
    document.body.innerHTML = '<h1 style=\"color:red\">Вы выиграли приз!</h1>';
  })
  .catch(err => console.log(err));