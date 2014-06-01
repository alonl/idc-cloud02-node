'use strict';

var StudentsController = function ($scope, $http) {
    $scope.student = {};
    $scope.deleteNotification = false;
    $scope.editMode = false;

    $scope.fetchList = function () {
        $http.get('students').success(function (students) {
            $scope.studentsList = students;
        });
    }

    $scope.addStudent = function (student) {

        $scope.resetError();

        $http.post('students', student).success(function () {
            $scope.fetchList();
            $scope.resetForm();
        }).error(function () {
                $scope.setError('Could not add.');
            });
    }

    $scope.updateStudent = function (student) {
        $scope.resetError();

        $http.put('students', student).success(function () {
            $scope.fetchList();
            $scope.resetForm();
        }).error(function () {
                $scope.setError('Could not update.');
            });
    }

    $scope.editStudent = function (student) {
        $scope.resetError();
        $scope.student = student;
        $scope.editMode = true;
    }

    $scope.remove = function (id) {
        $scope.resetError();

        $http.delete('students/' + id).success(function () {
            $scope.fetchList();
        }).error(function () {
                $scope.setError('Could not remove student');
            });
        $scope.showDeleteNotification(false);
    }

$scope.resetForm = function () {
        $scope.resetError();
        $scope.student = {};
        $scope.editMode = false;
    }

    $scope.resetError = function () {
        $scope.error = false;
        $scope.errorMessage = '';
    }

    $scope.setError = function (message) {
        $scope.error = true;
        $scope.errorMessage = message;
    }

    $scope.showDeleteNotification = function (show, id) {
        if (show === true) {
            $scope.deleteNotification = true;
        } else {
            $scope.deleteNotification = false;
        }
        $scope.deleteId = id;
    };

    $scope.fetchList();

    $scope.predicate = 'studentPattern';
}