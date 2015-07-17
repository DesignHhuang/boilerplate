
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
  ENTER:     13,
  BREAK:     19,
  ESC:       27,
  SPACE:     32,
  INSERT:    45,
  DELETE:    46,

  //Arrows
  LEFT:      37,
  RIGHT:     39,
  UP:        38,
  DOWN:      40,

  //Navigation
  HOME:      36,
  END:       35,
  PAGEUP:    33,
  PAGEDOWN:  34,

  //Modifiers
  SHIFT:     16,
  CTRL:      17,
  ALT:       18,
  CAPSLOCK:  20
});
