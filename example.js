var RRD = require('./index.js').RRD;

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
  });
  /*.create(function(err) {
    if(err) console.log(err);
    else console.log('Success!');
  });*/

var i = 0;
setInterval(function() {
  var i = (new Date().getTime()/1000).toFixed(0);
  rrd.update(
    [(Math.sin(i*Math.PI/180)+1)*5000,
    Math.max(5000, (i*50)%10000)], function(err) {
      if(err) console.log(err);
      else console.log('Updated!');
    });
}, 1000);

rrd.graph()
  .from('-1h')
  .title('Example graph with random values')
  .watermark('%a')
  .vlabel('Awesomeness')
  .size(600, 150)
  .smooth('foo', '10s')
    .as('foo_smooth')
  .smooth('foo_smooth', '1m')
    .as('foo_smooth2')
  .smooth('foo_smooth2', '2m')
    .as('foo_smooth3')
  .line('foo', '#ff000044')
  .line('foo_smooth', '#ff000066')
  .line('foo_smooth2', '#ff0000aa')
  .line('foo_smooth3', '#ff0000')
  .table()
  .create('file.png');
