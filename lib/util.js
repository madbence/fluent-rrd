module.exports.parseTime = function parseTime(str) {
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

module.exports.legend = function legend(str) {
  if(str.length > 10) {
    return str.substr(0, 10);
  }
  while(str.length < 10) {
    str += ' ';
  }
  return str;
}
