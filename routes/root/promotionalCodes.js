module.exports = function (app, models) {
    app.post('/subdomain/root/promotional-codes', async function (req, res) {
        console.log(req.body);
        try {
            const code = await models.PromotionalCode.findOne({ code: req.body.code });
            if (code) {
                res.status(400);
                res.send('Code already exists.');
            } else {
                await models.PromotionalCode.create({
                    discount: req.body.discount,
                    code: req.body.code,
                    createdAt: new Date().getTime()
                });
                res.end();
            }
        } catch (err) {
            throw err;
        }
    });

    app.get('/subdomain/root/promotional-codes', async function (req, res) {
        try {
            const codes = await models.PromotionalCode.find();
            res.json(codes);
        } catch (err) {
            throw err;
        }
    });

    app.delete('/subdomain/root/promotional-codes/:id', async function (req, res) {
        try {
            await models.PromotionalCode.remove({ _id: req.params.id });
            const codes = await models.PromotionalCode.find();
            res.json(codes);
        } catch (err) {
            throw err;
        }
    });
};
