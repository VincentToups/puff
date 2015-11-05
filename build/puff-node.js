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

    /** partially fix arguments to f (on the right)
     *
     */
    function partialRight(f /*... fixedArgs */){
	var fixedArgs = Array.prototype.slice.call(arguments, 1, arguments.length);
	return function(/*... unfixedArgs */){
	    var unfixedArgs = Array.prototype.slice.call(arguments, 0, arguments.length);
	    return f.apply(null,unfixedArgs.concat(fixedArgs));
	}
    }

    /** partially fix arguments to f (on the left)
     *
     */
    function partialLeft(f /*... fixedArgs */){
	var fixedArgs = Array.prototype.slice.call(arguments, 1, arguments.length);
	return function(/*... unfixedArgs */){
	    var unfixedArgs = Array.prototype.slice.call(arguments, 0, arguments.length);
	    return f.apply(null,fixedArgs.concat(unfixedArgs));
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

 function initArray(count, init){
     var a = [];
     for(var i = 0; i < count; i = i + 1){
	 a.push(i);
     }
     return a;
 }

 /** map f over arrays
  * if multiple arrays are provided, the result is the length of the shortest
  * and f is applied to as many elements as there are arrays, each drawn from 
  * one of the input arrays.
  */
 function map(f /*... arrays */){
     var arrays = Array.prototype.slice.call(arguments, 1, arguments.length);
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
     for(var i = 1; i < n; i = i + 1){
	 s = s - arguments[i];
     }
     return s;
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
     return v;
 }

 function array(){
     return Array.prototype.slice.call(arguments, 0, arguments.length);
 }

 /** 
  * given an object, attach all of puff's exported functions to it.
  * most often used to pollute the global scope with puff's functions.	
  */
 function pollute(where){
     var where = where || global;
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

 function apply(f){
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


 function cleave(v/*... fs*/){
     var fs = Array.prototype.slice.call(arguments, 1, arguments.length);
     return fs.map(function(f){
	 return f[v];
     });
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
     o[2];
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

 var puff = {
     trim:trim,
     str:str,
     log:log,
     nth:ixc,
     ixc:ixc, 
     nthc:ixc,
     first:first,
     second:second,
     id:id,
     cleave:cleave,
     cl:cleave,
     repeat:repeat,
     rep:repeat,
     twoArgs:twoArgs,
     plus2:plus2,
     minus2:minus2,
     times2:times2,
     div2:div2,
     min2:min2,
     max2:max2,
     apply:apply,
     ap:apply,
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
     partialLeft:partialLeft,
     _p:partialLeft,
     partialRight:partialRight,
     p_:partialRight,
     index:index,
     ix:index,
     bind:bind,
     b:bind,
     length:length,
     l:length,
     map:map,
     m:map,
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
 };

module.exports = puff;
