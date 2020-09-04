const Koa = require('koa');
const app = new Koa();
const mongoose = require('mongoose');
const bodyParse = require('koa-bodyparser');
const session = require('koa-generic-session');
const Redis = require('koa-redis');
const json = require('koa-json');
const dbConfig = require('./server/dbs/config');

