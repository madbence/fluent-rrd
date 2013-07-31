module.exports.width = function(width) {
  return this.addParam('--width', width);
};

module.exports.height = function(height) {
  return this.addParam('--height', height);
};

module.exports.size = function(width, height) {
  return this.width(width), this.height(height);
};

module.exports.fullSize = function(width, height) {
  if(width && height) {
    this.size(width, height);
  }
  return this.addParam('--full-size-mode');
};

module.exports.thumbnail = function(width, height) {
  width = width || 256;
  height = height || 32;
  return this.size(width, height), this.addParam('--only-graph');
};
