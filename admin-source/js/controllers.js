function signCtrl ($rootScope, $mdToast, adminAPI, $location) {
	const vm = this;
	vm.login = function (data) {
		vm.signFormButtonDisabled = true;
		adminAPI.login(data).then(function success () {
			window.sessionStorage.setItem('admin', true);
			$rootScope.adminLogged = true;
			$location.path('/drivers');
		}, function error (data) {
			vm.signFormButtonDisabled = false;
			if (data.status === 400 && data.data === 'Invalid code.') {
				$mdToast.show($mdToast.simple()
					.textContent('Acesso não autorizado')
					.hideDelay(1500)
				);
			};
		});
	};
	vm.requestCode = function () {
		vm.requestCodeButtonDisabled = true;
		adminAPI.requestCode().then(function success () {
			vm.requestCodeButtonDisabled = false;
			$mdToast.show($mdToast.simple()
				.textContent('Código enviado com sucesso')
				.hideDelay(1500)
			);
		}, function error () {
			vm.requestCodeButtonDisabled = false;
		});
	};
};

function navCtrl ($mdSidenav, $location, $rootScope, $route) {
	const vm = this;
	vm.route = $route;
	vm.toggleSidenav = function () {
		$mdSidenav('sidenav').toggle();
	};
	vm.logout = function () {
		window.sessionStorage.removeItem('admin');
		$rootScope.adminLogged = false;
		$location.path('/');
	};
};

function driversCtrl (driversAPI, $mdDialog, $rootScope, $mdToast) {
	const vm = this;
	driversAPI.get().then(function success (drivers) {
		vm.drivers = drivers.data;
		vm.driversLoaded = true;
	});
	vm.deleteDriver = function (id, e) {
		$mdDialog.show($mdDialog.confirm()
			.title('Deletar motorista?')
			.textContent('Esta ação não pode ser desfeita, você tem certeza?')
			.ok('Sim')
			.cancel('Não')
			.theme($rootScope.panelTheme)
			.targetEvent(e)
		).then(function () {
			vm.drivers = [];
			vm.driversLoaded = false;
			driversAPI.delete(id).then(function success (drivers) {
				vm.drivers = drivers.data;
				vm.driversLoaded = true;
				$mdToast.show($mdToast.simple()
					.textContent('Motorista apagado com sucesso')
					.hideDelay(1500)
				);
			});
		}, function () {
			$mdDialog.hide();
		});
	};
};

function editDriverCtrl (driversAPI, $routeParams, $location, $mdToast) {
	const vm = this;
	driversAPI.getId($routeParams.id).then(function success (driver) {
		if (driver.data) {
			vm.driver = driver.data;
			vm.driver.active === true 
			? vm.driver.active = "true"
			: vm.driver.active = "false";
		} else {
			$mdToast.show($mdToast.simple()
				.textContent('Motorista não encontrado')
				.hideDelay(1500)
			);
			$location.path('/drivers');
		};
	});
	vm.saveData = function (data) {
		vm.driverEditButtonDisabled = true;
		driversAPI.put(data).then(function success () {
			$mdToast.show($mdToast.simple()
				.textContent('Dados salvos com sucesso')
				.hideDelay(1500)
			);
			$location.path('/drivers');
		});
	};
};

function usersCtrl (usersAPI, $mdDialog, $rootScope, $mdToast) {
	const vm = this;
	usersAPI.get().then(function success (users) {
		vm.users = users.data;
		vm.usersLoaded = true;
	});
	vm.deleteUser = function (id, e) {
		$mdDialog.show($mdDialog.confirm()
			.title('Deletar usuário?')
			.textContent('Esta ação não pode ser desfeita, você tem certeza?')
			.ok('Sim')
			.cancel('Não')
			.theme($rootScope.panelTheme)
			.targetEvent(e)
		).then(function () {
			vm.users = [];
			vm.usersLoaded = false;
			usersAPI.delete(id).then(function success (users) {
				vm.users = users.data;
				vm.usersLoaded = true;
				$mdToast.show($mdToast.simple()
					.textContent('Usuário apagado com sucesso')
					.hideDelay(1500)
				);
			});
		}, function () {
			$mdDialog.hide();
		});
	};
};

