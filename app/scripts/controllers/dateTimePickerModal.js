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
		.module('pszczolkowski.dateTimePicker')
		.controller('DateTimePickerModalCtrl' , DateTimePickerModalCtrl);

	DateTimePickerModalCtrl.$inject = ['$scope', '$modalInstance', 'dateTimePickerConfig', 'pickType', 'selectedDate', 'constraints'];

	function DateTimePickerModalCtrl($scope, $modalInstance, dateTimePickerConfig, pickType, selectedDate, constraints) {
		var now = new Date();

		if (!(selectedDate instanceof Date)) {
			selectedDate = new Date();
		}

		constraints.dateMin = constraints.dateMin || dateTimePickerConfig.minimumDate;
		constraints.dateMax = constraints.dateMax || dateTimePickerConfig.maximumDate;

		$scope.pickType = pickType;
		$scope.calendar = {
			month: 	selectedDate ? selectedDate.getMonth() : now.getMonth(),
			year: selectedDate ? selectedDate.getFullYear() : now.getFullYear(),
			selectedDayDate: selectedDate ? selectedDate : new Date()
		};
		$scope.date = {
			selectedDay: selectedDate ? new Date(selectedDate.getTime()) : new Date(),
			selectedTime: selectedDate ? new Date(selectedDate.getTime()) : new Date()
		};
		$scope.allMonths = MONTHS;
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
		$scope.selectToday = selectToday;
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
			$scope.calendar.month = month.num;
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

			if ($scope.date.selectedDay !== undefined) {
				returnDate = new Date();
				returnDate.setTime($scope.date.selectedDay.getTime());
				returnDate.setHours($scope.date.selectedTime.getHours());
				returnDate.setMinutes($scope.date.selectedTime.getMinutes());
			}

			$modalInstance.close(returnDate);
		}

		function cancel() {
			$modalInstance.dismiss('cancel');
		}

		function selectToday() {
			var now = new Date();
			$scope.date.selectedDay = now;
			$scope.calendar.month = now.getMonth();
			$scope.calendar.year = now.getFullYear();
		}

		function clear() {
			$scope.date.selectedDay = undefined;
			$scope.date.selectedTime = undefined;
		}
	}
})();
