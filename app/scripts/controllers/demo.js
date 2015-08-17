(function () {
	'use strict';

	angular
		.module('pszczolkowski.datePicker')
		.controller('DemoCtrl', DemoCtrl);

	DemoCtrl.$inject = ['$scope'];

	function DemoCtrl($scope) {
		$scope.date = new Date();
	}
})();

