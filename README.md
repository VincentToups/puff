Puff
----

Puff is a library for Point Free or Function Level programming in
Javascript, inspired by the terseness and productivity (for single
developers) of languages like J, APL, and K/Q.

As a person who writes software, I have at least two modes: in one, I
am a team member writing software which is supposed to be maintainable
and understandable by other developers. As (for instance) a generative
artist or data analyst I am interested in quickly sketching out high
level pipelines or programs which I can depend on being correct.

Puff is designed for the latter use case: it allows the Javascript
programmer to express things with great conciseness.

For instance:

	 function normalizeToHeight(s,h){
		 var minVal = s.reduce(min2);
		 var maxVal = s.reduce(max2);
		 return map(r(p_(minus,minVal), 
			          p_(div, maxVal-minVal), 
			          p_(times, h)), s);
	 }

Uses the reverse function composition combinator (`r`) to compose
three partially applied functions (`p_` partially applies on the
right, `_p` on the left) to normalize the signal `s` so that it is
between zero and `h`.

The above example mixes Javascript style with function level
programming (allowing a standard function definition to bind `s` and
`h`).  We can choose how deep down the function level programming hole
we want to go with `puff`:

	var normalizeToHeight = r(a,clo_({s:first,
	                                 h:second,
									 minVal:r(first, p_(reduce,min)),
									 maxVal:r(first, p_(reduce,max)})),
                              au(map, au(r,
							             au_(minus, p_(ix, 'minVal')),
										 au_(div,au_(minux, p_(ix, 'maxVal'), p_(ix, minVal))),
										 au_(times, p_(ix, 'h'))),
									 p_(ix, 's'));

This is a bit much, though. It is instructive, nevertheless, to read the above:

`r` introduces a composition - each argument is a function, each of
which is applied in order from left to right.

`a` returns all of its arguments as a single array.

`clo_` (`cleaveObject_`) returns a function waiting for a single value
and applies the functions at each key in the object provided to that
value and returns the object constructed by assigning each result to
its key.

`clo_` is just `c_(clo)`, eg, `clo` curried rightways.

`au` (`augment`) takes a function and returns a new function onto
which argument wise composition has occured.  Eg:

    au(function(a,b){return a+b}, first, second)

Is equivalent to the function:

	function(v){ return first(v)+second(v) };

By the above definition we can see that `au` on `r` above gives us the
composition of substracting that value stored at the `minVal` index,
dividing that by the difference between that stored at `maxVal` and
`minVal`.

`map` is finally applied to the value at key `s`.

If this seems kind of insane to you, well, that is function level
programming.  Several new combinators would make the above more
succinct: `aumap:_p(au,map)`, `aur:_p(au,r)` or even better:
`aurap:_p(ap,_p(au,r))`.
