const geolib = require('geolib');

module.exports = function (io, models) {
	const drivers = [];
	const spots = {};
	const defaultSpots = {};
	const executiveSpots = {};

	io.on('connection', function (socket) {

		socket.on('driversRequest', function () {
			io.to(socket.id).emit('drivers', drivers);
		});

		socket.on('driverOnline', function (driverInfo) {
			driverInfo.socketId = socket.id;
			drivers.push(driverInfo);
			spots[socket.id] = {
				latitude: driverInfo.position[0],
				longitude: driverInfo.position[1]
			};
			if (driverInfo.type === 'default') {
				defaultSpots[socket.id] = {
					latitude: driverInfo.position[0],
					longitude: driverInfo.position[1]
				};
			} else {
				executiveSpots[socket.id] = {
					latitude: driverInfo.position[0],
					longitude: driverInfo.position[1]
				};
			};
		});

		socket.on('driverOffline', function (id) {
			drivers.map(function (driver, i) {
				if (driver.id === id) {
					if (driver.type === 'default') {
						delete defaultSpots[socket.id];
					} else {
						delete executiveSpots[socket.id];
					};
					drivers.splice(i, 1);
					delete spots[socket.id];
				};
			});
		});

		socket.on('travel', function (travel) {
			if (travel.type === 'default') {
				if (Object.keys(defaultSpots).length) {
					io.to(geolib.findNearest({
						latitude: travel.latitude,
						longitude: travel.longitude
					}, defaultSpots).key).emit('travel', {
						id: travel.id,
						socketId: socket.id
					});
				};
			} else {
				if (Object.keys(executiveSpots).length) {
					io.to(geolib.findNearest({
						latitude: travel.latitude,
						longitude: travel.longitude
					}, executiveSpots).key).emit('travel', {
						id: travel.id,
						socketId: socket.id
					});
				};
			};
		});

		socket.on('travelAccept', function (data) {
			io.emit('travelAccept-' + data.id, data.position);
		});

		socket.on('travelStart', function (id) {
			io.emit('travelStart-' + id);
		});

		socket.on('travelCancel', function (id) {
			io.emit('travelCancel-' + id);
		});

		socket.on('travelEnd', function (id) {
			io.emit('travelEnd-' + id);
		});

		socket.on('alertPassenger', function (id) {
			io.emit('alertPassenger-' + id);
		});

		socket.on('message', function (data) {
			models.Message.create({
				user: data.user,
				driver: data.driver,
				content: data.content
			}, function (err, message) {
				if (err) throw err;
				io.emit('message-' + data.receiver, message.content);
			});
		});

		socket.on('disconnect', function () {
			if (socket.handshake.query.type === 'driver') {
				drivers.map(function (driver, i) {
					if (driver.socketId === socket.id) {
						if (driver.type === 'default') {
							delete defaultSpots[socket.id];
						} else {
							delete executiveSpots[socket.id];
						};
						drivers.splice(i, 1);
						delete spots[socket.id];
					};
				});
			};
		});
	});
};