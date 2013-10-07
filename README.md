bf.js
=====

This project was a fairly quick and dirty implementation of a brainfuck embedded
domain specific language (brainfuck) and a compiler using the EDSL. It shows how
one could implement a EDSL in javascript if one wishes. The implementation is
not very fast.


## In fact, it's very slow!

Included is a benchmark program I found on
[esolangs.org](http://esolangs.org/wiki/Talk:Brainfuck#Interpreter.2Fcompiler_speed_test).
It takes about 2 minutes to run the benchmark on my machine. According to a
comment there the benchmark runs in just under 6 seconds with his implementation
and macine.

## The compilation

The brainfuck program `>,[.,]<` is first parsed into a list of tokens (chars).
```javascript
['>', ',', ['.', ','], '<']
```

This list is then compiled to the following (well, not exactly...)

```javascript
Right(Input(Loop_uncurried(
        Output(Input(End)), // the body
	Left(End)) // the rest of the program
```

As mentioned said, almost as following. Loop is curried and above I used an
uncurried version.  Curried function calls in javascript looks silly (ex.
`f(x1)(x2)`), especially when stretched over multiple lines. 

## The EDSL

Essentially there's one constructor / function for each production in the
brainfuck grammar. The result is a function that takes a state as argument.
Javascript's function is *very* verbose so the following is in pseudo code
(pseudo-haskell?):
```haskell
Plus = \k -> \s -> k (increment s) -- increment the current cell
-- ...
Loop = \b -> \k -> \s -> if isZero s -- if the current cell is 0
                         then k s -- skip b
		         else let s' = b s -- Evaluate b on s
		              in Loop b k s' -- try again with new state
End = \s -> s -- Does not continue and returns the current state.
```

This is essentially a state machine with one state for every time a production
in the grammar is applied.

in javascript the recursive call to Loop is implemented as a while loop:

```javascript
while (!s.isZero()) { 
  s = b(s); // Keep updating while current cell is not zero
}
k(s); // Continue
```

Thus the implementation should use bounded memory unlike if the call was
recursive because of javascript's lack of *proper* tail calls.

## The State

The input state object defines the semantics of each command -- they all call
methods on the state object. Thus if one wants unbounded cells it's just a
matter of implementing a new State object with unbounded cells. Similarly, if
one wants to read from stdin instead of a constant string it's just a matter of
changing the `input()` method.
