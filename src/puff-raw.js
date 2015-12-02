/** compose functions
 *  return a new function which applies the last argument to compose
 *  to the values passed in and then applies each previous function
 *  to the previous result.  The final result is returned.
 */
function compose(){
    var fs = Array.prototype.slice.call(arguments, 0, arguments.length);
    return function(){
	var inArgs = Array.prototype.slice.call(arguments, 0, arguments.length);
	var i = fs.length-1;
	var res = fs[i].apply(null, inArgs);
	i = i - 1;
	for(; i>=0; i = i - 1){
	    res = fs[i](res);
	}
	return res;
    }
}

/** reverse compose 
 * as in compose, but functions are applied first to last instead of last to first
 */
function rCompose(){
    var fs = Array.prototype.slice.call(arguments, 0, arguments.length);
    return function(){
	var inArgs = Array.prototype.slice.call(arguments, 0, arguments.length);
	var i = 0;
	var res = fs[i].apply(null, inArgs);
	i = i + 1;
	var n = fs.length;
	for(; i<n; i = i + 1){
	    res = fs[i](res);
	}
	return res;
    }
}

function rComposeOn(){
    var initialValue = arguments[0];
    var rest = Array.prototype.slice.call(arguments, 1, arguments.length);
    return rCompose.apply(null, rest)(initialValue);
}

/** partially fix arguments to f (on the right)
 *
 */
function partialRight(f /*... fixedArgs */){
    var fixedArgs = Array.prototype.slice.call(arguments, 1, arguments.length);
    var out = function(/*... unfixedArgs */){
	var unfixedArgs = Array.prototype.slice.call(arguments, 0, arguments.length);
	return f.apply(null,unfixedArgs.concat(fixedArgs));
    }
    out.toString = function(){
	return "partialRight("+f.toString()+","+fixedArgs.join(",")+")";
    }
    return out;
}

/** given a function f, return g, which is f curried on the right 
 *  g will be a function which takes arguments (a), returns h which takes further arguments (b)
 *  and returns f.apply(b.concat(a));
 */
function curryRight(f){
    return function(){
	return partialRight.apply(null, [f].concat(Array.prototype.slice.call(arguments, 0, arguments.length)));
    }
}

/** partially fix arguments to f (on the left)
 *
 */
function partialLeft(f /*... fixedArgs */){
    var fixedArgs = Array.prototype.slice.call(arguments, 1, arguments.length);
    var out = function(/*... unfixedArgs */){
	var unfixedArgs = Array.prototype.slice.call(arguments, 0, arguments.length);
	return f.apply(null,fixedArgs.concat(unfixedArgs));
    }
    out.toString = function(){
	return "partialLeft("+f.toString()+","+fixedArgs.join(",")+")";
    }
    return out;
}

/** given a function f, return g, which is f curried on the left
 *  g will be a function which takes arguments (a), returns h which takes further arguments (b)
 *  and returns f.apply(a.concat(b));
 */
function curryLeft(f){
    return function(){
	return partialLeft.apply(null, [f].call(Array.prototype.slice.call(arguments, 0, arguments.length)));
    }
}

/** index into o, an object or array
 * if multiple indices are provided, each is applied to the result of indexing the previous
 */
function index(o /* ... indexes */){
    var indexes = Array.prototype.slice.call(arguments, 1, arguments.length);
    var indexCount = indexes.length;
    if(indexCount === 1){
	return o[indexes[0]];
    } else {
	for(var i = 0; i < indexCount; i = i + 1){
	    o = o[indexes[i]];
	}
	return o;
    }	
}

/** bind bind f to an instance t.
 *
 */
function bind(f,t){
    return r.bind(t);
}

/** reduce seq a with f and optional initial value init.
 *
 */
function reduce(f, a, init){
    if(typeof init === 'undefined'){
	return a.reduce(f);
    } else {
	return a.reduce(f, a, init);
    }
}

/** return the length of a
 */
function length(a){
    return a.length;
}

function largestLength(as){
    return as.reduce(function(largestSoFar, a){
	if(a.length>largestSoFar){
	    return a.length;
	} else {
	    return largestSoFar;
	}
    }, -Infinity);
}

