const SIZE = 2;
var cache = new Array(SIZE);
var items = 0;

function pushPage(host, data, request) {
  //console.log(cache);
  if (items > SIZE - 1) {
    cache.shift();
    items--;
  }
  cache.push({host:host, data:data, request:request});
  // console.log(cache);
  items++;
}

function search(host) {
  var i = 0;
  while (i < cache.length) {
    if (cache[i] !== undefined && cache[i].host === host) {
      return cache[i].data;
    }
    i++;
  }
  return -1;
}

function moveItemToHead() {

}

module.exports.cache = cache;
module.exports.pushPage = pushPage;
module.exports.moveItemToHead = moveItemToHead;
module.exports.search = search;
