function puts(s) {
  return process.stdout.write(s)
}

/* A persistent implementation works as well. I chose to do destructive updates
 * since that seems the easiest in javascript
 */
function State(input) {
  input = input === undefined ? [] : input.split('').map(function(c) { return c.charCodeAt(0) })
  var cellSize = 3000;
  this.cells = Array.apply(null, Array(cellSize)).map(function(_) { return 0; });
  var dp = 0;

  this.increment = function() {
    this.cells[dp] += 1;
    return this;
  };
  this.decrement = function() {
    this.cells[dp] -= 1;
    return this;
  };
  this.stepLeft = function() {
    dp = dp - 1 % cellSize;
    return this;
  };
  this.stepRight = function() {
    dp = dp + 1 % cellSize;
    return this;
  };
  this.input = function() {
    var i = input.shift();
    this.cells[dp] = i !== undefined ? i : 0;
    return this;
  };
  this.output = function() {
    puts(String.fromCharCode(this.cells[dp]));
    return this;
  };
  this.isZero = function() {
    return this.cells[dp] === 0;
  };
}

var keywords = "+-,.<>[]".split('');

function compile(source) {
  program = source.split('').filter(function(elt) {
    return keywords.indexOf(elt) !== -1;
  });
  comments = source.split('').filter(function(elt) {
    return keywords.indexOf(elt) === -1;
  });

  function parse(k_end, k_rbracket) {
    var c;
    var curr = [];
    while (c = program.shift()) {
      if (c === '[') {
        curr.push(parse(function (_) {
          throw { error : "Unexpected end of file!" };
        }, function (body) {
          return body
        }));
      } else if (c === ']') {
        return k_rbracket(curr);
      } else {
        curr.push(c);
      }
    }
    return k_end(curr);
  }
  var parsed = parse(function(x) { 
    return x
  }, function () {
    throw { error : "Unexpected ']'!" } 
  });

  return { program : compile_parsed(parsed)
         , comments : comments }
}

function compile_parsed(p) {
  return p.reverse().reduce(compile_folder, End);
}

function compile_folder(k, c) {
  if (typeof c === 'object') {
    return Loop(compile_parsed(c))(k);
  } else if (c === '+') {
    return Plus(k);
  } else if (c === '-') {
    return Minus(k);
  } else if (c === '<') {
    return Left(k)
  } else if (c === '>') {
    return Right(k)
  } else if (c === ',') {
    return Input(k)
  } else if (c === '.') {
    return Output(k)
  }
}

function Plus(k) {
  return function plus(state) {
    return k(state.increment())
  }
}

function Minus(k) {
  return function minus(state) {
    return k(state.decrement())
  }
}

function Left(k) {
  return function left(state) {
    return k(state.stepLeft())
  }
}

function Right(k) {
  return function right(state) {
    return k(state.stepRight())
  }
}

function Input(k) {
  return function input(state) {
    return k(state.input())
  }
}

function Output(k) {
  return function output(state) {
    return k(state.output())
  }
}

function Loop(b) {
  return function loop (k) {
    return function loop(state) {
      while (!state.isZero()) {
        state = b(state);
      }
      return k(state);
    }
  }
}

function End(state) {
  return state;
}

// TESTS
var hello = "++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>."
compile(hello).program(new State())
compile(",[.,]").program(new State("Testing echo!\n"))

function Loop_uncurried(b, k) {
  return Loop(b)(k)
}

var echo = Right(Input(Loop_uncurried(
        Output(Input(End)),
        Left(End))));

echo(new State("The EDSL in action!\n"))

var benchmark = ">+>+>+>+>++<[>[<+++>- \
                  >>>>> \
                  >+>+>+>+>++<[>[<+++>- \
                    >>>>> \
                    >+>+>+>+>++<[>[<+++>- \
                      >>>>> \
                      >+>+>+>+>++<[>[<+++>- \
                        >>>>> \
                        +++[->+++++<]>[-]< \
                        <<<<< \
                      ]<<]>[-] \
                      <<<<< \
                    ]<<]>[-] \
                    <<<<< \
                  ]<<]>[-] \
                  <<<<< \
                 ]<<]>."

// compile(benchmark).program(new State()) // Warning: takes about 2 minutes on my machine!
