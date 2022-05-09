const express = require('express');
const QueryBuilder = require('../utils/query_builder');
const db = require('../services/db')
const router = express.Router();


router.get(['/','/:id'], (req, res) => {
	const  {id}  = req.params;
	const find =(id != undefined&&id.length == 32)?{ _id: id }:{};
	const query = new QueryBuilder('neighborhoods', { find, queryString: req.query });

	db.query(query.sql).then(data => res.send({
		status: true,
		data,
	}), (err) => {
		logger.error(err);
		res.status(500).send({ status: false, error: err, data: [] });
	});
});

module.exports = router;
