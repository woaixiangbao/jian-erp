const mongoose = require('mongoose');

const dbs = 'mongodb://127.0.0.1:27017/testjianqing';

mongoose.connect(dbs);

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('error', () => {
  console.log('数据库链接出错');
});

db.on('open', () => {
  console.log('数据库链接成功');
});
