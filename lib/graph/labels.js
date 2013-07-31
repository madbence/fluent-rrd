module.exports.title = function(title) {
  return this.addParam('--title', title);
};

module.exports.vlabel = function(label) {
  return this.addParam('--vertical-label', label);
};
