module.exports = function (app, models) {
    app.post('/subdomain/root/promotional-codes', function (req, res) {
        console.log(req.body);
        models.PromotionalCode.findOne({
            code: req.body.code
        }, function (err, code) {
            if (err) throw err;
            if (code) {
                res.status(400);
                res.send('Code already exists.');
            } else {
                models.PromotionalCode.create({
                    discount: req.body.discount,
                    code: req.body.code,
                    createdAt: new Date().getTime()
                }, function (err) {
                    if (err) throw err;
                    res.end();
                });
            };
        });
    });

	app.get('/subdomain/root/promotional-codes', function (req, res) {
		models.PromotionalCode.find(function (err, codes) {
			if (err) throw err;
			res.json(codes);
		});
	});

	app.delete('/subdomain/root/promotional-codes/:id', function (req, res) {
		models.PromotionalCode.remove({
			_id: req.params.id
		}, function (err) {
			if (err) throw err;
			models.PromotionalCode.find(function (err, codes) {
				if (err) throw err;
				res.json(codes);
			});
		});
	});
};