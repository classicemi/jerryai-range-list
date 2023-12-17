import RangeList, {
  validateRangeInput,
  checkRangeIntersection,
  mergeRanges,
  subtractRange,
} from '../src/rangeList'

const invalidRanges = [
  undefined,
  1,
  '1',
  [1],
  [10, 10],
  [1, 5, 10],
  [5, 1],
  ['1', '5'],
  [1, '5'],
  ['1', 5],
]

describe('utils', () => {
  test('`validateRangeInput` validates the range input', () => {
    invalidRanges.forEach(input => {
      expect(validateRangeInput(input)).toBe(false)
    })
    expect(validateRangeInput([1, 5])).toBe(true)
  })

  test('`checkRangeIntersection` checks if two ranges have an intersection', () => {
    expect(checkRangeIntersection([1, 10], [11, 20])).toBe(false)
    expect(checkRangeIntersection([1, 5], [10, 20])).toBe(false)
    expect(checkRangeIntersection([1, 11], [11, 20])).toBe(true)
    expect(checkRangeIntersection([1, 11], [5, 20])).toBe(true)
    expect(checkRangeIntersection([1, 20], [5, 20])).toBe(true)
    expect(checkRangeIntersection([1, 20], [1, 40])).toBe(true)
    expect(checkRangeIntersection([5, 10], [1, 40])).toBe(true)
    expect(checkRangeIntersection([1, 20], [5, 10])).toBe(true)
  })

  test('`mergeRanges` merges two ranges and returns the new range', () => {
    expect(mergeRanges([1, 5], [5, 10])).toEqual([1, 10])
    expect(mergeRanges([1, 6], [4, 10])).toEqual([1, 10])
    expect(mergeRanges([2, 6], [1, 10])).toEqual([1, 10])
    expect(mergeRanges([1, 10], [2, 6])).toEqual([1, 10])
    expect(mergeRanges([1, 5], [6, 10])).toEqual([])
  })

  test('`subtractRange` operates subtraction on the old range', () => {
    expect(subtractRange([1, 2], [5, 10])).toEqual([[5, 10]])
    expect(subtractRange([1, 6], [5, 10])).toEqual([[6, 10]])
    expect(subtractRange([5, 10], [1, 6])).toEqual([[1, 5]])
    expect(subtractRange([1, 10], [5, 6])).toEqual([])
    expect(subtractRange([5, 6], [1, 10])).toEqual([[1, 5], [6, 10]])
  })
})

describe('range list', () => {
  let rl
  beforeEach(function () {
    rl = new RangeList()
  })

  test('should have `ranges` property', () => {
    expect(rl).toHaveProperty('ranges', [])
  })

  test('ignores invalid adding ranges', () => {
    invalidRanges.forEach(input => {
      rl.add(input)
      expect(rl.toString()).toBe('')
    })
  })

  test('adds valid separate ranges', () => {
    rl.add([1, 5])
    expect(rl.toString()).toBe('[1, 5)')
    rl.add([11, 15])
    expect(rl.toString()).toBe('[1, 5) [11, 15)')
  })

  test('merges ranges which have intersections', () => {
    rl.add([5, 10])
    rl.add([8, 15])
    expect(rl.toString()).toBe('[5, 15)')
    rl.add([1, 10])
    expect(rl.toString()).toBe('[1, 15)')
    rl.add([7, 10])
    expect(rl.toString()).toBe('[1, 15)')
    rl.add([0, 20])
    expect(rl.toString()).toBe('[0, 20)')
    rl.add([25, 30])
    expect(rl.toString()).toBe('[0, 20) [25, 30)')
    rl.add([10, 28])
    expect(rl.toString()).toBe('[0, 30)')
  })

  test('merges multiple ranges if they can be merged', () => {
    rl.add([1, 5])
    rl.add([20, 25])
    rl.add([10, 15])
    rl.add([5, 30])
    expect(rl.toString()).toBe('[1, 30)')
  })

  test('can subtract ranges from existing ranges', () => {
    rl.add([1, 10])
    rl.remove([0, 5])
    expect(rl.toString()).toBe('[5, 10)')
    rl.remove([8, 12])
    expect(rl.toString()).toBe('[5, 8)')
    rl.remove([1, 10])
    expect(rl.toString()).toBe('')
    rl.add([1, 10])
    rl.remove([5, 6])
    expect(rl.toString()).toBe('[1, 5) [6, 10)')
    rl.remove([3, 8])
    expect(rl.toString()).toBe('[1, 3) [8, 10)')
  })
})

describe('example', () => {
  const rl = new RangeList()
  expect(rl.toString()).toBe('')
  rl.add([1, 5])
  expect(rl.toString()).toBe('[1, 5)')
  rl.add([10, 20])
  expect(rl.toString()).toBe('[1, 5) [10, 20)')
  rl.add([20, 20])
  expect(rl.toString()).toBe('[1, 5) [10, 20)')
  rl.add([20, 21])
  expect(rl.toString()).toBe('[1, 5) [10, 21)')
  rl.add([2, 4])
  expect(rl.toString()).toBe('[1, 5) [10, 21)')
  rl.add([3, 8])
  expect(rl.toString()).toBe('[1, 8) [10, 21)')
  rl.remove([10, 10])
  expect(rl.toString()).toBe('[1, 8) [10, 21)')
  rl.remove([10, 11])
  expect(rl.toString()).toBe('[1, 8) [11, 21)')
  rl.remove([15, 17])
  expect(rl.toString()).toBe('[1, 8) [11, 15) [17, 21)')
  rl.remove([3, 19])
  expect(rl.toString()).toBe('[1, 3) [19, 21)')
})
