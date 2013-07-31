module.exports.color = function(tag, color) {
  return this.addParam('--color', tag.toUpperCase() + color);
};

module.exports.dash = module.exports.gridDash = function(on, off) {
  return this.addParam('--grid-dash', on + ':' + off);
};

module.exports.border = function(width, shadea, shadeb) {
  if(shadea) { this.color('shadea', shadea); }
  if(shadeb) { this.color('shadeb', shadeb); }
  return this.addParam('--border', width);
};

module.exports.zoom = function(zoom) {
  return this.addParam('--zoom', zoom);
};

module.exports.font = function(tag, size, font) {
  return this.addParam('--font', [tag, size, font].join(':'));
};

module.exports.fontSize = function(size) {
  return this.font('DEFAULT', size, '');
};

module.exports.slope = function() {
  return this.addParam('--slope-mode');
};

module.exports.interlaced = function() {
  return this.addParam('--interlaced');
};

module.exports.tabWidth = function(width) {
  return this.addParam('--tabwidth', width);
};

module.exports.base = function(base) {
  return this.addParam('--base', base);
};

module.exports.watermark = function(watermark) {
  return this.addParam('--watermark', watermark);
};
