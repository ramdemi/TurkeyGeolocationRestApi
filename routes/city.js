const express = require('express');
const QueryBuilder = require('../utils/query_builder');
const db = require('../services/db')
const router = express.Router();

router.get(['/','/:id'], (req, res) => {
	const  {id}  = req.params;
	const find =(id!=undefined&&id>0&&id<82)?{ _id: id }:{};
	const query = new QueryBuilder('cities', { find, queryString: req.query });

	db.query(query.sql).then(data => {
		res.send({ status: true, data, })
	}, (err) => {
		res.status(500).send({ status: false, error: err, data: [] });
	});

});

module.exports = router;
