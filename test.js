var RRD = require('./index.js');

var rrd = new RRD('foo')
  .step('1s')
  .gauge('bar')
  .gauge('foo')
  .average({
    resolution: '1s',
    for: '1h'
  })
  .average({
    resolution: '5s',
    for: '5h'
  })
  /*.create(function(err) {
    if(err) console.log(err);
    else console.log('Success!');
  });*/

var i = 0;
setInterval(function() {
  var i = (new Date().getTime()/1000).toFixed(0)
  rrd.update(
    [(Math.sin(i*Math.PI/180)+1)*5000,
    Math.random()*10000], function(err) {
      if(err) console.log(err);
      else console.log('Updated!');
    });
}, 1000);

rrd.graph()
  .from('-10m')
  .smooth('foo', '1m')
    .as('foo_smooth')
  .smooth('bar', '2m')
    .as('bar_smooth')
  .line('foo', '#ff000044')
  .line('bar', '#00ff0044')
  .line('foo_smooth', '#ff0000')
  .line('bar_smooth', '#00ff00')
  .table()
  .create('file.png');
