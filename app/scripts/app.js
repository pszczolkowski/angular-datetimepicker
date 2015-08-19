(function() {
	'use strict';

	angular
		.module('pszczolkowski.datePicker', ['ui.bootstrap', 'dateParser']);

	angular
		.module('pszczolkowski.datePicker')
		.config(['datePickerConfig', function(datePickerConfig) {
			datePickerConfig.minuteStep = 2;
		}]);
})();
