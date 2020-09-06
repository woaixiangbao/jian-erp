const Koa = require('koa');

const app = new Koa();
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');
const session = require('koa-generic-session');
const Redis = require('koa-redis');
const json = require('koa-json');
const dbConfig = require('./server/dbs/config');

const users = require('./server/interface/user.js').router;

app.keys = ['keys', 'keyskeys'];
app.proxy = true;
app.use(
  session({
    key: 'vueEle',
    prefix: 'vueEle:uid',
    store: new Redis(),
  }),
);

app.use(bodyParser({
  extendTypes: ['json', 'form', 'text'],
}));

app.use(json());

mongoose.connect(
  dbConfig.dbs,
  { useNewUrlParser: true },
);

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
mongoose.Promise = global.Promise;

db.on('error', () => {
  console.log('数据库链接出错');
});

db.on('open', () => {
  console.log('数据库链接成功');
});

app.use(users.routes()).use(users.allowMethods());

app.listen(8888, () => {
  console.log('链接成功，请打开http://localhost:8888');
});
