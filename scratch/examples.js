var puff = require(__dirname+'/../build/puff-node');
puff.pollute(global);


var normalizeToHeight = r(
    a,
    p_(cl, r(first, map), r(first, _p(apply, max)), r(first, _p(apply, min)), second),
    p_(cl, first, 
       au_(r,
	   au_(minus, second),
	   au_(div, au(minus, second, third)),
	   au_(times, au(times, fourth))))    
//    p_(cl, first, second, third)
    //p_(cl, first, au_(minus, au(minus, second, first)))
    // p_(cl, 
    //    third,
    //    au(p_, always(minus), au(minus, second, first)),
    //    au(p_, always(div), second),
    //    au(p_, always(times), fourth)),
    // au(apply, first, r(p_(slice,1,3), _p(apply, r)))
    );   

console.log('test map', map([1,2,3])(function(x){
    return x + 1;
}))

console.log('test map 2', map(function(x){
    return x + 1;
})([4,2,3]))

console.log(min(1,2,3));
console.log(apply(min, [1,2,3]))
console.log(normalizeToHeight([1,2,3], 1).map(toString))
