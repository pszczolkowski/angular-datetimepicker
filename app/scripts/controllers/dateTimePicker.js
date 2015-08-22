(function () {
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker')
		.controller('DateTimePickerCtrl', DateTimePickerCtrl);

	DateTimePickerCtrl.$inject = ['$scope', '$modal', 'dateTimePickerConfig'];

	function DateTimePickerCtrl($scope, $modal, dateTimePickerConfig) {
		$scope.minuteStep = $scope.minuteStep || dateTimePickerConfig.minuteStep;
		$scope.pickDate = pickDate;

		var hourMin = $scope.hourMin ? parseInt($scope.hourMin, 10) : undefined;
		var hourMax = $scope.hourMax ? parseInt($scope.hourMax, 10) : undefined;

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
							hourMin: hourMin,
							hourMax: hourMax
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
