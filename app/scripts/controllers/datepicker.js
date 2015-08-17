(function(){
	'use strict';

	angular
		.module('pszczolkowski.datePicker')
		.controller('DatePickerCtrl' , DatePickerCtrl);

	DatePickerCtrl.$inject = ['$scope', '$modalInstance', 'selectedDay'];

	function DatePickerCtrl($scope, $modalInstance, selectedDay) {
		$scope.today = new Day(new Date());
		$scope.selectedDay = isDaySelected() ? new Day(selectedDay) : undefined;
		$scope.selectedTime = {
			hour: (new Date()).getHours(),
			minute: roundMinute(new Date(), 15)
		};
		$scope.date = new Calendar($scope.selectedDay);
		$scope.years = [];
		$scope.months = [
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
		$scope.weeks = [];
		$scope.hours = [];
		$scope.minutes = [];
		$scope.monthChange = monthChange;
		$scope.yearChange = yearChange;
		$scope.selectDay = selectDay;
		$scope.selectToday = selectToday
		$scope.clear = clear;
		$scope.pick = pick;
		$scope.minusHour = minusHour;
		$scope.plusHour = plusHour;
		$scope.minusMinute = minusMinute;
		$scope.plusMinute = plusMinute;


		for (var i = $scope.today.year + 5 ; i >= 1900 ; i--) {
			$scope.years.push(i);
		}
		for (var i = 23; i >= 0; i--) {
			$scope.hours.push(i);
		}
		for (var i = 45; i >= 0 ; i -= 15) {
			$scope.minutes.push(i);
		}

		prepareWeeksForView();
		$scope.date.onChange(function() {
			prepareWeeksForView();
			updateYears();
		});

		function isDaySelected() {
			return selectedDay !== undefined && typeof selectedDay !== 'string';
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

		function pick() {
			var selectedDate = null;

			if ($scope.selectedDay !== undefined) {
				selectedDate = new Date(
					$scope.selectedDay.year,
					$scope.selectedDay.month,
					$scope.selectedDay.day);
			}

			$modalInstance.close(selectedDate);
		}

		function addHours(quantity) {
			$scope.selectedTime.hour = ($scope.selectedTime.hour + quantity + 24) % 24;
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
			addMinutes(-15);
		}

		function plusMinute() {
			addMinutes(15);
		}

		function roundMinute(date, minuteStep) {
			var minute = date.getMinutes();
			var rounded = minuteStep * Math.round(minute / minuteStep);

			return rounded > 59 ? 0 : rounded;
		}
	}

	function Calendar(forDay) {
		var date = getDate(forDay);
		var self = this;

		this.month = date.getMonth();
		this.year = date.getFullYear();

		this.minusMonth = minusMonth;
		this.plusMonth = plusMonth;
		this.setMonth = setMonth;
		this.minusYear = minusYear;
		this.plusYear = plusYear;
		this.setYear = setYear;
		this.onChange = onChange;

		var listeners = [];


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

		function addYears(quantity) {
			date.setYear(date.getFullYear() + quantity);
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
})();
