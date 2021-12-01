const siteRouter = require('./site');
const levelRouter = require('./level');
const informationRouter = require('./information');
const InfoLevelRouter = require('./infoLevel');
function route(app) {
    app.use('/', siteRouter);

    app.use('/level', levelRouter);

    app.use('/information', informationRouter);

    app.use('/info_level', InfoLevelRouter);
};

module.exports = route;