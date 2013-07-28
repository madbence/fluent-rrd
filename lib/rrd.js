var spawn = require('child_process').spawn;
var util = require('./util.js');
var parseTime = util.parseTime;
var Graph = require('./graph.js');

/**
 * Creates an RRD object
 * @param {string} fileName
 */
function RRD(file) {
  this._file = file;
  this._dataSources = [];
  this._archives = [];
  this._step = 300;
}

/**
 * Set step (--step) to `step`, accepts number or string
 *
 * The string will be parsed like
 * `'1s' -> 1`
 * `'1min' -> 60`
 * @param  {mixed} step
 * @return {RRD}
 */
RRD.prototype.step = function(step) {
  this._step = typeof step == 'string' ? parseTime(step) : step;
  return this;
};

['gauge', 'counter', 'derive', 'absolute'].forEach(function(type) {
  RRD.prototype[type] = function(name, heartBeat, min, max) {
    this._dataSources.push({
      type: type.toUpperCase(),
      name: name,
      heartBeat: heartBeat || this._step * 5,
      min: min === undefined ? 'U' : min,
      max: max === undefined ? 'U' : max,
    });
    return this;
  }
});

['average', 'min', 'max', 'last'].forEach(function(cf) {
  function explicit(steps, rows, xff) {
    this._archives.push({
      cf: cf.toUpperCase(),
      steps: steps,
      rows: rows,
      xff: xff === undefined ? 0.5 : xff
    });
  }
  function smart(opt) {
    this._archives.push({
      cf: cf.toUpperCase(),
      steps: parseTime(opt.resolution) / this._step,
      rows: parseTime(opt.for) / parseTime(opt.resolution),
      xff: opt.xff === undefined ? 0.5 : opt.xff
    });
  }
  RRD.prototype[cf] = function() {
    if(arguments.length == 1) {
      smart.apply(this, arguments);
    } else {
      explicit.apply(this, arguments);
    }
    return this;
  }
});

[{
  name: 'minutely',
  interval: 60
}, {
  name: 'hourly',
  interval: 60*60
}, {
  name: 'daily',
  interval: 60*60*24
}, {
  name: 'weekly',
  interval: 60*60*24*7
}, {
  name: 'monthly',
  interval: 60*60*24*30
}, {
  name: 'yearly',
  interval: 60*60*24*365
}].forEach(function(interval) {
  RRD.prototype[interval.name] = function(cf, rows) {
    return this[cf](interval.interval / this._step, rows);
  };
});

RRD.prototype.create = function(opt, cb) {
  if(typeof opt == 'function') {
    cb = opt;
  }
  var ds = this._dataSources.map(function(ds) {
    return 'DS:' + ['name', 'type', 'heartBeat', 'min', 'max'].map(function(prop) {
      return ds[prop];
    }).join(':');
  });
  var rra = this._archives.map(function(rra) {
    return 'RRA:' + ['cf', 'xff', 'steps', 'rows'].map(function(prop) {
      return rra[prop];
    }).join(':');
  })
  var params = [
    'create', this._file,
    '--step', this._step]
    .concat(ds, rra);

  var rrd = spawn('rrdtool', params);
  rrd.on('exit', function(status, sig) {
    if(status || sig) {
      return cb && cb({
        status: status, sig: sig
      });
    }
    cb();
  });
  return this;
}

RRD.prototype.update = function(spec, cb) {
  var rrd = spawn('rrdtool',
    ['update', this._file]
    .concat(
      ['N:' + spec.join(':')]));
  rrd.on('exit', function(status, sig) {
    if(status || sig) {
      return cb && cb({
        status: status, sig: sig
      }, params);
    }
    cb(null);
  })
}

RRD.prototype.graph = function() {
  return new Graph(this);
}

module.exports = RRD;
