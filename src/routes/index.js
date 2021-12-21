const siteRouter = require('./site');
const levelRouter = require('./level');
const informationRouter = require('./information');
const InfoLevelRouter = require('./infoLevel');
const GetInfoRouter = require('./getInfo');
function route(app) {
    app.use('/', siteRouter);

    app.use('/level', levelRouter);

    app.use('/information', informationRouter);

    app.use('/info_level', InfoLevelRouter);

    app.use('/get_info', GetInfoRouter);
};

module.exports = route;