const express = require('express');
const QueryBuilder = require('../utils/query_builder');
const db = require('../services/db')
const router = express.Router();

router.get(['/','/:id'], (req, res) => {
	const  {id}  = req.params;
	const find =(id!=undefined&&id.length==32)?{ _id: id }:{};
	const query = new QueryBuilder('cities', { find, queryString: req.query });
	const townsql = 'select _id, name from towns where towns.city = \'';
	if (query.projection.includes('towns')&&!(query.projection.includes('name'))){
		let ins= query.sql.indexOf('towns');
		let newstr = query.sql.substring(0,ins)  +'name, ' + query.sql.substring(ins);
		query.sql= newstr;
	}

	db.query(query.sql).then(data => {
		if (query.projection.includes(query.lookUpCollection)) {
			for (let i = 0; i < data.length; i++) { 
				db.query(townsql + data[i].name + "\'").then(townsdata => {
					data[i].towns = [...townsdata];
					if(i+1 == data.length)res.send({status:true,data,})
				}, (err) => console.log(err));
		}
	}
		else {
			res.send({
				status: true,
				data,
			})
		}
	}, (err) => {
		res.status(500).send({ status: false, error: err, data: [] });
	});

});

module.exports = router;
