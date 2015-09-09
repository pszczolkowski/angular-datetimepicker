/*
 * Angular DateTimePicker
 * version: 1.0.2
 */

'use strict';
(function(angular){
(function() {
angular
		.module('pszczolkowski.dateTimePicker', ['ui.bootstrap', 'dateParser']);
})();

(function () {
angular
		.module('pszczolkowski.dateTimePicker')
		.controller('DateTimePickerCtrl', DateTimePickerCtrl);

	DateTimePickerCtrl.$inject = ['$scope', '$timeout', '$modal', 'dateTimePicker', 'dtpUtils'];

	function DateTimePickerCtrl($scope, $timeout, $modal, dateTimePicker, utils) {
		$scope.pickDate = pickDate;

		$timeout(function () {
			if ($scope.ngModel) {
				$scope.ngModel = utils.roundTimeToMinuteStep($scope.ngModel, $scope.constraints.minuteStep || dateTimePicker.minuteStep);
			}
		});


		function pickDate() {
			var modalInstance = $modal.open({
				size: 'md',
				templateUrl: dateTimePicker.modalTemplate,
				controller: 'DateTimePickerModalCtrl',
				resolve: {
					pickType: function () {
						return $scope.pickType;
					},
					selectedDate: function () {
						return $scope.ngModel;
					},
					constraints: function () {
						return $scope.constraints;
					}
				}
			});

			modalInstance.result.then(function (date) {
				if (date !== undefined) {
					if (date === null) {
						$scope.ngModel = undefined;
					} else {
						$scope.ngModel = date;
					}
				}
			});
		}
	}
})();

(function(){
angular
		.module('pszczolkowski.dateTimePicker')
		.controller('DateTimePickerModalCtrl' , DateTimePickerModalCtrl);

	DateTimePickerModalCtrl.$inject = ['$scope', '$modalInstance', 'dateTimePicker', 'pickType', 'selectedDate', 'constraints'];

	function DateTimePickerModalCtrl($scope, $modalInstance, dateTimePicker, pickType, selectedDate, constraints) {
		var now = new Date();

		if (!(selectedDate instanceof Date)) {
			selectedDate = undefined;
		}

		constraints.dateMin = constraints.dateMin || dateTimePicker.minimumDate;
		constraints.dateMax = constraints.dateMax || dateTimePicker.maximumDate;

		$scope.pickType = pickType;
		$scope.calendar = {
			month: 	selectedDate ? selectedDate.getMonth() : now.getMonth(),
			year: selectedDate ? selectedDate.getFullYear() : now.getFullYear(),
			selectedDayDate: selectedDate
		};
		$scope.date = {
			selectedDay: selectedDate ? new Date(selectedDate.getTime()) : undefined,
			selectedTime: selectedDate ? new Date(selectedDate.getTime()) : undefined
		};
		$scope.months = [];
		$scope.years = [];
		$scope.minusMonth = minusMonth;
		$scope.plusMonth = plusMonth;
		$scope.setMonth = setMonth;
		$scope.plusYear = plusYear;
		$scope.minusYear = minusYear;
		$scope.setYear = setYear;
		$scope.confirm = confirm;
		$scope.cancel = cancel;
		$scope.jumpToToday = jumpToToday;
		$scope.clear = clear;
		$scope.constraints = constraints;

		generateMonths();
		generateYears();


		function addMonths(quantity) {
			$scope.calendar.month += quantity;
			var monthsExcess = $scope.calendar.month % 12;
			var yearsExcess = Math.floor($scope.calendar.month / 12);

			$scope.calendar.year += yearsExcess;
			$scope.calendar.month = monthsExcess < 0 ? 12 + monthsExcess : monthsExcess;

			generateMonths();
			generateYears();
		}

		function minusMonth() {
			addMonths(-1);
		}

		function plusMonth() {
			addMonths(1);
		}

		function setMonth(month) {
			$scope.calendar.month = month;
		}

		function addYears(quantity) {
			$scope.calendar.year += quantity;
			generateMonths();
			generateYears();
		}

		function minusYear() {
			addYears(-1);
		}

		function plusYear() {
			addYears(1);
		}

		function setYear(year) {
			$scope.calendar.year = year;
		}

		function generateMonths() {
			$scope.months = [];

			for (var month = 0; month < 12; month++) {
				if ($scope.calendar.year === constraints.dateMin.getFullYear() && month < constraints.dateMin.getMonth()) {
					$scope.months[month] = false;
				}
				if ($scope.calendar.year === constraints.dateMax.getFullYear() && month > constraints.dateMax.getMonth()) {
					$scope.months[month] = false;
				}

				$scope.months[month] = true;
			}
		}

		function generateYears() {
			var highestYear = Math.max(now.getFullYear(), $scope.calendar.year) + 5;
			var highestValidYear = Math.min(highestYear, constraints.dateMax.getFullYear());
			$scope.years = [];

			for (var year = highestValidYear; year >= constraints.dateMin.getFullYear(); year--) {
				$scope.years.push(year);
			}
		}

		function confirm() {
			var returnDate = null;

			if ($scope.date.selectedDay !== undefined) {
				returnDate = new Date();
				returnDate.setTime($scope.date.selectedDay.getTime());

				if (pickType === 'datetime' || pickType === 'time') {
					returnDate.setHours($scope.date.selectedTime.getHours());
					returnDate.setMinutes($scope.date.selectedTime.getMinutes());
				}
			}

			$modalInstance.close(returnDate);
		}

		function cancel() {
			$modalInstance.dismiss('cancel');
		}

		function jumpToToday() {
			var now = new Date();
			$scope.calendar.month = now.getMonth();
			$scope.calendar.year = now.getFullYear();
		}

		function clear() {
			$scope.date.selectedDay = undefined;
		}
	}
})();

(function(){
angular
		.module('pszczolkowski.dateTimePicker')
		.directive('datePickerInput', datePickerInput);

	datePickerInput.$inject = ['$dateParser', 'dateFilter', 'dateTimePicker', 'dtpUtils'];

	function datePickerInput($dateParser, dateFilter, dateTimePicker, utils) {
		return {
			scope: {
				inputConstraints: '=',
				pickType: '=datePickerInput'
			},
			require: 'ngModel',
			link: function(scope, elem, attributes, ngModelController) {
				if (ngModelController) {
					ngModelController.$parsers.push(function(dateString) {
						markDateAsValid();

						if (dateString === '') {
							if (scope.inputConstraints.required) {
								markDateAsInvalidBecauseOf('required');
							}

							return null;
						}

						var date = $dateParser(dateString, scope.inputConstraints.dateFormat);

						if (date !== undefined) {
							if (thereIsDatepicker()) {
								if (dateDoesNotFulfillConstraints(date)) {
									markDateAsInvalidBecauseOf('date');
									return dateString;
								}
							}

							if (thereIsTimepicker()) {
								if (minutesDoNotMatchMinuteStep(date)) {
									markDateAsInvalidBecauseOf('date');
									return dateString;
								}
								if (hourDoesNotFulfillConstraints(date)) {
									markDateAsInvalidBecauseOf('date');
									return dateString;
								}
							}

							return date;
						} else {
							markDateAsInvalidBecauseOf('format');
							return dateString;
						}
					});

					ngModelController.$formatters.push(function(date) {
						markDateAsValid();
						if ((date === null || date === undefined) && scope.inputConstraints.required) {
							markDateAsInvalidBecauseOf('required');
						}

						return dateFilter(date, scope.inputConstraints.dateFormat);
					});
				}


				function markDateAsValid() {
					ngModelController.$setValidity('format', true);
					ngModelController.$setValidity('date', true);
					ngModelController.$setValidity('required', true);
				}

				function markDateAsInvalidBecauseOf(reason) {
					ngModelController.$setValidity(reason, false);
				}

				function thereIsDatepicker() {
					return scope.pickType === 'datetime' ||
						scope.pickType === 'date';
				}

				function thereIsTimepicker() {
					return scope.pickType === 'datetime' ||
						scope.pickType === 'time';
				}

				function dateDoesNotFulfillConstraints(date) {
					var dateMin = scope.inputConstraints.dateMin || dateTimePicker.minimumDate;
					var dateMax = scope.inputConstraints.dateMax || dateTimePicker.maximumDate;
					dateMax = utils.endOfDay(dateMax);

					return date < dateMin || date > dateMax;
				}

				function minutesDoNotMatchMinuteStep(date) {
					var minuteStep = scope.inputConstraints.minuteStep || dateTimePicker.minuteStep;
					return date.getMinutes() % minuteStep !== 0;
				}

				function hourDoesNotFulfillConstraints(date) {
					var hourMin = scope.inputConstraints.hourMin;
					if (hourMin === undefined) {
						hourMin = dateTimePicker.minimumHour;
					}
					var hourMax = scope.inputConstraints.hourMax;
					if (hourMax === undefined) {
						hourMax = dateTimePicker.maximumHour;
					}

					return date.getHours() < hourMin || date.getHours() > hourMax;
				}
			}
		};
	}

})();

(function () {
angular
		.module('pszczolkowski.dateTimePicker')
		.directive('datePicker', datePicker);

	datePicker.$inject = ['dateTimePicker'];

	function datePicker(dateTimePicker) {
		return {
			scope: {
				ngModel: '=',
				dateFormat: '@',
				dateMin: '=',
				dateMax: '='
			},
			require: 'ngModel',
			templateUrl: 'templates/dateTimePickerInput.html',
			replace: true,
			link: function (scope, element, attributes) {
				scope.pickType = 'date';
				scope.constraints = {
					dateFormat: scope.dateFormat || dateTimePicker.dateFormat,
					dateMin: scope.dateMin,
					dateMax: scope.dateMax,
					required: attributes.required,
					placeholder: attributes.placeholder,
					showWeekNumbers: (attributes.showWeekNumbers !== undefined ? true : dateTimePicker.showWeekNumbers)
				};
			},
			controller: 'DateTimePickerCtrl'
		};
	}
})();

(function () {
angular.module('pszczolkowski.dateTimePicker')
		.directive('dateTimePicker', dateTimePicker);

	dateTimePicker.$inject = ['dateTimePicker'];

	function dateTimePicker(dateTimePicker) {
		return {
			scope: {
				ngModel: '=',
				dateFormat: '@',
				dateMin: '=',
				dateMax: '=',
				hourMin: '@',
				hourMax: '@',
				minuteStep: '='
			},
			require: 'ngModel',
			templateUrl: 'templates/dateTimePickerInput.html',
			replace: true,
			link: function (scope, element, attributes) {
				scope.pickType = 'datetime';
				scope.constraints = {
					dateFormat: scope.dateFormat || dateTimePicker.dateTimeFormat,
					dateMin: scope.dateMin,
					dateMax: scope.dateMax,
					hourMin: scope.hourMin,
					hourMax: scope.hourMax,
					minuteStep: scope.minuteStep,
					required: attributes.required,
					placeholder: attributes.placeholder,
					showWeekNumbers: (attributes.showWeekNumbers !== undefined ? true : dateTimePicker.showWeekNumbers)
				};
			},
			controller: 'DateTimePickerCtrl'
		};
	}
})();

(function () {
angular
		.module('pszczolkowski.dateTimePicker')
		.directive('dtpTimer', dtpTimer);

	dtpTimer.$inject = ['dateTimePicker', 'dtpUtils'];

	function dtpTimer(dateTimePicker, utils) {
		return {
			templateUrl: function(){
				return dateTimePicker.timerTemplate;
			},
			require: 'ngModel',
			scope: {
				ngModel: '=',
				hourMin: '@',
				hourMax: '@',
				minuteStep: '@'
			},
			link: link
		};


		function link(scope) {
			scope.constraints = {
				hourMin: scope.hourMin ? parseInt(scope.hourMin, 10) : undefined,
				hourMax: scope.hourMax ? parseInt(scope.hourMax, 10) : undefined,
				minuteStep: scope.minuteStep ? parseInt(scope.minuteStep, 10) : dateTimePicker.minuteStep
			};
			scope.ngModel = scope.ngModel || new Date();
			scope.hours = [];
			scope.minutes = [];
			scope.selectedTime = {
				hour: scope.ngModel.getHours(),
				minute: scope.ngModel.getMinutes()
			};
			scope.minusHour = minusHour;
			scope.plusHour = plusHour;
			scope.minusMinute = minusMinute;
			scope.plusMinute = plusMinute;
			scope.setHour = setHour;
			scope.setMinute = setMinute;

			if (scope.constraints.hourMin && scope.constraints.hourMax && scope.constraints.hourMin > scope.constraints.hourMax) {
				throw 'Minimum hour constraint can\'t be grater than maximum hour constraint';
			}

			roundTimeToFulfillConstraints();
			generateHours();
			generateMinutes();


			function roundTimeToFulfillConstraints() {
				var date = scope.ngModel || new Date();
				var hour = date.getHours();

				if (scope.constraints.hourMin !== undefined && hour < scope.constraints.hourMin) {
					scope.ngModel.setHours(scope.constraints.hourMin);
					scope.ngModel.setMinutes(0);
				} else if (scope.constraints.hourMax !== undefined && hour > scope.constraints.hourMax) {
					scope.ngModel.setHours(scope.constraints.hourMax);
					scope.ngModel.setMinutes(0);
				} else {
					roundTimeToMinuteStep();
				}

				synchronizeFieldsWithModel();
			}

			function roundTimeToMinuteStep() {
				scope.ngModel = utils.roundTimeToMinuteStep(scope.ngModel, scope.constraints.minuteStep);
			}

			function synchronizeFieldsWithModel() {
				scope.selectedTime.hour = scope.ngModel.getHours();
				scope.selectedTime.minute = scope.ngModel.getMinutes();
			}

			function generateHours() {
				var hourMax = scope.constraints.hourMax === undefined ? 23 : scope.constraints.hourMax;
				var hourMin = scope.constraints.hourMin === undefined ? 0 : scope.constraints.hourMin;

				for (var i = hourMax; i >= hourMin; i--) {
					scope.hours.push(i);
				}
			}

			function generateMinutes() {
				scope.minutes = [];

				if (scope.constraints.hourMax !== undefined && scope.ngModel.getHours() >= scope.constraints.hourMax) {
					scope.minutes.push(0);
				}else  {
					for (var i = 60 - scope.constraints.minuteStep; i >= 0; i -= scope.constraints.minuteStep) {
						scope.minutes.push(i);
					}
				}
			}

			function addHours(quantity) {
				setHour(scope.ngModel.getHours() + quantity);
			}

			function validateHourConstraints() {
				if (scope.constraints.hourMin !== undefined && scope.ngModel.getHours() < scope.constraints.hourMin) {
					scope.ngModel.setHours(scope.constraints.hourMin);
				} else if (scope.constraints.hourMax !== undefined && scope.ngModel.getHours() >= scope.constraints.hourMax) {
					scope.ngModel.setHours(scope.constraints.hourMax);
					scope.ngModel.setMinutes(0);
				}
			}

			function minusHour() {
				addHours(-1);
			}

			function plusHour() {
				addHours(1);
			}

			function addMinutes(quantity) {
				setMinute((scope.selectedTime.minute + quantity + 60) % 60);
			}

			function minusMinute() {
				addMinutes(-scope.constraints.minuteStep);
			}

			function plusMinute() {
				addMinutes(scope.constraints.minuteStep);
			}

			function setHour(hour) {
				scope.ngModel.setHours(hour);
				validateHourConstraints();
				synchronizeFieldsWithModel();
				generateMinutes();
			}

			function setMinute(minute) {
				scope.ngModel.setMinutes(minute);
				synchronizeFieldsWithModel();
			}
		}
	}
})();

(function () {
angular
		.module('pszczolkowski.dateTimePicker')
		.directive('dtpCalendar', dtpCalendar);

	dtpCalendar.$inject = ['dtpDay', 'dateTimePicker', 'dtpUtils'];

	function dtpCalendar(Day, dateTimePicker, utils) {
		return {
			templateUrl: function() {
				return dateTimePicker.calendarTemplate;
			},
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
			var date,
				now = new Date(),
				monthDate = scope.ngModel ? getDateWithMonthFrom(scope.ngModel) : getDateWithMonthFrom(now);
			scope.weeks = [];
			scope.dateMin = scope.dateMin || dateTimePicker.minimumDate;
			scope.dateMax = scope.dateMax || dateTimePicker.maximumDate;
			scope.today = new Day(now);
			scope.selectDay = selectDay;
			scope.goToSelectedDay = goToSelectedDay;
			scope.dateFormat = dateTimePicker.dateFormat;

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

				if (utils.isSunday(startDate)) {
					startDate.setDate(startDate.getDate() - 6);
				} else {
					startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
				}

				if (!utils.isSunday(endDate)) {
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

(function () {
angular.module('pszczolkowski.dateTimePicker')
		.directive('timePicker', timePicker);

	timePicker.$inject = ['dateTimePicker'];

	function timePicker(dateTimePicker) {
		return {
			scope: {
				ngModel: '=',
				dateFormat: '@',
				hourMin: '@',
				hourMax: '@',
				minuteStep: '='
			},
			require: 'ngModel',
			templateUrl: 'templates/dateTimePickerInput.html',
			replace: true,
			link: function (scope, element, attributes) {
				scope.pickType = 'time';
				scope.constraints = {
					dateFormat: scope.dateFormat || dateTimePicker.timeFormat,
					hourMin: scope.hourMin,
					hourMax: scope.hourMax,
					minuteStep: scope.minuteStep,
					required: attributes.required,
					placeholder: attributes.placeholder,
					showWeekNumbers: attributes.showWeekNumbers !== undefined
				};
			},
			controller: 'DateTimePickerCtrl'
		};
	}
})();

(function () {
angular
		.module('pszczolkowski.dateTimePicker')
		.filter('leadingZeros', leadingZeros);

	function leadingZeros() {
		return function (input) {
			var num = parseInt(input, 10);
			if (isNaN(num)) {
				return input;
			}

			return num < 10 ? '0' + num : '' + num;
		};
	}
})();


(function() {
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

(function() {
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

(function () {
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

angular.module('pszczolkowski.dateTimePicker').run(['$templateCache', function($templateCache) {
$templateCache.put('templates/dateTimePickerCalendar.html',
    "<div> <table id=\"datepicker-calendar\" class=\"table table-bordered text-center\"> <thead> <tr> <th ng-if=\"showWeekNumbers\"></th> <th class=\"text-center\">Mon</th> <th class=\"text-center\">Tue</th> <th class=\"text-center\">Wed</th> <th class=\"text-center\">Thu</th> <th class=\"text-center\">Fri</th> <th class=\"text-center\">Sat</th> <th class=\"text-center\">Sun</th> </tr> </thead> <tbody> <tr ng-repeat=\"week in weeks\"> <td class=\"datepicker-calendar-weekno\" ng-if=\"showWeekNumbers\"> {{week.num}} </td> <td ng-repeat=\"day in week.days\" class=\"datepicker-calendar-day\" ng-class=\"{'datepicker-other-month': day.month !== calendarMonth,\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t   'datepicker-today': today.equals(day),\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t   'datepicker-selected': day.equals(ngModel),\r" +
    "\n" +
    "\t\t\t\t\t\t\t\t\t   'datepicker-disabled': day.before(dateMin) || day.after(dateMax)}\" ng-click=\"selectDay(day)\"> {{day.day}} </td> </tr> </tbody> </table> <p class=\"datepicker-selected-day-label\"> <span ng-show=\"ngModel !== undefined\"> <a href=\"\" ng-click=\"goToSelectedDay()\"> Jump to selected day: {{ngModel | date:dateFormat}} </a> </span> <span ng-show=\"ngModel === undefined\"> No day is selected </span> </p> </div>"
  );


  $templateCache.put('templates/dateTimePickerInput.html',
    "<div class=\"input-group\" ng-form=\"inputForm\" ng-class=\"{'has-error': inputForm.$invalid}\"> <input type=\"text\" class=\"datepicker-input form-control\" ng-model=\"ngModel\" date-picker-input=\"pickType\" input-constraints=\"constraints\" placeholder=\"{{constraints.placeholder}}\"> <span class=\"input-group-btn\"> <button class=\"btn btn-default\" type=\"button\" ng-click=\"pickDate()\"> <span class=\"glyphicon glyphicon-calendar\"></span> </button> </span> </div>"
  );


  $templateCache.put('templates/dateTimePickerModal.html',
    "<div id=\"datepicker-body\" class=\"modal-body\"> <div class=\"row\" ng-if=\"pickType === 'date' || pickType === 'datetime'\"> <div class=\"col-xs-12 col-sm-7\"> <div class=\"btn-group input-group\"> <div class=\"input-group-btn\"> <button class=\"btn btn-default\" ng-click=\"minusMonth()\" ng-disabled=\"calendar.month === constraints.dateMin.getMonth() && calendar.year === constraints.dateMin.getFullYear()\"> <span class=\"glyphicon glyphicon-chevron-left\"></span> </button> </div> <div id=\"datepicker-month-select\" class=\"btn-group\" ng-init=\"allMonths[0] = {num: 0, name: 'stycz'}\"> <button type=\"button\" class=\"btn btn-default btn-block dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\"> <span ng-switch=\"calendar.month\"> <span ng-switch-when=\"0\">January</span> <span ng-switch-when=\"1\">February</span> <span ng-switch-when=\"2\">March</span> <span ng-switch-when=\"3\">April</span> <span ng-switch-when=\"4\">May</span> <span ng-switch-when=\"5\">June</span> <span ng-switch-when=\"6\">July</span> <span ng-switch-when=\"7\">August</span> <span ng-switch-when=\"8\">September</span> <span ng-switch-when=\"9\">October</span> <span ng-switch-when=\"10\">November</span> <span ng-switch-when=\"11\">December</span> </span> <span class=\"caret\"></span> </button> <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenu1\"> <li> <a href=\"\" ng-click=\"setMonth(0)\" ng-show=\"months[0]\">January</a> <a href=\"\" ng-click=\"setMonth(1)\" ng-show=\"months[0]\">February</a> <a href=\"\" ng-click=\"setMonth(2)\" ng-show=\"months[0]\">March</a> <a href=\"\" ng-click=\"setMonth(3)\" ng-show=\"months[0]\">April</a> <a href=\"\" ng-click=\"setMonth(4)\" ng-show=\"months[0]\">May</a> <a href=\"\" ng-click=\"setMonth(5)\" ng-show=\"months[0]\">June</a> <a href=\"\" ng-click=\"setMonth(6)\" ng-show=\"months[0]\">July</a> <a href=\"\" ng-click=\"setMonth(7)\" ng-show=\"months[0]\">August</a> <a href=\"\" ng-click=\"setMonth(8)\" ng-show=\"months[0]\">September</a> <a href=\"\" ng-click=\"setMonth(9)\" ng-show=\"months[0]\">October</a> <a href=\"\" ng-click=\"setMonth(10)\" ng-show=\"months[0]\">November</a> <a href=\"\" ng-click=\"setMonth(11)\" ng-show=\"months[0]\">December</a> </li> </ul> </div> <div class=\"input-group-btn\"> <button class=\"btn btn-default\" ng-click=\"plusMonth()\" ng-disabled=\"calendar.month === constraints.dateMax.getMonth() && calendar.year === constraints.dateMax.getFullYear()\"> <span class=\"glyphicon glyphicon-chevron-right\"></span> </button> </div> </div> </div> <div class=\"col-xs-12 col-sm-5\"> <div class=\"btn-group input-group\"> <div class=\"input-group-btn\"> <button class=\"btn btn-default\" ng-click=\"minusYear()\" ng-disabled=\"calendar.year === constraints.dateMin.getFullYear()\"> <span class=\"glyphicon glyphicon-chevron-left\"></span> </button> </div> <div id=\"datepicker-year-select\" class=\"btn-group\"> <button type=\"button\" class=\"btn btn-default btn-block dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\"> {{calendar.year}} <span class=\"caret\"></span> </button> <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenu1\"> <li ng-repeat=\"year in years\"> <a href=\"#\" ng-click=\"setYear(year)\">{{year}}</a> </li> </ul> </div> <div class=\"input-group-btn\"> <button class=\"btn btn-default\" ng-click=\"plusYear()\" ng-disabled=\"calendar.year === constraints.dateMax.getFullYear()\"> <span class=\"glyphicon glyphicon-chevron-right\"></span> </button> </div> </div> </div> </div> <div class=\"row\"> <div id=\"datepicker-calendar-wrapper\" class=\"col-xs-12\" ng-class=\"{'col-sm-8': pickType === 'datetime'}\" ng-if=\"pickType === 'date' || pickType === 'datetime'\"> <div dtp-calendar ng-model=\"date.selectedDay\" calendar-month=\"calendar.month\" calendar-year=\"calendar.year\" date-min=\"constraints.dateMin\" date-max=\"constraints.dateMax\" show-week-numbers=\"constraints.showWeekNumbers\"></div> </div><div id=\"datepicker-time\" class=\"col-xs-12 text-center\" ng-class=\"{'col-sm-4': pickType === 'datetime'}\" ng-if=\"pickType === 'time' || pickType === 'datetime'\"> <div dtp-timer ng-model=\"date.selectedTime\" hour-min=\"{{constraints.hourMin}}\" hour-max=\"{{constraints.hourMax}}\" minute-step=\"{{constraints.minuteStep}}\"></div> </div> </div> </div> <div class=\"modal-footer datepicker-buttons\"> <div class=\"row\"> <div class=\"col-xs-6 col-sm-2 text-left\"> <button class=\"btn btn-block btn-default\" ng-click=\"jumpToToday()\" ng-if=\"pickType === 'date' || pickType === 'datetime'\">Today </button> </div> <div class=\"col-xs-6 col-sm-2 text-left\"> <button class=\"btn btn-block btn-default\" ng-click=\"clear()\" ng-if=\"!constraints.required && (pickType === 'date' || pickType === 'datetime')\">Clear </button> </div> <div class=\"col-xs-12 col-sm-3 col-sm-offset-2\"> <button class=\"btn btn-danger btn-block\" ng-click=\"cancel()\"> <span class=\"glyphicon glyphicon-remove\"></span> Cancel </button> </div> <div class=\"col-xs-12 col-sm-3\"> <button class=\"btn btn-success btn-block\" ng-click=\"confirm()\"> <span class=\"glyphicon glyphicon-ok\"></span> Confirm </button> </div> </div> </div>"
  );


  $templateCache.put('templates/dateTimePickerTimer.html',
    "<div id=\"datepicker-timer\"> <div class=\"btn-group-vertical\" role=\"group\"> <button class=\"btn btn-default\" ng-click=\"plusHour()\" ng-disabled=\"selectedTime.hour === constraints.hourMax\"> <span class=\"glyphicon glyphicon-chevron-up\"></span> </button> <div class=\"datepicker-time-view btn-group\"> <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\"> {{selectedTime.hour}} <span class=\"caret\"></span> </button> <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenu1\"> <li ng-repeat=\"hour in hours\"> <a href=\"#\" ng-click=\"setHour(hour)\">{{hour}}</a> </li> </ul> </div> <button class=\"btn btn-default\" ng-click=\"minusHour()\" ng-disabled=\"selectedTime.hour === constraints.hourMin\"> <span class=\"glyphicon glyphicon-chevron-down\"></span> </button> </div> <span>:</span> <div class=\"btn-group-vertical\"> <button class=\"btn btn-default\" ng-click=\"plusMinute()\" ng-disabled=\"selectedTime.hour === constraints.hourMax\"> <span class=\"glyphicon glyphicon-chevron-up\"></span> </button> <div class=\"datepicker-time-view btn-group\"> <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\" ng-disabled=\"selectedTime.hour === constraints.hourMax\"> {{selectedTime.minute | leadingZeros}} <span class=\"caret\"></span> </button> <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenu1\"> <li ng-repeat=\"minute in minutes\"> <a href=\"#\" ng-click=\"setMinute(minute)\">{{minute | leadingZeros}}</a> </li> </ul> </div> <button class=\"btn btn-default\" ng-click=\"minusMinute()\" ng-disabled=\"selectedTime.hour === constraints.hourMax\"> <span class=\"glyphicon glyphicon-chevron-down\"></span> </button> </div> </div>"
  );

}]);
})(angular);