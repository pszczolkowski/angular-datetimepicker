(function() {
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker')
		.provider('dateTimePicker', function () {
			this.dateFormat = 'yyyy-MM-dd';
			this.dateTimeFormat = 'yyyy-MM-dd HH:mm';
			this.timeFormat = 'HH:mm';
			this.minimumDate = new Date(1900, 0, 1);
			this.maximumDate = new Date(2099, 11, 31);
			this.minimumHour = undefined;
			this.maximumHour = undefined;
			this.minuteStep = 1;
			this.showWeekNumbers = false;
			this.calendarTemplate = 'templates/dateTimePickerCalendar.html';
			this.timerTemplate = 'templates/dateTimePickerTimer.html';
			this.modalTemplate = 'templates/dateTimePickerModal.html';

			this.$get = function () {
				return {
					dateFormat: this.dateFormat,
					dateTimeFormat: this.dateTimeFormat,
					timeFormat: this.timeFormat,
					minimumDate: this.minimumDate,
					maximumDate: this.maximumDate,
					minimumHour: this.minimumHour,
					maximumHour: this.maximumHour,
					minuteStep: this.minuteStep,
					showWeekNumbers: this.showWeekNumbers,
					calendarTemplate: this.calendarTemplate,
					timerTemplate: this.timerTemplate,
					modalTemplate: this.modalTemplate
				};
			};
		});
})();
