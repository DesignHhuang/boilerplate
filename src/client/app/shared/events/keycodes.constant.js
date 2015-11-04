
/**
 * Module definition and dependencies
 */
angular.module('Events.KeyCodes.Constant', [])

/**
 * Constant definition
 */
.constant('KeyCodes', {
  //jscs: disable disallowMultipleSpaces

  //Basic
  BACKSPACE: 8,
  TAB:       9,
  CLEAR:     12,
  ENTER:     13,
  ESC:       27,
  SPACE:     32,

  //Navigation
  PAGEUP:    33,
  PAGEDOWN:  34,
  END:       35,
  HOME:      36,

  //Arrows
  LEFT:      37,
  UP:        38,
  RIGHT:     39,
  DOWN:      40,

  //
  INSERT:    45,
  DELETE:    46,

  //Modifiers
  SHIFT:     16,
  CTRL:      17,
  ALT:       18,
  BREAK:     19,
  CAPSLOCK:  20,
  CMDLEFT:   91,
  CMDRIGHT:  93,

  //Numeric keys (character codes)
  NUMERIC:   [
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57 //0-9
  ],

  //Control keys
  CONTROL:   [
    8, 9, 12, 13, 27, //backspace, tab, clear, enter, escape
    35, 36, 45, 46,   //end, home, insert, delete
    37, 38, 39, 40    //left, up, right, down
  ]
});
