(function () {
	'use strict';

	angular
		.module('pszczolkowski.dateTimePicker')
		.controller('DateTimePickerCtrl', DateTimePickerCtrl);

	DateTimePickerCtrl.$inject = ['$scope', '$timeout', '$parse', '$modal', 'dateTimePicker', 'dtpUtils'];

	function DateTimePickerCtrl($scope, $timeout, $parse, $modal, dateTimePicker, utils) {
		$scope.dateToEdit = null;
		$scope.pickDate = pickDate;
		$scope.onManualChange = onManualChange;

		$timeout(function () {
			if ($scope.ngModel) {
				$scope.ngModel = utils.roundTimeToMinuteStep($scope.ngModel, $scope.constraints.minuteStep || dateTimePicker.minuteStep);
				$scope.dateToEdit = new Date($scope.ngModel.getTime());
			} else {
				$scope.dateToEdit = null;
			}
		});
		
		// it's necessary to detect external changes to model
		// so valid date could be displayed
		$scope.$watch('ngModel', function (ngModel) {
			$scope.dateToEdit = ngModel;
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
					
					$scope.onChange({$value: $scope.ngModel});
				}
			});
		}
		
		function onManualChange() {
			if (typeof $scope.dateToEdit === 'string') {
				$scope.dateToEdit = $scope.ngModel;
			} else if ($scope.ngModel !== $scope.dateToEdit) {
				if (!$scope.ngModel || !$scope.dateToEdit || $scope.ngModel.getTime() !== $scope.dateToEdit.getTime()) {
					$scope.ngModel = $scope.dateToEdit;
					$scope.onChange({$value: $scope.ngModel});
				}
			}
		}
	}
})();
