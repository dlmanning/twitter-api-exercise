const tap = require('tap');
const TopList = require('../toplist');

tap.test('TopList - Basic', t => {
  const toplist = new TopList();

  toplist.add('a');
  toplist.add('b');
  toplist.add('c');

  t.deepEqual(toplist.getTop(3), ['a', 'b', 'c']);

  toplist.add('c');

  t.deepEqual(toplist.getTop(3), ['c', 'a', 'b']);

  toplist.add('b');
  toplist.add('a');
  toplist.add('b');
  toplist.add('d');

  t.deepEqual(toplist.getTop(4), ['b', 'c', 'a', 'd']);

  t.end();
});