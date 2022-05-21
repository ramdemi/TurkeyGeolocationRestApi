const express = require('express');
const QueryBuilder = require('../utils/query_builder');
const db = require('../services/db')
const router = express.Router();

router.get(['/', '/:id'], (req, res) => {
	const { id } = req.params;
	const find = (id != undefined && id>=0 && id<2433) ? { _id: id } : {};
	const query = new QueryBuilder('districts', { find, queryString: req.query });

	db.query(query.sql).then(data => {
		res.send({ status: true, data, });
	}, err => res.status(500).send({ status: false, error: err }));
});

module.exports = router;
