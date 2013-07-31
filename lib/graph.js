var util = require('./util.js');
var parseTime = util.parseTime;
var legend = util.legend;
var spawn = require('child_process').spawn;

function Graph(rrd) {
  this._rrd = rrd;
  this._params = [];
  this._lines = [];
  this._cdefs = [];
}

Graph.prototype.start = Graph.prototype.from = function(time) {
  this._interval = parseTime(time);
  return this.addParam('--start', time);
};

Graph.prototype.end = Graph.prototype.to = function(time) {
  return this.addParam('--end', time);
};

Graph.prototype.smooth = function(name, factor) {
  var self = this;
  factor = typeof factor == 'string' ? parseTime(factor) : factor;
  return {
    as: function(newName) {
      self._cdefs.push('CDEF:'+ newName + '=' + name + ',' + factor + ',TREND');
      return self;
    }
  };
};

Graph.prototype.table = function() {
  this._drawTable = true;
  return this;
};

Graph.prototype.title = function(title) {
  return this.addParam('--title', title);
};

Graph.prototype.line = function(name, color) {
  this._lines.push('LINE:' + name + color + ':' + legend(name));
  return this;
};

Graph.prototype.slope = function() {
  return this.addParam('--slope-mode');
};

Graph.prototype.watermark = function(watermark) {
  return this.addParam('--watermark', watermark);
};

Graph.prototype.vlabel = function(label) {
  return this.addParam('--vertical-label', label);
};

Graph.prototype.font = function(tag, size, font) {
  return this.addParam('--font', [tag, size, font].join(':'));
};

Graph.prototype.fontSize = function(size) {
  return this.font('DEFAULT', size, '');
};

Graph.prototype.size = function(width, height) {
  return this.width(width), this.height(height);
};

Graph.prototype.fullSize = function(width, height) {
  if(width && height) {
    this.size(width, height);
  }
  return this.addParam('--full-size-mode');
};

Graph.prototype.base = function(base) {
  return this.addParam('--base', base);
};

Graph.prototype.interlaced = function() {
  return this.addParam('--interlaced');
};

Graph.prototype.zoom = function(zoom) {
  return this.addParam('--zoom', zoom);
};

Graph.prototype.color = function(tag, color) {
  return this.addParam('--color', tag.toUpperCase() + color);
};

Graph.prototype.border = function(width, shadea, shadeb) {
  if(shadea) { this.color('shadea', shadea); }
  if(shadeb) { this.color('shadeb', shadeb); }
  return this.addParam('--border', width);
}

Graph.prototype.dash = Graph.prototype.gridDash = function(on, off) {
  return this.addParam('--grid-dash', on + ':' + off);
}

Graph.prototype.tabWidth = function(width) {
  return this.addParam('--tabwidth', width);
};

Graph.prototype.width = function(width) {
  return this.addParam('--width', width);
};

Graph.prototype.height = function(height) {
  return this.addParam('--height', height);
};

Graph.prototype.thumbnail = function(width, height) {
  width = width || 256;
  height = height || 32;
  return this.size(width, height), this.addParam('--only-graph');
};

Graph.prototype.min =
Graph.prototype.lower =
Graph.prototype.lowerLimit = function(limit, rigid) {
  return rigid && this.rigid(), this.addParam('--lower-limit', limit);
}

Graph.prototype.max =
Graph.prototype.upper =
Graph.prototype.upperLimit = function(limit, rigid) {
  return rigid && this.rigid(), this.addParam('--upper-limit', limit);
}

Graph.prototype.altAutoscale = function(limit) {
  if(limit.toLowerCase() == 'min') {
    return this.addParam('--alt-autoscale-min');
  } else if(limit.toLowerCase() == 'max') {
    return this.addParam('--alt-autoscale-max');
  }
  return this.addParam('--alt-autoscale');
}

Graph.prototype.noGridFit = function() {
  return this.addParam('--no-gridfit');
}

Graph.prototype.gridFit = function(gridFit) {
  if(gridFit === false) {
    this.addParam('--no-gridfit');
  }
  return this;
}

Graph.prototype.addParam = function() {
  this._params = this._params.concat([].slice.call(arguments, 0));
  return this;
};

Graph.prototype.create = function(file) {
  var defs = this._rrd._dataSources.map(function(ds) {
    return 'DEF:' + ds.name + '=' + this._rrd._file + ':' + ds.name + ':AVERAGE';
  }, this);
  var cdefs = this._cdefs.map(function(cdef) {
    return cdef;
  });
  console.log(defs);
  var lines = this._lines;
  var params = ['graph', file].concat(this._params);
  if(this._drawTable) {
    params.push('COMMENT:           ');
    params.push('COMMENT:        Cur');
    params.push('COMMENT:        Avg');
    params.push('COMMENT:        Max');
    params.push('COMMENT:        Min\\l');
    lines = lines.reduce(function(lines, line) {
      console.log(line);
      var df = line.match(/^.*:(.*?)#/)[1];
      cdefs.push('VDEF:' + df + '_cur=' + df +',LAST');
      cdefs.push('VDEF:' + df + '_avg=' + df +',AVERAGE');
      cdefs.push('VDEF:' + df + '_max=' + df +',MAXIMUM');
      cdefs.push('VDEF:' + df + '_min=' + df +',MINIMUM');
      lines.push(line);
      lines.push('GPRINT:' + df + '_cur:%7.2lf%Sbps');
      lines.push('GPRINT:' + df + '_avg:%10.2lf%S');
      lines.push('GPRINT:' + df + '_max:%10.2lf%S');
      lines.push('GPRINT:' + df + '_min:%10.2lf%S\\l');
      return lines;
    }, []);
  }
  params = params
    .concat(defs)
    .concat(cdefs)
    .concat(lines);
  var rrd = spawn('rrdtool', params);
  console.log(params);
  rrd.stderr.pipe(process.stderr);
};

module.exports = Graph;
