const config = require('../config');

function processQueryString(queryString) {
	if (!queryString) return;

	if (queryString.fields) {
		const fieldsArray = queryString.fields.split(',');
		this.projection = fieldsArray;
	}

	if (queryString.limit) {
		this.limit = parseInt(queryString.limit,10) > config.maxDataItem
			? config.maxDataItem :
			parseInt(queryString.limit,10);
	}

	if (queryString.skip) {
		this.skip = parseInt(queryString.skip,10);
	}
}

function initClassDefaults() {
	switch (this.collection) {
	case 'cities':
		this.fields = ['_id', 'city', 'towns', 'lat', 'lon', 'polygons', 'boundingbox'];
		this.defaultFields = ['_id', 'city'];
		this.lookUpCollection = '/*towns*/';
		break;
	case 'towns':
		this.fields = ['_id','town', 'city', 'districts', 'lat', 'lon', 'polygons', 'boundingbox'];
		this.defaultFields = ['_id', 'town', 'city'];
		this.lookUpCollection = 'districts';
		break;
	case 'districts':
		this.fields = ['_id', 'district', 'town', 'city', 'neighborhoods', 'zip_code'];
		this.defaultFields = ['_id','district', 'town', 'city' ];
		this.lookUpCollection = 'neighborhoods';
		break;
	case 'neighborhoods':
		this.fields = ['_id', 'district', 'town', 'city', 'neighborhoods', 'zip_code'];
		this.defaultFields = ['_id','district', 'town', 'city', 'neighborhoods', 'zip_code' ];
		this.lookUpCollection = '';
		break;
	default:
		break;
	}
}

function makeSql(){
	this.projection.forEach((element,i) => {
		if (this.fields.includes(element)) {this.sql += (i>0)?', ' + element:element;
	};
	
	});
	if(this.collection=='neighborhoods') this.collection='districts';

	this.sql += ' from ' +config.db.database+ '.'+ this.collection + ' ' ;
	if (this.find){
		this.sql += 'where _id = ' + this.find._id;
		return
	}
	if (this.skip) this.sql += 'limit ' + this.skip;
	if (this.limit&&this.skip) {
		this.sql += ', ' + this.limit;
	}else{
		this.sql += 'limit ' + this.limit;
	};
}

class QueryBuilder {
	constructor(collectionName, options = {}) {
		if (!collectionName) {
			throw new Error('Provide collection name');
		}

		this.collection = collectionName;
		this.lookupEnabled = options.lookupEnabled !== undefined ? options.lookupEnabled : true;

		initClassDefaults.call(this);
		this.defaultFields = options.defaultFields || this.defaultFields;

		if (Object.keys(options.find).length === 1) this.find =options.find;
		this.projection = this.defaultFields; //.reduce(projectionReducer, {});
		this.limit = config.maxDataItem;
		this.sql= "select "
		processQueryString.call(this, options.queryString);
		makeSql.call(this);
	}
}
module.exports = QueryBuilder;
