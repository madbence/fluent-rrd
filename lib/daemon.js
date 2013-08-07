var net = require('net');
var spawn = require('child_process').spawn;

function Daemon(opt, rrd) {
  this._args = [];
}

Daemon.prototype.addParam = function() {
  this._args.push.apply(this._args, [].slice.call(arguments, 0));
  return this;
}

Daemon.prototype.listen = function(port, host) {
  port = port || 42217;
  host = host || '127.0.0.1';
  if(typeof port === 'string') {
    return this.addParam('-l', port); //listen on unix sock
  }
  return this.addParam('-l', host + ':' + port);
}

Daemon.prototype.allow = Daemon.prototype.permit = function(commands) {
  return this.addParam('-P', commands.map(function(command) {
    return command.toUpperCase();
  }).join(','));
}

Daemon.prototype.threads = function(threads) {
  return this.addParam('-t', threads);
}

Daemon.prototype.interval = function(interval) {
  return this.addParam('-w', interval);
}

Daemon.prototype.start = function(port, host) {
  this._daemonProcess = spawn('rrdcached', this._args);
  this._daemonProcess.stdout.pipe(process.stdout);
  this._daemonProcess.stderr.pipe(process.stdout);
  setTimeout(function() {
    this.connect(port, host);
  }.bind(this), 500);
  return this;
}

Daemon.prototype.connect = function(port, host, fn) {
  if(typeof port === 'string') {
    this._client = net.connect(port, fn);
    return this;
  }
  if(port === undefined && host === undefined) {
    var listen = this._args[this._args.indexOf('-l') + 1].split(':');
    port = listen[1] || 42217;
    host = listen[0];
  }
  this._client = net.connect(port, host, fn);
  this._client.on('data', function(data) {
    console.log(data, data.toString());
  });
  return this;
}

Daemon.prototype.update = function(file, values, time) {
  time = time || (new Date().getTime()/1000).toFixed(0);
  var cmd =
    'UPDATE ' + file +
    ' ' + [time].concat(values).join(':') +
    '\n';
  console.log(cmd);
  this._client.write(cmd);
}

module.exports = Daemon;
