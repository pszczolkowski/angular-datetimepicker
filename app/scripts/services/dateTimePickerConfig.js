(function() {
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker')
		.constant('dateTimePickerConfig', {
			dateFormat: 'yyyy-MM-dd',
			dateTimeFormat: 'yyyy-MM-dd HH:mm',
			timeFormat: 'HH:mm',
			minimumDate: new Date(1900, 0, 1),
			maximumDate: new Date(2099, 11, 31, 23, 59),
			minimumHour: 0,
			maximumHour: 23,
			minuteStep: 1,
			calendarTemplate: 'templates/dateTimePickerCalendar.html',
			timerTemplate: 'templates/dateTimePickerTimer.html',
			modalTemplate: 'templates/dateTimePickerModal.html'
		});
})();
