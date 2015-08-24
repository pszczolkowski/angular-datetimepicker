(function() {
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker', ['ui.bootstrap', 'dateParser']);

	angular
		.module('pszczolkowski.dateTimePicker')
		.config(['dateTimePickerConfig', function(dateTimePickerConfig) {
		}]);
})();
