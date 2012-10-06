// Superwith takes a nested object and uses eval
// to iterate through the entire object and use the
// `with` statement on every single level of every
// property. Then it runs your function inside of
// that.
//
// superwith(nested object, function to run)
// returns the function for you to call at your leisure
// or to run back through the superwith function

// example: http://jsbin.com/eyonot/3

function superwith (obj, fn, _objstack, _notfirst) {
  _objstack = _objstack || [obj];
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (typeof obj == "object") {
        _objstack.push(obj[i]);
        superwith(obj[i], fn, _objstack, _notfirst);
      }
    }
  }

  var withs = [];
  if (!_notfirst) {
    for (var j = 0; j < _objstack.length; j++) {
      withs.push('with(stack[' + j + ']){');
    }
  }

  var output = withs.join(' ');
  output += 'return (' + fn.toString() + ')();';
  output += withs.map(function () { return '}'; }).join(' ');

  var fnout = new Function("obj", "fn", "stack", "var outmost = this; return function () { " + output + ";};");
  return fnout(obj, fn, _objstack);
}

var superfunc = superwith({
  a:1,
  z:{
    b:1,
    z:{
      c:1
    }
  }
}, function (){
  return a+b+c;
});

console.log(superfunc());// 3
