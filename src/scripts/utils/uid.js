'use strict';

/**
 * Generates a random ID.
 */
module.exports = function uid() {
	return 'dirty_' + Math.random().toString(36).substr(2, 9) + '';
}
