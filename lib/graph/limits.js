module.exports.min =
module.exports.lower =
module.exports.lowerLimit = function(limit, rigid) {
  return rigid && this.rigid(), this.addParam('--lower-limit', limit);
};

module.exports.max =
module.exports.upper =
module.exports.upperLimit = function(limit, rigid) {
  return rigid && this.rigid(), this.addParam('--upper-limit', limit);
};

module.exports.altAutoscale = function(limit) {
  if(limit.toLowerCase() == 'min') {
    return this.addParam('--alt-autoscale-min');
  } else if(limit.toLowerCase() == 'max') {
    return this.addParam('--alt-autoscale-max');
  }
  return this.addParam('--alt-autoscale');
};

module.exports.noGridFit = function() {
  return this.addParam('--no-gridfit');
};

module.exports.gridFit = function(gridFit) {
  if(gridFit === false) {
    this.addParam('--no-gridfit');
  }
  return this;
};
