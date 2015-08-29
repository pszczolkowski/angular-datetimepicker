(function () {
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker')
		.factory('dtpUtils', dtpUtils);

	function dtpUtils() {
		return {
			endOfDay: endOfDay,
			isSunday: isSunday,
			roundTimeToMinuteStep: roundTimeToMinuteStep
		};


		function endOfDay(date) {
			var resultDate = new Date(date.getTime());
			resultDate.setHours(23, 59, 59);

			return resultDate;
		}

		function isSunday(date) {
			return date.getDay() === 0;
		}

		function roundTimeToMinuteStep(date, minuteStep) {
			date = new Date(date.getTime());
			var rounded = minuteStep * Math.round(date.getMinutes() / minuteStep);

			if (rounded > 59) {
				date.setHours(date.getHours() + 1);
				rounded = 0;
			}

			date.setMinutes(rounded);
			return date;
		}
	}
})();
