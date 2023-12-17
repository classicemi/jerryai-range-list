/**
 *
 * Check if a range input is valid
 * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
 * @returns {Boolean} isValid - Array of two integers that specify beginning and end of range.
 */
export function validateRangeInput(range) {
  return (
    Array.isArray(range) &&
    range.length === 2 &&
    range.every((item) => Number.isInteger(item)) &&
    range[1] > range[0]
  )
}

/**
 *
 * Check if two ranges have an intersection
 * @param {Array<number>} newRange - Range to be compared with an existing range
 * @param {Array<number>} oldRange - An existing range to be compared with a new range
 * @returns {Boolean} hasIntersection - An existing range to be compared with a new range
 */
export function checkRangeIntersection(newRange, oldRange) {
  return (
    (newRange[0] >= oldRange[0] && newRange[0] <= oldRange[1]) ||
    (newRange[1] >= oldRange[0] && newRange[1] <= oldRange[1]) ||
    (newRange[0] < oldRange[0] && newRange[1] > oldRange[1])
  )
}

/**
 *
 * Merge two ranges and return the new range
 * @param {Array<number>} range1 - Range to be merged
 * @param {Array<number>} range2 - Range to be merged
 * @returns {Array<number>} newRange - Merged range
 */
export function mergeRanges(range1, range2) {
  if (!checkRangeIntersection(range1, range2)) {
    return []
  }
  return [Math.min(range1[0], range2[0]), Math.max(range1[1], range2[1])]
}

/**
 *
 * @param {Array<number>} newRange - Range to be used to subtract the old range
 * @param {Array<number>} oldRange - Range to be operating subtract
 * @returns {Array<number>} - Result range
 */
export function subtractRange(newRange, oldRange) {
  if (!checkRangeIntersection(newRange, oldRange)) {
    return [[...oldRange]]
  }

  // the old range will be split into two ranges
  if (oldRange[0] < newRange[0] && oldRange[1] > newRange[1]) {
    return [
      [oldRange[0], newRange[0]],
      [newRange[1], oldRange[1]],
    ]
  }

  // the old range will be removed
  if (newRange[0] <= oldRange[0] && newRange[1] >= oldRange[1]) {
    return []
  }

  // update the old range
  if (oldRange[0] >= newRange[0] && oldRange[0] < newRange[1]) {
    return [[newRange[1], oldRange[1]]]
  }
  return [[oldRange[0], newRange[0]]]
}

export default class RangeList {
  constructor() {
    // range array container
    this.ranges = []
  }

  /**
   *
   * Adds a range to a list
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  add(range) {
    if (!validateRangeInput(range)) {
      return
    }

    let insertIndex = []
    for (let i = 0; i < this.ranges.length; i++) {
      const merged = mergeRanges(range, this.ranges[i])
      if (merged.length) {
        this.ranges[i] = merged
        insertIndex.push(i)
      } else {
        // the current range was already inserted, break out of the loop
        if (insertIndex.length) {
          break
        } else if (range[1] < this.ranges[i][0]) {
          // the new range is just before the current range
          // so it should be inserted before the current range
          // then we break the loop
          this.ranges.splice(i, 0, range)
          insertIndex.push(i)
          i++
          break
        }
      }
    }

    if (!insertIndex.length) {
      this.ranges.push(range)
      return
    }

    // iterate `ranges` array to merge adjacent ranges if they can be merged
    if (insertIndex.length > 1) {
      this.ranges.splice(
        insertIndex[0],
        insertIndex.length,
        insertIndex.reduce((acc, cur) => {
          if (!acc.length) {
            return this.ranges[cur]
          }
          return mergeRanges(this.ranges[cur], acc)
        }, [])
      )
    }
  }

  /**
   *
   * Removes a range from the list
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  remove(range) {
    if (!validateRangeInput(range)) {
      return
    }

    for (let i = 0; i < this.ranges.length; i++) {
      if (checkRangeIntersection(range, this.ranges[i])) {
        const result = subtractRange(range, this.ranges[i])
        if (!result.length) {
          this.ranges[i] = []
        } else if (result.length === 1) {
          this.ranges[i] = result[0]
        } else {
          this.ranges.splice(i, 1, ...result)
          i++
        }
      }
    }
    this.ranges = this.ranges.filter((range) => !!range.length)
  }

  /**
   *
   * Convert the list of ranges in the range list to a string
   * @returns A string representation of the range list
   */
  toString() {
    return this.ranges.map((range) => `[${range[0]}, ${range[1]})`).join(' ')
  }
}
