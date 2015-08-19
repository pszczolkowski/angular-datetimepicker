(function() {
	'use strict';

	angular
		.module('pszczolkowski.datePicker')
		.constant('datePickerConfig', {
			dateFormat: 'yyyy-MM-dd',
			minimumDate: new Date(1900, 0, 1),
			maximumDate: new Date(2100, 11, 31),
			minimumHour: 0,
			maximumHour: 23,
			minuteStep: 15
		});
})();