function sort(a,crit){
    if(arguments.length===1){
	if(typeof a === 'function'){
	    return function(actualArray){
		return actualArray.map(id).sort(a);
	    }
	} else if(typeof a === 'string' || typeof a === 'number'){
	    return function (actualArray){
		return actualArray.map(id).sort(function(r,s){
							   r = r[a];
							   s = s[a];
							   if(r<s) return -1;
							   if(r>s) return 1;
							   return 0;
							   })
	    };
	} else {
	    return function(actualCrit){
		if(typeof actualCrit==='function'){
		    return a.map(id).sort(actualCrit);
		} else {
		    return a.map(id).sort(function(r,s){
			r = r[actualCrit];
			s = s[actualCrit];
			if(r<s) return -1;
			if(r>s) return 1;
			return 0;
		    });
		}
	    }
	}
    } else {
	return a.map(id).sort(typeof crit === 'function' ? crit :
			      function(r,s){
				  return a.sort(function(r,s){
				      r = r[crit];
				      s = s[crit];
				      if(r<s) return -1;
				      if(r>s) return 1;
				      return 0;
				  });
			      });
    }
}

function initArray(count, init){
    var a = [];
    for(var i = 0; i < count; i = i + 1){
	a.push(init);
    }
    return a;
}

function shuffle(a){
    return r(map(function(a){return [Math.random(),a]}),
	     sort(0),
	     map(second))(a);
}

function randomElement(a){
    return a[Math.floor(Math.random()*a.length)];
}

function nextCellIndex(a, indexes){
    var indexes = indexes.map(id);
    var delta = indexes.length-1;
    var subIndex = indexes.slice(0,delta);
    var indexedArray = index.apply(null, [a].concat(subIndex));
    var done = indexes[delta]+1 < indexedArray.length;
    while(!done){
	delta = delta -1;
	if(delta<0){
	    return null;
	} else {
	    indexedArray = index.apply(null, [a].concat(indexes.slice(0,delta)));
	    done = indexes[delta]+1 < indexedArray.length;
	    
	}
    }
    indexes[delta] = indexes[delta]+1;
    for(var i = delta+1; i<indexes.length; i = i + 1){
	indexes[i] = 0;
    }
    return indexes;
}

function guessRank(a){
    var rank = 0;
    var done = false;
    while(!done){
	if(typeof a['length'] === 'number'){
	    rank = rank + 1;
	    a = a[0];
        } else {
            done = true;
        }
    }
    return rank;
}

function cells(n, a){
    if(!isFinite(n)){
	return a;
    }
    if(n<0){
	var nn = -n;
	var out = [];
	var indexes = initArray(nn,0);
	while(indexes){
	    out.push(index.apply(null, [a].concat(indexes)));
	    indexes = nextCellIndex(a,indexes)
	}
	return out;
    } else {
	var rank = n-guessRank(a);
	return cells(rank, a);
    }
}

function rank(f){
    var ranks = Array.prototype.slice.call(arguments,1,arguments.length);
    return function(){
	return map.apply(null,[f].concat(map(cells, 					     
					     ranks,
					     Array.prototype.slice.call(arguments,0,arguments.length))));
    }
}

/** map f over arrays
 * if multiple arrays are provided, the result is the length of the shortest
 * and f is applied to as many elements as there are arrays, each drawn from 
 * one of the input arrays.
 * 
 * if no arrays are applied, return map partially applied on the left with f
 *
 * if no function is provided, return map partially applied with arrays on the right.
 */
function map(f /*... arrays */){
    var arrays = Array.prototype.slice.call(arguments, 1, arguments.length);
    if(typeof f === 'function' && arrays.length === 0){
	return function(){
	    var arrays = Array.prototype.slice.call(arguments, 0, arguments.length);
	    return map.apply(null, [f].concat(arrays));
	}
    } else if (typeof f !== 'function') {
	return function(g){
	    return map.apply(null, [g,f].concat(arrays));
	}
    } else {
	var arrayCount = arrays.length;
	if(arrayCount === 1){
	    return arrays[0].map(function(el){
		return f(el);
	    });
	} else {
	    var maxLen = largestLength(arrays);
	    var out = [];
	    var argHolder = initArray(arrayCount, undefined);
	    for(var i = 0; i < maxLen; i = i + 1){
		for(var j = 0; j < arrayCount; j = j + 1){
		    argHolder[j] = arrays[j][i];
		}
		out.push(f.apply(null, argHolder));
	    }
	    return out;
	}
    }
}

function threadAlong1(f,position){
    return function(){
	var args = Array.prototype.slice.call(arguments, 0, arguments.length);
	var threaded = args[position];
	var n = threaded.length;
	var out = [];
	for(var i = 0; i < n; i = i + 1){
	    args[position] = threaded[i];
	    out.push(f.apply(null, args));
	}
	return out;
    }
}

function threadAlong(f, nArgs){
    for(var i = 0; i < nArgs; i = i + 1){
	f = threadAlong1(f,i);
    }
    return f;
}

