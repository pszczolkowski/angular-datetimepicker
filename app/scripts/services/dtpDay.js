(function() {
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker') 
		.factory('dtpDay', DayFactory);


	function DayFactory() {
		function Day(date) {
			this.day = date.getDate();
			this.month = date.getMonth();
			this.year = date.getFullYear();
		}
		Day.prototype.equals = function(day) {
			if (!day) {
				return false;
			}

			if (day instanceof Date) {
				return this.day === day.getDate() &&
					this.month === day.getMonth() &&
					this.year === day.getFullYear();
			} else {
				return this.day === day.day &&
					this.month === day.month &&
					this.year === day.year;
			}
		};
		Day.prototype.before = function(date) {
			var dayDate = new Date();
			dayDate.setTime(date.getTime());
			dayDate.setFullYear(this.year);
			dayDate.setMonth(this.month);
			dayDate.setDate(this.day);

			return dayDate < date;
		};
		Day.prototype.after = function(date) {
			var dayDate = new Date();
			dayDate.setTime(date.getTime());
			dayDate.setFullYear(this.year);
			dayDate.setMonth(this.month);
			dayDate.setDate(this.day);

			return dayDate > date;
		};
		Day.prototype.toDate = function () {
			return new Date(this.year, this.month, this.day);
		};

		return Day;
	}
})();
