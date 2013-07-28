var spawn = require('child_process').spawn;

function RRD(file) {
  this._file = file;
  this._dataSources = [];
  this._archives = [];
  this._step = 300;
}

function parseTime(str) {
  var m = str.match(/^-?(\d+)(\w+)$/);
  var base;
  switch(m[2]){
    case 's':
    case 'second':
    case 'seconds':
      base = 1; break;
    case 'm':
    case 'min':
    case 'minute':
    case 'minutes':
      base = 60; break;
    case 'h':
    case 'hour':
    case 'hours':
      base = 60*60; break;
    case 'd':
    case 'day':
    case 'days':
      base = 60*60*24; break;
    case 'w':
    case 'week':
    case 'weeks':
      base = 60*60*24*7; break;
    case 'mon':
    case 'month':
    case 'months':
      base = 60*60*24*30; break;
    case 'y':
    case 'year':
    case 'years':
      base = 60*60*24*365; break;
    default:
      throw new Error('Unknown time format `' + m[2] + '`');
  }
  return parseInt(m[1])*base;
}

function legend(str) {
  if(str.length > 10) {
    return str.substr(0, 10);
  }
  while(str.length < 10) {
    str += ' ';
  }
  return str;
}

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
    cb(null, params);
  })
}

RRD.prototype.graph = function() {
  return new Graph(this);
}

function Graph(rrd) {
  this._rrd = rrd;
  this.lines = [];
  this.cdefs = [];
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
  return {
    as: function(newName) {
      self.cdefs.push('CDEF:'+ newName + '=' + name + ',' + factor + ',TREND');
      return self;
    }
  };
}

Graph.prototype.title = function(title) {
  this._title = title;
  return this;
}
Graph.prototype.line = function(name, color) {
  this.lines.push('LINE:' + name + color);
  return this;
}
Graph.prototype.create = function(file) {
  var defs = this._rrd._dataSources.map(function(ds) {
    return 'DEF:' + ds.name + '=' + this._rrd._file + ':' + ds.name + ':AVERAGE';
  }, this);
  var cdefs = this.cdefs.map(function(cdef) {
    return cdef;
  });
  console.log(defs);
  var rrd = spawn('rrdtool',
    ['graph', file,
    '--start', this._start]
    .concat(defs)
    .concat(this.cdefs)
    .concat(this.lines));
}

module.exports = RRD;
