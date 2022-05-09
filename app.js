const express = require('express');
const logger = require('morgan');
const db= require('./services/db');

const routes = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var port = process.env.PORT || '3000';


app.get('/', (req, res) => {
  if (req.query.rawsql) {
    sqlstr= req.query.rawsql;
    if(sqlstr.match(/create|update|insert|drop|truncate|delete|alter/i)){
      res.status(500).send({ status: false, error: 'Sadece okuma işlemleri izinli' });
      return
    }

    db.query(sqlstr).then(data => {res.send({
      status: true,
      data,
    }),(err) => {
      res.status(500).send({ status: false, error: err, data: [] });
    }});
   
}else {
   res.send('İl ilçe mahalle rest-api') 
  }
});

routes(app);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({'message': err.message});
  
  return;
})
app.listen(port, () => {
  console.log(`Turkey GeoApi app listening on port ${port}`)
})

module.exports = app;