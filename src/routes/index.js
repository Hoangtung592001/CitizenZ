const siteRouter = require('./site');
const levelRouter = require('./level');
const informationRouter = require('./information');
function route(app) {
    app.use('/', siteRouter);

    app.use('/level', levelRouter);

    app.use('/information', informationRouter);
};

module.exports = route;