function crossMap(f){
    var argLists = Array.prototype.slice.call(arguments, 1, arguments.length);
    if(typeof f !== 'function'){
	var realArgList = [f].concat(argLists);
	return function(realF){
	    return threadAlong(realF, realArgList.length).apply(null, realArgList);
	}
    } else if (typeof f === 'function' && argLists.length === 0){
	return function(){
	    var realArgList = Array.prototype.slice.call(arguments, 0, arguments.length);
	    return threadAlong(f, realArgList.length).apply(null, realArgList);
	}
    } else {
	return threadAlong(f,argLists.length).apply(null, argLists);
    }
}

function cat(){
    var args = Array.prototype.slice.call(arguments, 0, arguments.length);    
    return Array.prototype.concat.apply([], args);
}

function mapcat(f){
    var arrays = Array.prototype.slice.call(arguments, 1, arguments.length);
    if(typeof f === 'function' && arrays.length === 0){
	return function(){
	    var arrays = Array.prototype.slice.call(arguments, 0, arguments.length);
	    return mapcat.apply(null, [f].concat(arrays));
	}
    } else if (typeof f !== 'function') {
	return function(g){
	    return mapcat.apply(null, [g,f].concat(arrays));
	}
    } else {
	var arrayCount = arrays.length;
	if(arrayCount === 1){
	    return cat.apply(null, arrays[0].map(function(el){
		return f(el);
	    }));
	} else {
	    var maxLen = largestLength(arrays);
	    var out = [];
	    var argHolder = initArray(arrayCount, undefined);
	    for(var i = 0; i < maxLen; i = i + 1){
		for(var j = 0; j < arrayCount; j = j + 1){
		    argHolder[j] = arrays[j][i];
		}
		out.push(f.apply(null, argHolder));
	    }
	    return cat.apply(null, out);
	}
    }
}

function plus(){
    var s = 0;
    var n = arguments.length;
    for(var i = 0; i < n; i = i + 1){
	s = s + arguments[i];
    }
    return s;
}

function minus(){
    var s = arguments[0];
    var n = arguments.length;
    if(n==1){
	return -s;
    } else {
	for(var i = 1; i < n; i = i + 1){
	    s = s - arguments[i];
	}
	return s;
    }
}


function times(){
    var s = 1;
    var n = arguments.length;
    for(var i = 0; i < n; i = i + 1){
	s = s * arguments[i];
    }
    return s;
}

function div(){
    var s = arguments[0];
    var n = arguments.length;
    for(var i = 1; i < n; i = i + 1){
	s = s / arguments[i];
    }
    return s;
}

function min(){
    return (Array.prototype.slice.call(arguments, 0, arguments.length)).reduce(min2, Infinity);
    function min2(prev, curr){
	if(prev<curr){
	    return prev;
	} else {
	    return curr;
	}
    }
}

function max(){
    return (Array.prototype.slice.call(arguments, 0, arguments.length)).reduce(min2, -Infinity);
    function min2(prev, curr){
	if(prev>curr){
	    return prev;
	} else {
	    return curr;
	}
    }
}

function always(v){
    return function(){
	return v;
    }
}

function array(){
    return Array.prototype.slice.call(arguments, 0, arguments.length);
}

/** 
 * given an object, attach all of puff's exported functions to it.
 * most often used to pollute the global scope with puff's functions.	
 */
function pollute(where){
    var where = where || global || window;
    Object.keys(puff).forEach(function(k){
	where[k] = puff[k];
    });
}

function square(a){
    return a*a;
}

function quad(a){
    return a*a*a*a;
}

function raiseTo(a, powv){
    return Math.pow(a, powv);
}

function apply(f, a){
    return f.apply(null, a);
}

function call(f){
    return f.apply(null, Array.prototype.slice.call(arguments, 1, arguments.length));
}

function min2(a,b){
    return a < b ? a : b;
}

function max2(a,b){
    return a > b ? a : b;
}

function plus2(a,b){
    return a+b;
}
function minus2(a,b){
    return a-b;
}
function times2(a,b){
    return a*b;
}
function div2(a,b){
    return a/b;
}

/** return a new function which takes exactly two arguments and applies them to 
 * f, returning the result.
 */
function twoArgs(f){
    return function(a,b){
	return f(a,b);
    }
}

/** Apply f repeatedly to a (and then the result of the application) n times. */
function repeat(f,n,a){
    for(var i = 0; i < n; i = i + 1){
	a = f(a);
    }
    return a;
}

function repeatAccumulate(f,n,a){
    var out = [a];
    for(var i = 0; i < n; i = i + 1){
	a = f(a);
	out.push(a);
    }
    return out;
}

