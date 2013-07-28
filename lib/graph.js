var util = require('./util.js');
var parseTime = util.parseTime;
var legend = util.legend;
var spawn = require('child_process').spawn;

function Graph(rrd) {
  this._rrd = rrd;
  this._lines = [];
  this._cdefs = [];
}

Graph.prototype.start = Graph.prototype.from = function(time) {
  this._start = time;
  this._interval = parseTime(time);
  return this;
}
Graph.prototype.end = Graph.prototype.to = function(time) {
  this._end = time;
  return this;
}
Graph.prototype.smooth = function(name, factor) {
  var self = this;
  factor = typeof factor == 'string' ? parseTime(factor) : factor;
  return {
    as: function(newName) {
      self._cdefs.push('CDEF:'+ newName + '=' + name + ',' + factor + ',TREND');
      return self;
    }
  };
}
Graph.prototype.table = function() {
  this._drawTable = true;
  return this;
}

Graph.prototype.title = function(title) {
  this._title = title;
  return this;
}
Graph.prototype.line = function(name, color) {
  this._lines.push('LINE:' + name + color + ':' + legend(name));
  return this;
}
Graph.prototype.slope = function(slope) {
  this._slope = slope === undefined ? true : slope;
  return this;
}
Graph.prototype.watermark = function(str) {
  this._watermark = str;
  return this;
}
Graph.prototype.vlabel = function(str) {
  this._vlabel = str;
  return this;
}
Graph.prototype.create = function(file) {
  var defs = this._rrd._dataSources.map(function(ds) {
    return 'DEF:' + ds.name + '=' + this._rrd._file + ':' + ds.name + ':AVERAGE';
  }, this);
  var cdefs = this._cdefs.map(function(cdef) {
    return cdef;
  });
  console.log(defs);
  var params = [
    'graph', file,
    '--start', this._start];
  this._slope && params.push('--slope-mode');
  if(this._watermark) {
    params.push('--watermark');
    params.push(this._watermark);
  }
  if(this._title) {
    params.push('--title');
    params.push(this._title);
  }
  if(this._vlabel) {
    params.push('--vertical-label');
    params.push(this._vlabel);
  }
  var lines = this._lines;
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
    }, [])
  }
  params = params
    .concat(defs)
    .concat(cdefs)
    .concat(lines)
  var rrd = spawn('rrdtool', params);
  console.log(params);
  rrd.stderr.pipe(process.stderr);
}

module.exports = Graph;