function editUserCtrl (usersAPI, $routeParams, $location, $mdToast) {
	const vm = this;
	usersAPI.getId($routeParams.id).then(function success (user) {
		if (user.data) {
			vm.user = user.data;
			vm.user.blocked === true 
			? vm.user.blocked = "true"
			: vm.user.blocked = "false";
		} else {
			$mdToast.show($mdToast.simple()
				.textContent('Usuário não encontrado')
				.hideDelay(1500)
			);
			$location.path('/users');
		};
	});
	vm.saveData = function (data) {
		vm.userEditButtonDisabled = true;
		usersAPI.put(data).then(function success () {
			$mdToast.show($mdToast.simple()
				.textContent('Dados salvos com sucesso')
				.hideDelay(1500)
			);
			$location.path('/users');
		});
	};
};

function bugsCtrl (bugsAPI, $mdDialog, $rootScope, $mdToast) {
	const vm = this;
	bugsAPI.get().then(function success (bugs) {
		vm.bugs = bugs.data;
		vm.bugsLoaded = true;
	});
	vm.deleteBug = function (id, e) {
		$mdDialog.show($mdDialog.confirm()
			.title('Deletar bug?')
			.textContent('Esta ação não pode ser desfeita, você tem certeza?')
			.ok('Sim')
			.cancel('Não')
			.theme($rootScope.panelTheme)
			.targetEvent(e)
		).then(function () {
			vm.bugs = [];
			vm.bugsLoaded = false;
			bugsAPI.delete(id).then(function success (bugs) {
				vm.bugs = bugs.data;
				vm.bugsLoaded = true;
				$mdToast.show($mdToast.simple()
					.textContent('Bug excluído com sucesso')
					.hideDelay(1500)
				);
			});
		}, function () {
			$mdDialog.hide();
		});
	};
};

function settingsCtrl ($rootScope, $mdToast) {
	const vm = this;
	vm.changeTheme = function (theme) {
		$rootScope.panelTheme = theme;
		window.localStorage.setItem('panelTheme', theme);
		$mdToast.show($mdToast.simple()
			.textContent('Configurações salvas com sucesso')
			.hideDelay(1500)
		);
	};
};

function promotionalCodesCtrl (promotionalCodesAPI, $mdDialog, $rootScope, $mdToast) {
	const vm = this;
	promotionalCodesAPI.get().then(function success (codes) {
		vm.codes = codes.data;
		vm.codesLoaded = true;
	});
	vm.deleteCode = function (id, e) {
		$mdDialog.show($mdDialog.confirm()
			.title('Deletar código?')
			.textContent('Esta ação não pode ser desfeita, você tem certeza?')
			.ok('Sim')
			.cancel('Não')
			.theme($rootScope.panelTheme)
			.targetEvent(e)
		).then(function () {
			vm.codes = [];
			vm.codesLoaded = false;
			promotionalCodesAPI.delete(id).then(function success (codes) {
				vm.codes = codes.data;
				vm.codesLoaded = true;
				$mdToast.show($mdToast.simple()
					.textContent('Código excluído com sucesso')
					.hideDelay(1500)
				);
			});
		}, function () {
			$mdDialog.hide();
		});
	};
};

function addPromotionalCodeCtrl (promotionalCodesAPI, $location, $mdToast) {
	const vm = this;
	vm.create = function (data) {
		vm.createCodeButtonDisabled = true;
		promotionalCodesAPI.post(data).then(function success () {
			$mdToast.show($mdToast.simple()
				.textContent('Código criado com sucesso')
				.hideDelay(1500)
			);
			$location.path('/promotional-codes');
		});
	};
};