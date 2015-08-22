(function(){
	'use strict';

	var MONTHS = [
		{num: 0, name: 'January'},
		{num: 1, name: 'February'},
		{num: 2, name: 'March'},
		{num: 3, name: 'April'},
		{num: 4, name: 'May'},
		{num: 5, name: 'June'},
		{num: 6, name: 'July'},
		{num: 7, name: 'August'},
		{num: 8, name: 'September'},
		{num: 9, name: 'October'},
		{num: 10, name: 'November'},
		{num: 11, name: 'December'}];

	angular
		.module('pszczolkowski.datePicker')
		.controller('DatePickerCtrl' , DatePickerCtrl);

	DatePickerCtrl.$inject = ['$scope', '$modalInstance', 'datePickerConfig', 'pickType', 'selectedDate', 'constraints', 'Day'];

	function DatePickerCtrl($scope, $modalInstance, datePickerConfig, pickType, selectedDate, constraints, Day) {
		var now = new Date();

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
		$scope.calendar = {
			month: 	selectedDate ? selectedDate.getMonth() : now.getMonth(),
			year: selectedDate ? selectedDate.getFullYear() : now.getFullYear(),
			selectedDayDate: selectedDate ? selectedDate : new Date()
		};
		$scope.months = [];
		$scope.years = [];
		$scope.minusMonth = minusMonth;
		$scope.plusMonth = plusMonth;
		$scope.plusYear = plusYear;
		$scope.minusYear = minusYear;
		$scope.confirm = confirm;
		$scope.cancel = cancel;
		$scope.selectToday = selectToday;
		$scope.clear = clear;
		$scope.constraints = {
			dateMin: constraints.dateMin,
			dateMax: constraints.dateMax
		};
		$scope.selectedTime = {
			hour: roundHourToFulfillConstraints(selectedDate, constraints.hourMin, constraints.hourMax),
			minute: roundMinute(selectedDate, constraints.minuteStep)
		};
		$scope.hours = [];
		$scope.minutes = [];
		$scope.minusHour = minusHour;
		$scope.plusHour = plusHour;
		$scope.minusMinute = minusMinute;
		$scope.plusMinute = plusMinute;

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

		function generateMonths() {
			$scope.months = [];

			for (var i = 0; i < MONTHS.length; i++) {
				if ($scope.calendar.year === constraints.dateMin.getFullYear() && MONTHS[i].num < constraints.dateMin.getMonth()) {
					continue;
				}
				if ($scope.calendar.year === constraints.dateMax.getFullYear() && MONTHS[i].num > constraints.dateMax.getMonth()) {
					continue;
				}

				$scope.months.push(MONTHS[i]);
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

			if ($scope.calendar.selectedDayDate !== undefined) {
				returnDate = new Date();
				returnDate.setTime($scope.calendar.selectedDayDate.getTime());
				returnDate.setHours($scope.selectedTime.hour);
				returnDate.setMinutes($scope.selectedTime.minute);
			}

			$modalInstance.close(returnDate);
		}

		function cancel() {
			$modalInstance.dismiss('cancel');
		}

		for (var i = constraints.hourMax; i >= constraints.hourMin; i--) {
			$scope.hours.push(i);
		}
		for (var i = 60 - constraints.minuteStep; i >= 0 ; i -= constraints.minuteStep) {
			$scope.minutes.push(i);
		}

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

		function selectToday() {
			var now = new Date();
			$scope.calendar.selectedDayDate = now;
			$scope.calendar.month = now.getMonth();
			$scope.calendar.year = now.getFullYear();
		}

		function clear() {
			$scope.calendar.selectedDayDate = undefined;
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
	}
})();
