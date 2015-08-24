(function () {
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker')
		.controller('DateTimePickerCtrl', DateTimePickerCtrl);

	DateTimePickerCtrl.$inject = ['$scope', '$modal', 'dateTimePickerConfig'];

	function DateTimePickerCtrl($scope, $modal, dateTimePickerConfig) {
		$scope.pickDate = pickDate;

		function pickDate() {
			var modalInstance = $modal.open({
				size: 'md',
				templateUrl: 'templates/dateTimePickerModal.html',
				controller: 'DateTimePickerModalCtrl',
				resolve: {
					pickType: function () {
						return $scope.pickType;
					},
					selectedDate: function () {
						return $scope.ngModel;
					},
					constraints: function () {
						return {
							minuteStep: $scope.minuteStep,
							dateMin: $scope.dateMin,
							dateMax: $scope.dateMax,
							hourMin: $scope.hourMin,
							hourMax: $scope.hourMax,
							required: $scope.required,
							showWeekNumbers: $scope.showWeekNumbers
						};
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
