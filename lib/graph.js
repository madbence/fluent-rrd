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

['time', 'labels', 'size', 'limits', 'misc'].forEach(function(file) {
  var funs = require('./graph/' + file);
  Object.keys(funs).forEach(function(key) {
    Graph.prototype[key] = funs[key];
  });
});

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

Graph.prototype.line = function(name, color) {
  this._lines.push('LINE:' + name + color + ':' + legend(name));
  return this;
};


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