function cleave(v /*... fs*/){
    var fs = Array.prototype.slice.call(arguments, 1, arguments.length);
    return fs.map(function(f){
	return f(v);
    });
}

function cleave_(/*... fs*/){
    var fs = Array.prototype.slice.call(arguments, 0, arguments.length);
    return function(v){
	return fs.map(function(f){
	    return f(v);
	})
    }
}

function cleaveObject(v, o){
    var out = [];
    Object.keys(o).forEach(function(k){
	out[k] = o[k](v);
    });
    return out;
}

function cleaveObject_(o){
    return function(v){
	var out = [];
	Object.keys(o).forEach(function(k){
	    out[k] = o[k](v);
	});
	return out;
    }
}

/** given a function f and a additional functions gs
 *  return a new function h which applies each g
 *  to its single argument and then applies f to the 
 *  resulting list of values 
 */
function augment(f /*... gs*/){
    var gs = Array.prototype.slice.call(arguments, 1, arguments.length);
    var out = function(a){
	return f.apply(null, gs.map(function(g){
	    return g(a);
	}));
    }
    out.toString = function(){
	return "augment("+f.toString()+","+gs.map(toString).join(", ")+")";
    }
    return out;
}

function toString(o){
    return o.toString();
}

function augmentRight(f /*... augmentations */){
    var augmentations = Array.prototype.slice.call(arguments, 1 , arguments.length);
    return function(v){
	var augmentedArgs = augmentations.map(function(f){
	    return f(v);
	});
	return function(){
	    var unfixedArgs = Array.prototype.slice.call(arguments, 0, arguments.length);
	    return f.apply(null, unfixedArgs.concat(augmentedArgs));
	}
    }
}

function augmentLeft(f /*... augmentations */){
    var augmentations = Array.prototype.slice.call(arguments, 1 , arguments.length);
    return function(v){
	var augmentedArgs = augmentations.map(function(f){
	    return f(v);
	});
	return function(){
	    var unfixedArgs = Array.prototype.slice.call(arguments, 0, arguments.length);
	    return f.apply(null, augmentedArgs.concat(unfixedArgs));
	}
    }
}


function id(x){
    return x;
}

function first(o){
    return o[0];
}

function second(o){
    return o[1];
}

function third(o){
    return o[2];
}

function fourth(o){
    return o[3];
}

function ixc(i){
    return function(o){
	return o[i];
    }
}

function log(){
    var args = Array.prototype.slice.call(arguments, 0, arguments.length);
    console.log.apply(console, args);
    return args[0];
}

function str(){
    var args = Array.prototype.slice.call(arguments, 0, arguments.length);
    return args.map(function(a){
	if(typeof a === 'number' || typeof a === 'string'){
	    return a+"";
	} else {
	    return a.toString();
	}
    }).join("");
}

function trim(a){
    return a.trim();
}

function slice(a,i,j){
    return a.slice(i,j);
}

function split(s,deli){
    if(typeof deli === 'undefined'){
	var actualDeli = s;
	return function(s){
	    return s.split(actualDeli);
	}
    } else {
	return s.split(deli);
    }
}

function splitJoin(){
    if(arguments.length === 3){
	return arguments[0].split(arguments[1]).join(arguments[2]);
    } else {
	var args = Array.prototype.slice.call(arguments, 0, arguments.length);
	return function(s){
	    return s.split(args[0]).join(args[1]);
	}
    }
}

function join(a, w){
    if(typeof w === 'undefined'){
	var actualW = a;
	return function(a){
	    return a.join(actualW);
	}
    } else {
	return a.join(w);
    }
}

function rest(a){
    return a.slice(1);
}

function last(a){
    return a[a.length-1];
}

function args(n){
    if(typeof n !== 'number'){
	throw new Error('args requires a numerical argument, got ', n);
    }
    return function(){
	return Array.prototype.slice.call(arguments, 0, n);
    }
}

function lambda(argCount){
    return r.apply(null, [args(argCount)].concat(Array.prototype.slice.call(arguments, 1, arguments.length)));
}

