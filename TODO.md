**TODO**
- [ ] Create tailLib and implement happy path for tail
- [ ] Move all the test 
- [ ] Implement lines option for tail
- [ ] Implement bytes option for tail

**MAYBE**
- [ ] handle other edge cases
- [ ] consider pulling common pattern from extractLines functions of head and tail

**DONE**

- [x] Keep the test inputs consistent
- [x] Create directory structure
- [x] Verify mocha
- [x] Establish contract for head without options and without files
- [x] Write test for head
- [x] Implement head without options
- [x] Extract splitting of lines into seperate function
- [x] Have a seperate function for returning only specified number of lines 
- [x] Change the contract of head to receive options
- [x] Implement countBytes option
- [x] Implement lineCount option (-n)
- [x] Think about both the options and modify head function
- [x] Implement passing line count option to head from upper level function
- [x] Implement passing default(10) line count option to head from upper level function
- [x] Implement passing byte count option to head using upper level function
- [x] Implement a function to parse args
- [x] Refactor head function
- [x] Write main and pass file
- [x] Change the contract of parse args to return object with consistent keys
  - [x] Eventually contract of head will also change 
- [x] validateArgs should handle errors
- [x] Clean parseOptions
- [x] Consider having the keys of the option object consistent
- [x] Write tests for functions in parseArgs.js
- [x] Move headMain test cases to different test file
- [X] Clean validateArgs function
- [X] validateOption shouldn't return valid options, seperate that concern to another function
- [x] Think of handling multiple files
- [x] Work on multiple files
- [x] customize the error messages 
- [x] test printContent
- [x] Parse and validate together
