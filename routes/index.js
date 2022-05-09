const searchRoutes = require('./searchlocation');
const cityRoutes = require('./city');
const townRoutes = require('./town');
const districtRoutes = require('./district');
const neightborhoodsRoutes = require('./neighborhood');

module.exports = (app) => {
	app.use(`/search`, searchRoutes);
	app.use(`/cities`, cityRoutes);
	app.use(`/towns`, townRoutes);
	app.use(`/districts`, districtRoutes);
	app.use(`/neighborhoods`, neightborhoodsRoutes);
	// app.use(`/${config.apiVersion}/search`, searchRoutes);
};
