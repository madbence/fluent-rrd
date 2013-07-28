var RRD = require('./index.js');

var rrd = new RRD('foo')
  .step(1)
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
  rrd.update(
    [(Math.sin(i*Math.PI/180)+1)*50,
    (Math.cos(i*Math.PI/180*2)+1)*40], function(err) {
      if(err) console.log(err);
      else console.log('Updated!');
    });
  i++;
}, 1000);

rrd.graph()
  .from('-10m')
  .smooth('foo', 100)
    .as('foo_smooth')
  .line('foo', '#ff0000')
  .line('bar', '#00ff00')
  .line('foo_smooth', '#ff000066')
  .create('file.png');
