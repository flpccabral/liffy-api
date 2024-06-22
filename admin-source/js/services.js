function adminAPI ($http) {
	return {
		login: function (data) {
			return $http.post(apiUrl + '/login', data);
		},
		requestCode: function () {
			return $http.post(apiUrl + '/request-code');
		}
	};
};

function driversAPI ($http) {
	return {
		get: function () {
			return $http.get(apiUrl + '/drivers');
		},
		put: function (data) {
			return $http.put(apiUrl + '/drivers/' + data.id, data);
		},
		getId: function (id) {
			return $http.get(apiUrl + '/drivers/' + id);
		},
		delete: function (id) {
			return $http.delete(apiUrl + '/drivers/' + id);
		}
	};
};

function usersAPI ($http) {
	return {
		get: function () {
			return $http.get(apiUrl + '/users');
		},
		put: function (data) {
			return $http.put(apiUrl + '/users/' + data.id, data);
		},
		getId: function (id) {
			return $http.get(apiUrl + '/users/' + id);
		},
		delete: function (id) {
			return $http.delete(apiUrl + '/users/' + id);
		}
	};
};

function bugsAPI ($http) {
	return {
		get: function () {
			return $http.get(apiUrl + '/bugs');
		},
		delete: function (id) {
			return $http.delete(apiUrl + '/bugs/' + id);
		}
	}
};

function promotionalCodesAPI ($http) {
	return {
		post: function (data) {
			return $http.post(apiUrl + '/promotional-codes', data);
		},
		get: function () {
			return $http.get(apiUrl + '/promotional-codes');
		},
		delete: function (id) {
			return $http.delete(apiUrl + '/promotional-codes/' + id);
		}
	};
};