function n0(a){ return a[0]; }
function n00(a){ return a[0][0]; }
function n000(a){ return a[0][0][0]; }
function n001(a){ return a[0][0][1]; }
function n002(a){ return a[0][0][2]; }
function n01(a){ return a[0][1]; }
function n010(a){ return a[0][1][0]; }
function n011(a){ return a[0][1][1]; }
function n012(a){ return a[0][1][2]; }
function n02(a){ return a[0][2]; }
function n020(a){ return a[0][2][0]; }
function n021(a){ return a[0][2][1]; }
function n022(a){ return a[0][2][2]; }
function n1(a){ return a[1]; }
function n10(a){ return a[1][0]; }
function n100(a){ return a[1][0][0]; }
function n101(a){ return a[1][0][1]; }
function n102(a){ return a[1][0][2]; }
function n11(a){ return a[1][1]; }
function n110(a){ return a[1][1][0]; }
function n111(a){ return a[1][1][1]; }
function n112(a){ return a[1][1][2]; }
function n12(a){ return a[1][2]; }
function n120(a){ return a[1][2][0]; }
function n121(a){ return a[1][2][1]; }
function n122(a){ return a[1][2][2]; }
function n2(a){ return a[2]; }
function n20(a){ return a[2][0]; }
function n200(a){ return a[2][0][0]; }
function n201(a){ return a[2][0][1]; }
function n202(a){ return a[2][0][2]; }
function n21(a){ return a[2][1]; }
function n210(a){ return a[2][1][0]; }
function n211(a){ return a[2][1][1]; }
function n212(a){ return a[2][1][2]; }
function n22(a){ return a[2][2]; }
function n220(a){ return a[2][2][0]; }
function n221(a){ return a[2][2][1]; }
function n222(a){ return a[2][2][2]; }

var puff = {
    sort:sort,
    s:sort,
    rest:rest,
    split:split,
    join:join,
    trim:trim,
    str:str,
    log:log,
    nth:ixc,
    n:ixc,
    ixc:ixc, 
    nthc:ixc,
    first:first,
    second:second,
    third:third,
    fourth:fourth,
    id:id,
    cleave:cleave,
    cl:cleave,
    cleave_:cleave_,
    cl_:cleave_,
    cleaveObject:cleaveObject,
    clo:cleaveObject,
    cleaveObject_:cleaveObject_,
    clo_:cleaveObject_,
    repeat:repeat,
    rep:repeat,
    repeatAccumulate:repeatAccumulate,
    repAc:repeatAccumulate,
    twoArgs:twoArgs,
    plus2:plus2,
    minus2:minus2,
    times2:times2,
    div2:div2,
    min2:min2,
    max2:max2,
    apply:apply,
    ap:apply,
    call:call,
    ca:call,
    square:square,
    xx:square,
    quad:quad,
    raiseTo:raiseTo,
    e:raiseTo,
    pollute:pollute,
    compose:compose,
    c:compose,
    rCompose:rCompose,
    r:rCompose,
    rComposeOn:rComposeOn,
    rOn:rComposeOn,
    partialLeft:partialLeft,
    _p:partialLeft,
    partialRight:partialRight,
    p_:partialRight,
    curryLeft:curryLeft,
    _c:curryLeft,
    curryRight:curryRight,
    c_:curryRight,
    index:index,
    ix:index,
    bind:bind,
    b:bind,
    length:length,
    l:length,
    shuffle:shuffle,
    sh:shuffle,
    randomElement:randomElement,
    re:randomElement,
    map:map,
    m:map,
    rank:rank,
    ra:rank,
    crossMap:crossMap,
    x:crossMap,
    cells:cells,
    reduce:reduce,
    rd:reduce,
    plus:plus,
    minus:minus,
    times:times,
    div:div,
    min:min,
    max:max,
    array:array,
    a:array,
    always:always,
    al:always,
    augment:augment,
    augmentLeft:augmentLeft,
    _au:augmentLeft,
    augmentRight:augmentRight,
    au_:augmentRight,
    au:augment,
    slice:slice,
    sl:slice,
    toString:toString,
    last:last,
    args:args,
    lambda:lambda,
    f:lambda,
    splitJoin:splitJoin,
    cat:cat,
    mapcat:mapcat,
    nextCellIndex:nextCellIndex,
    guessRank:guessRank,
    n0:n0,
    n00:n00,
    n000:n000,
    n001:n001,
    n002:n002,
    n01:n01,
    n010:n010,
    n011:n011,
    n012:n012,
    n02:n02,
    n020:n020,
    n021:n021,
    n022:n022,
    n1:n1,
    n10:n10,
    n100:n100,
    n101:n101,
    n102:n102,
    n11:n11,
    n110:n110,
    n111:n111,
    n112:n112,
    n12:n12,
    n120:n120,
    n121:n121,
    n122:n122,
    n2:n2,
    n20:n20,
    n200:n200,
    n201:n201,
    n202:n202,
    n21:n21,
    n210:n210,
    n211:n211,
    n212:n212,
    n22:n22,
    n220:n220,
    n221:n221,
    n222:n222,
};
