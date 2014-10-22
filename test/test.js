var bf = require('../bf.js')

var hello = "++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>."
bf.compile(hello).program(new bf.State())
bf.compile(",[.,]").program(new bf.State("Testing echo!\n"))

// Open 'bf' to make it slightly more readable
with (bf) {
  var echo = 
    Right(Input(Loop_uncurried(
            Output(Input(End)),
            Left(End))));
  echo(new State("The EDSL in action!\n"))
}


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

bf.compile(benchmark).program(new bf.State()) // Warning: takes about 2 minutes on my machine!
