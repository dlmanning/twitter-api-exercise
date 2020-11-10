const VALUE = 0;
const COUNT = 1;

/**
 * Quick and dirty storage class that maintains a ordered set of items with
 * random insertion. O(1) reads with O(n) or better writes.
 */

module.exports = class TopList {
  constructor() {
    this._list = []
  }

  /**
   * 
   * @param {any} newValue - A value to add to the list
   */
  add(newValue) {
    const list = this._list;
    // Insertion will be worst case O(N), but should amortorize lower since
    // more common values will naturally bubble to the beginning of the list
    let idx = list.findIndex(([value, _]) => {
      return value === newValue;
    });

    if (idx < 0) {
      list.push([newValue, 1]);
      return;
    }

    list[idx][COUNT] += 1;

    while (idx > 0) {
      if (list[idx][COUNT] > list[idx - 1][COUNT]) {
        const temp = list[idx - 1];
        list[idx - 1] = list[idx];
        list[idx] = temp;

        idx -= 1;
      } else {
        break;
      }
    }
  }

  getTop(n) {
    const result = [];
    for (let i = 0; i < n && i < this._list.length; i++) {
      result.push(this._list[i][VALUE]);
    }

    return result;
  }
}