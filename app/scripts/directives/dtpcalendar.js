(function () {
	'use strict';

	angular
		.module('pszczolkowski.datePicker')
		.directive('dtpCalendar', dtpCalendar);

	dtpCalendar.$inject = ['Day', 'datePickerConfig'];

	function dtpCalendar(Day, datePickerConfig) {
		return {
			templateUrl: 'templates/dtpCalendar.html',
			require: 'ngModel',
			scope: {
				ngModel: '=',
				calendarMonth: '=',
				calendarYear: '=',
				dateMin: '=',
				dateMax: '='
			},
			link: link
		};


		function link(scope) {
			var date;
			var monthDate = getDateWithMonthFrom(scope.ngModel);
			scope.weeks = [];
			scope.dateMin = scope.dateMin || datePickerConfig.minimumDate;
			scope.dateMax = scope.dateMax || datePickerConfig.maximumDate;
			scope.today = new Day(new Date());
			scope.selectDay = selectDay;


			prepareWeeksForView();
			scope.$watch('calendarMonth', function (month) {
				monthDate.setMonth(month);
				prepareWeeksForView();
			});
			scope.$watch('calendarYear', function (year) {
				monthDate.setFullYear(year);
				prepareWeeksForView();
			});

			function selectDay(day) {
				if (day.before(scope.dateMin) || day.after(scope.dateMax)) {
					return;
				}

				scope.ngModel = day.toDate();
				monthDate = getDateWithMonthFrom(scope.ngModel);
				scope.calendarMonth = monthDate.getMonth();
				scope.calendarYear = monthDate.getFullYear();
				prepareWeeksForView();
			}

			function getDateWithMonthFrom(date) {
				return new Date(date.getFullYear(), date.getMonth(), 1);
			}

			function prepareWeeksForView() {
				var startDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
				var week = [];
				var endDate = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

				scope.weeks = [];

				if (isSunday(startDate)) {
					startDate.setDate(startDate.getDate() - 6);
				} else {
					startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
				}

				if (!isSunday(endDate)) {
					endDate.setDate(endDate.getDate() + 7 - endDate.getDay());
				}

				while (startDate <= endDate) {
					if (startDate.getDay() === 1) {
						week = [];
						scope.weeks.push(week);
					}

					week.push(new Day(startDate));
					startDate.setDate(startDate.getDate() + 1);
				}
			}

			function isSunday(date) {
				return date.getDay() === 0;
			}
		}
	}
})();
