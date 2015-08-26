(function() {
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker')
		.constant('dateTimePickerConfig', {
			dateFormat: 'yyyy-MM-dd',
			dateTimeFormat: 'yyyy-MM-dd HH:mm',
			timeFormat: 'HH:mm',
			minimumDate: new Date(1900, 0, 1),
			maximumDate: new Date(2099, 11, 31),
			minimumHour: undefined,
			maximumHour: undefined,
			minuteStep: 1,
			showWeekNumbers: false,
			calendarTemplate: 'templates/dateTimePickerCalendar.html',
			timerTemplate: 'templates/dateTimePickerTimer.html',
			modalTemplate: 'templates/dateTimePickerModal.html'
		});
})();
