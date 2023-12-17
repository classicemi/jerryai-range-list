# RangeList

A Simple JavaScript range list tool.

## Installation

```shell
$ npm install
```

## Usage

```js
const rl = new RangeList();
rl.toString(); // Should be ""
rl.add([1, 5]);
rl.toString(); // Should be: "[1, 5)"
rl.add([10, 20]);
rl.toString(); // Should be: "[1, 5) [10, 20)"
rl.add([20, 20]);
rl.toString(); // Should be: "[1, 5) [10, 20)"
rl.add([20, 21]);
rl.toString(); // Should be: "[1, 5) [10, 21)"
rl.add([2, 4]);
rl.toString(); // Should be: "[1, 5) [10, 21)"
rl.add([3, 8]);
rl.toString(); // Should be: "[1, 8) [10, 21)"
rl.remove([10, 10]);
rl.toString(); // Should be: "[1, 8) [10, 21)"
rl.remove([10, 11]);
rl.toString(); // Should be: "[1, 8) [11, 21)"
rl.remove([15, 17]);
rl.toString(); // Should be: "[1, 8) [11, 15) [17, 21)"
rl.remove([3, 19]);
rl.toString(); // Should be: "[1, 3) [19, 21)"
```

## Tests

The test is built on testing suite `Jest`.

```shell
$ npm test
```

You can check the code coverage by adding coverage parameter:

```shell
$ npm test -- --coverage
```
