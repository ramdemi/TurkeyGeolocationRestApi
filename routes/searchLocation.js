const express = require('express');
const db = require('../services/db');

const router = express.Router();

async  function findLocation(source, lat, lon) {
 	let sql, sqlpre;
	 sqlpre = "SELECT _id, name "
	 sqlpre += (source == "towns")? ", city":"";
	 sql =  `${sqlpre} FROM fhckf4OCq3.${source} WHERE ST_WITHIN(Point(${lon},${lat}),${source}.polygons);`;
	 const rows =  await db.query(sql);
	 return rows
};

router.get('/coordinates', (req, res) => {
	const { lat, lon } = req.query;

	if (!lat || !lon) {
		res.send('Please send lat and lon parameters!');
		return;
	}

	findLocation('towns', lat, lon).then((townData) => {
		if (!townData || townData.length === 0) {
			findLocation('cities', lat, lon).then((cityData) => {
				res.send(cityData && cityData.length > 0 ? cityData[0] : cityData);
			}, err => res.status(500).send(err));
		} else {
			res.send(townData && townData.length > 0 ? townData[0] : townData);
		}
	}, err => res.status(500).send(err));
});

module.exports = router;