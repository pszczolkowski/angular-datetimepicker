(function () {
	'use strict';
	
	angular
		.module('pszczolkowski.dateTimePicker')
		.factory('dtpUtils', dtpUtils);
		
	function dtpUtils() {
		return {
			endOfDay: endOfDay,
			isSunday: isSunday
		};
		
		
		function endOfDay(date) {
			var resultDate = new Date(date.getTime());
			resultDate.setHours(23, 59, 59);
			
			return resultDate;
		}
		
		function isSunday(date) {
			return date.getDay() === 0;
		}
	}
})();