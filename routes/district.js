const express = require('express');
const QueryBuilder = require('../utils/query_builder');
const db = require('../services/db')
const router = express.Router();
router.get(['/', '/:id'], (req, res) => {
	let my, errors, data;
	const { id } = req.params;
	const find = (id != undefined && id.length == 32) ? { _id: id } : {};
	const query = new QueryBuilder('districts', { find, queryString: req.query });
	const neigsql = 'select _id, name from neighborhoods where _id in (\'';
	db.query(query.sql).then(datass => {
		data = datass;
		if (query.projection.includes(query.lookUpCollection)) {
			my = setInterval(checkit, 100); //check all queries completed then send response
			for (let i = 0; i < data.length; i++) {
				db.query(neigsql + data[i].neighborhoods.toString().replaceAll(',', '\',\'') + "\')")
					.then(neighborhoodsdata => {
						data[i].neighborhoods = [...neighborhoodsdata];
					}, err => errors = err);
			}
		}
		else {
			res.send({
				status: true,
				data,
			})
		}
	}, (err) => {
		res.status(500).send({ status: false, error: err, data: [] })

	});

	function checkit() {
		for (let i = 0; i < data.length; i++) {
			if (errors) {
				//if error send error message and stop function
				res.status(500).send({ status: false, error: errors });
				clearInterval(my);
			}
			// if not completed return do nothing
			if (typeof (data[i].neighborhoods[0]) == 'string') return
		}
		// It is okey send data and stop function
		res.send({ status: true, data, });
		clearInterval(my);
	}

});

module.exports = router;
