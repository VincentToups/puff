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
three partially applied functions to normalize the signal `s` so that
it is between zero and `h`.

Puff lets you choose how much you want to ape the style of
APL/J. Above, we calculated minVal and maxVal in the typical fashion,
but we could also have written:

var normalizeToHeight = r(a,p_(cl, [r(first, min), r(first, max), first, second])
