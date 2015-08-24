(function () {
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker')
		.directive('dtpCalendar', dtpCalendar);

	dtpCalendar.$inject = ['dtpDay', 'dateTimePickerConfig'];

	function dtpCalendar(Day, dateTimePickerConfig) {
		return {
			templateUrl: 'templates/dateTimePickerCalendar.html',
			require: 'ngModel',
			scope: {
				ngModel: '=',
				calendarMonth: '=',
				calendarYear: '=',
				dateMin: '=',
				dateMax: '=',
				showWeekNumbers: '='
			},
			link: link
		};


		function link(scope) {
			var date;
			var monthDate = getDateWithMonthFrom(scope.ngModel);
			scope.weeks = [];
			scope.dateMin = scope.dateMin || dateTimePickerConfig.minimumDate;
			scope.dateMax = scope.dateMax || dateTimePickerConfig.maximumDate;
			scope.today = new Day(new Date());
			scope.selectDay = selectDay;
			scope.goToSelectedDay = goToSelectedDay;
			scope.dateFormat = dateTimePickerConfig.dateFormat;

			prepareWeeksForView();
			scope.$watch('calendarMonth', function (month) {
				monthDate.setMonth(month);
				prepareWeeksForView();
			});
			scope.$watch('calendarYear', function (year) {
				monthDate.setFullYear(year);
				prepareWeeksForView();
			});

			
			function synchronizeFieldsWithModel() {
				scope.calendarMonth = monthDate.getMonth();
				scope.calendarYear = monthDate.getFullYear();
			}
			
			function selectDay(day) {
				if (day.before(scope.dateMin) || day.after(scope.dateMax)) {
					return;
				}

				scope.ngModel = day.toDate();
				monthDate = getDateWithMonthFrom(scope.ngModel);
				synchronizeFieldsWithModel();
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
						week = {
							days: [],
							num: getWeekNumberFor(startDate)
						};
						scope.weeks.push(week);
					}

					week.days.push(new Day(startDate));
					startDate.setDate(startDate.getDate() + 1);
				}
			}

			function isSunday(date) {
				return date.getDay() === 0;
			}

			function getWeekNumberFor(date) {
				date = new Date(date.getTime());
				date.setHours(0, 0, 0);
				date.setDate(date.getDate() + 4 - (date.getDay() || 7));
				var yearStart = new Date(date.getFullYear(), 0, 1);
				var weekNo = Math.ceil(( ( (date - yearStart) / 86400000) + 1) / 7);
				return weekNo;
			}
			
			function goToSelectedDay() {
				monthDate.setFullYear(scope.ngModel.getFullYear());
				monthDate.setMonth(scope.ngModel.getMonth());
				
				synchronizeFieldsWithModel();
				prepareWeeksForView();
			}
		}
	}
})();
