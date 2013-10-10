var bf = require('../bf.js')

var hello = "++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>."
bf.compile(hello).program(new bf.State())
bf.compile(",[.,]").program(new bf.State("Testing echo!\n"))

var echo = bf.Right(bf.Input(bf.Loop_uncurried(
        bf.Output(bf.Input(bf.End)),
        bf.Left(bf.End))));

echo(new bf.State("The EDSL in action!\n"))

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
