(function() {
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker')
		.constant('dateTimePickerConfig', {
			dateFormat: 'yyyy-MM-dd',
			dateTimeFormat: 'yyyy-MM-dd HH:mm',
			timeFormat: 'HH:mm',
			minimumDate: new Date(1900, 0, 1),
			maximumDate: new Date(2100, 11, 31),
			minimumHour: 0,
			maximumHour: 23,
			minuteStep: 1
		});
})();
