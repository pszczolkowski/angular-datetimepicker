(function () {
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker')
		.filter('leadingZeros', leadingZeros);

	function leadingZeros() {
		return function (input) {
			var num = parseInt(input, 10);
			if (isNaN(num)) {
				return input;
			}

			return num < 10 ? '0' + num : '' + num;
		};
	}
})();

