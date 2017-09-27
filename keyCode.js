// http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.js

var keyCode = {
	BACKSPACE: 8,
	COMMA: 188,
	DELETE: 46,
	DOWN: 40,
	END: 35,
	ENTER: 13,
	ESCAPE: 27,
	HOME: 36,
	LEFT: 37,
	NUMPAD_ADD: 107,
	NUMPAD_DECIMAL: 110,
	NUMPAD_DIVIDE: 111,
	NUMPAD_ENTER: 108,
	NUMPAD_MULTIPLY: 106,
	NUMPAD_SUBTRACT: 109,
	PAGE_DOWN: 34,
	PAGE_UP: 33,
	PERIOD: 190,
	RIGHT: 39,
	SPACE: 32,
	TAB: 9,
	UP: 38,
	SHIFT: 16,
	CONTROL: 17,
	ALT: 18
};

var keyName = {};

Object.keys(keyCode).forEach(function(k) {
  keyName[keyCode[k]] = k;
});
