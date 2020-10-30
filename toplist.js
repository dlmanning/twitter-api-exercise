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
    // Insertion will be worst case O(N), but should amortorize lower since
    // more common values will naturally bubble to the beginning of the list
    const idx = this._list.findIndex(([value, _]) => {
      return value === newValue;
    });

    if (idx < 0) {
      this._list.push([newValue, 1]);
      return;
    }

    this._list[idx][COUNT] += 1;

    if (idx > 0) { // might need to swap elements now to maintain sort
      bubble(this._list, idx);
    }

    // bubble entries forward in the list until their count is not greater than
    // their predeccessor
    function bubble(list, idx) {
      if (list[idx][COUNT] > list[idx - 1][COUNT]) {
        const temp = list[idx - 1];
        list[idx - 1] = list[idx];
        list[idx] = temp;

        if (idx > 1) {
          bubble(list, idx - 1);
        }
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