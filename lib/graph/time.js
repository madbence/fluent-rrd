var parseTime = require('../util').parseTime;

module.exports.start =
module.exports.from = function(time) {
  this._interval = parseTime(time);
  return this.addParam('--start', time);
};

module.exports.end =
module.exports.to = function(time) {
  return this.addParam('--end', time);
};

module.exports.step = function(step) {
  step = typeof step == 'string' ?
    parseTime(step) : step;
  return this.addParam('--step', step);
}
