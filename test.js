var RRD = require('./index.js');

var rrd = new RRD('foo')
  .step(1)
  .gauge('bar')
  .gauge('foo')
  .average({
    resolution: '5s',
    for: '1h'
  })
  .create(function(err) {
    if(err) console.log(err);
    else console.log('Success!');
  });
