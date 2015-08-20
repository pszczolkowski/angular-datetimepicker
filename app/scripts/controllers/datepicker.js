(function(){
	'use strict';

	var MONTHS = [
		{num: 0, month: 'January'},
		{num: 1, month: 'February'},
		{num: 2, month: 'March'},
		{num: 3, month: 'April'},
		{num: 4, month: 'May'},
		{num: 5, month: 'June'},
		{num: 6, month: 'July'},
		{num: 7, month: 'August'},
		{num: 8, month: 'September'},
		{num: 9, month: 'October'},
		{num: 10, month: 'November'},
		{num: 11, month: 'December'}];

	angular
		.module('pszczolkowski.datePicker')
		.controller('DatePickerCtrl' , DatePickerCtrl);

	DatePickerCtrl.$inject = ['$scope', '$modalInstance', 'datePickerConfig', 'pickType', 'selectedDate', 'constraints'];

	function DatePickerCtrl($scope, $modalInstance, datePickerConfig, pickType, selectedDate, constraints) {
		constraints.dateMin = constraints.dateMin || datePickerConfig.minimumDate;
		constraints.dateMax = constraints.dateMax || datePickerConfig.maximumDate;
		if (constraints.hourMin === undefined) {
			constraints.hourMin = datePickerConfig.minimumHour;
		}
		if (constraints.hourMax === undefined) {
			constraints.hourMax = datePickerConfig.maximumHour;
		}
		if (constraints.hourMin > constraints.hourMax) {
			throw 'Minimum hour constraint can\'t be grater than maximum hour constraint';
		}

		$scope.pickType = pickType;
		$scope.today = new Day(new Date());
		$scope.selectedDay = isDaySelected() ? new Day(selectedDate) : undefined;
		$scope.selectedTime = {
			hour: roundHourToFulfillConstraints(selectedDate, constraints.hourMin, constraints.hourMax),
			minute: roundMinute(selectedDate, constraints.minuteStep)
		};
		$scope.date = new Calendar($scope.selectedDay, constraints.dateMin, constraints.dateMax);
		$scope.minimumDate = constraints.dateMin;
		$scope.maximumDate = constraints.dateMax;
		$scope.years = [];
		$scope.months = [];
		$scope.weeks = [];
		$scope.hours = [];
		$scope.minutes = [];
		$scope.monthChange = monthChange;
		$scope.yearChange = yearChange;
		$scope.selectDay = selectDay;
		$scope.selectToday = selectToday;
		$scope.clear = clear;
		$scope.confirm = confirm;
		$scope.cancel = cancel;
		$scope.minusHour = minusHour;
		$scope.plusHour = plusHour;
		$scope.minusMinute = minusMinute;
		$scope.plusMinute = plusMinute;

		updateMonths();
		for (var i = Math.min($scope.today.year + 5, $scope.date.maximumDate.getFullYear()) ; i >= $scope.date.minimumDate.getFullYear() ; i--) {
			$scope.years.push(i);
		}
		for (var i = constraints.hourMax; i >= constraints.hourMin; i--) {
			$scope.hours.push(i);
		}
		for (var i = 60 - constraints.minuteStep; i >= 0 ; i -= constraints.minuteStep) {
			$scope.minutes.push(i);
		}

		prepareWeeksForView();
		$scope.date.onChange(function() {
			prepareWeeksForView();
			updateYears();
			updateMonths();
		});

		function roundHourToFulfillConstraints(date, hourMin, hourMax) {
			date = date || new Date();
			var hour = date.getHours();
			if (hour < hourMin) {
				hour = hourMin;
			} else if (hour > hourMax) {
				hour = hourMax;
			}

			return hour;
		}

		function isDaySelected() {
			return selectedDate !== undefined && typeof selectedDate !== 'string';
		}

		function monthChange() {
			$scope.date.setMonth(parseInt($scope.date.month, 10));
		}

		function yearChange() {
			$scope.date.setYear(parseInt($scope.date.year, 10));
		}

		function updateYears() {
			if ($scope.date.year > $scope.years[0]) {
				for (var year = $scope.years[0] ; year <= $scope.date.year; year++) {
					$scope.years.unshift(year);
				}
			}
		}

		function updateMonths() {
			$scope.months = [];

			for (var i = 0; i < MONTHS.length; i++) {
				if ($scope.date.year === constraints.dateMin.getFullYear() && MONTHS[i].num < constraints.dateMin.getMonth()) {
					continue;
				}
				if ($scope.date.year === constraints.dateMax.getFullYear() && MONTHS[i].num > constraints.dateMax.getMonth()) {
					continue
				}

				$scope.months.push(MONTHS[i]);
			}
		}

		function prepareWeeksForView() {
			var startDate = new Date();
			var week = [];
			var endDate = new Date();

			$scope.weeks = [];

			startDate = new Date($scope.date.year, $scope.date.month, 1);
			if (isSunday(startDate)) {
				startDate.setDate(startDate.getDate() - 6);
			} else {
				startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
			}

			endDate = new Date($scope.date.year, $scope.date.month + 1, 0);
			if (!isSunday(endDate)) {
				endDate.setDate(endDate.getDate() + 7 - endDate.getDay());
			}

			while (startDate <= endDate) {
				if (startDate.getDay() === 1) {
					week = [];
					$scope.weeks.push(week);
				}

				week.push(new Day(startDate));
				startDate.setDate(startDate.getDate() + 1);
			}
		}

		function isSunday(date) {
			return date.getDay() === 0;
		}

		function selectDay(day) {
			if (day.before($scope.minimumDate) || day.after($scope.maximumDate)) {
				return;
			}

			$scope.selectedDay = day;
			if ($scope.selectedDay.month !== $scope.date.month) {
				$scope.date.setMonth($scope.selectedDay.month);
			}
		}

		function selectToday() {
			$scope.selectedDay = {};
			$scope.selectedDay.day = $scope.today.day;
			$scope.selectedDay.month = $scope.today.month;
			$scope.selectedDay.year = $scope.today.year;

			$scope.date.setMonth($scope.selectedDay.month);
			$scope.date.setYear($scope.selectedDay.year);
		}

		function clear() {
			$scope.selectedDay = undefined;
		}

		function confirm() {
			var selectedDate = null;

			if ($scope.selectedDay !== undefined) {
				selectedDate = new Date(
					$scope.selectedDay.year,
					$scope.selectedDay.month,
					$scope.selectedDay.day,
					$scope.selectedTime.hour,
					$scope.selectedTime.minute);
			}

			$modalInstance.close(selectedDate);
		}

		function addHours(quantity) {
			$scope.selectedTime.hour = ($scope.selectedTime.hour + quantity + 24) % 24;
			validateHourConstraints();
		}

		function validateHourConstraints() {
			if ($scope.selectedTime.hour < constraints.hourMin) {
				$scope.selectedTime.hour = constraints.hourMin;
			} else if ($scope.selectedTime.hour > constraints.hourMax) {
				$scope.selectedTime.hour = constraints.hourMax;
			}
		}

		function minusHour() {
			addHours(-1);
		}

		function plusHour() {
			addHours(1);
		}

		function addMinutes(quantity) {
			$scope.selectedTime.minute = ($scope.selectedTime.minute + quantity + 60) % 60;
		}

		function minusMinute() {
			addMinutes(-constraints.minuteStep);
		}

		function plusMinute() {
			addMinutes(constraints.minuteStep);
		}

		function roundMinute(date, minuteStep) {
			date = date || new Date();
			var minute = date.getMinutes();
			var rounded = minuteStep * Math.round(minute / minuteStep);

			return rounded > 59 ? 0 : rounded;
		}

		function cancel() {
			$modalInstance.dismiss('cancel');
		}
	}

	function Calendar(forDay, minimumDate, maximumDate) {
		var date = getDate(forDay);
		var self = this;
		var listeners = [];

		this.month = date.getMonth();
		this.year = date.getFullYear();
		this.minimumDate = minimumDate;
		this.maximumDate = maximumDate;
		this.minusMonth = minusMonth;
		this.plusMonth = plusMonth;
		this.setMonth = setMonth;
		this.minusYear = minusYear;
		this.plusYear = plusYear;
		this.setYear = setYear;
		this.onChange = onChange;


		function getDate(forDay) {
			if (forDay === undefined) {
				var date = new Date();
				date.setDate(1);

				return date;
			} else {
				return new Date(forDay.year, forDay.month, 1);
			}
		}

		function minusMonth() {
			addMonths(-1);
		}

		function plusMonth() {
			addMonths(1);
		}

		function synchronizeFieldsWithDate() {
			self.month = date.getMonth();
			self.year = date.getFullYear();
		}

		function addMonths(quantity) {
			date.setMonth(date.getMonth() + quantity);

			validateDateConstraints();
			synchronizeFieldsWithDate();
			changed();
		}

		function setMonth(monthNumber) {
			date.setMonth(monthNumber);
			synchronizeFieldsWithDate();
			changed();
		}

		function minusYear() {
			addYears(-1);
		}

		function plusYear() {
			addYears(1);
		}

		function validateDateConstraints() {
			if (date < self.minimumDate) {
				date.setTime(self.minimumDate.getTime());
			} else if (date > self.maximumDate.getTime()) {
				date.setTime(self.maximumDate.getTime());
			}
		}

		function addYears(quantity) {
			date.setYear(date.getFullYear() + quantity);

			validateDateConstraints();
			synchronizeFieldsWithDate();
			changed();
		}

		function setYear(year) {
			date.setFullYear(year);
			synchronizeFieldsWithDate();
			changed();
		}

		function onChange(listener) {
			listeners.push(listener);
		}

		function changed() {
			for (var i = 0; i < listeners.length; i++) {
				listeners[i](date);
			}
		}
	}

	function Day(date) {
		this.day = date.getDate();
		this.month = date.getMonth();
		this.year = date.getFullYear();
	}
	Day.prototype.equals = function(day) {
		if (!day) {
			return false;
		}

		return this.day === day.day &&
			this.month === day.month &&
			this.year === day.year;
	}
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
	}
})();
