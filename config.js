const env = process.env;

const config = {
  eskdb: { /* do not put password or any sensitive info here, done only for demo */
    host: env.DB_HOST || 'remotemysql.com',
    user: env.DB_USER || 'fhckf4OCq3',
    password: env.DB_PASSWORD || 'WGPjcasxfP',
    database: env.DB_NAME || 'fhckf4OCq3',
    waitForConnections: true,
    connectionLimit: env.DB_CONN_LIMIT || 2,
    queueLimit: 0,
    debug: env.DB_DEBUG || false
  },
  db: { /* do not put password or any sensitive info here, done only for demo */
  host: env.DB_HOST || '5.2.85.46',
  user: env.DB_USER || 'periyodi_geouser',
  password: env.DB_PASSWORD || '5W*I}=?6{-%{',
  database: env.DB_NAME || 'periyodi_ramdem',
  waitForConnections: true,
  connectionLimit: env.DB_CONN_LIMIT || 2,
  queueLimit: 0,
  debug: env.DB_DEBUG || false
},

  listPerPage: env.LIST_PER_PAGE || 10,
  apiVersion: 'v1',
  maxDataItem: 100,
};

  
module.exports = config;
