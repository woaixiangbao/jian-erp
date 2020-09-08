const Router = require('koa-router');
const Redis = require('koa-redis');
const nodeMailer = require('nodemailer'); // 通过node发送邮件
const User = require('../dbs/models/users').Users;
const Email = require('../dbs/config');

const createToken = require('../token/createToken.js'); // 创建token
const checkToken = require('../token/checkToken.js'); // 验证token

const router = new Router({
  prefix: '/api',
});

const Store = new Redis().client;

router.post('/verify', async (ctx) => {
  const { username } = ctx.request.body;
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire'); // 过期时间
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    // eslint-disable-next-line no-param-reassign
    ctx.body = {
      code: -1,
      msg: '发送过于频繁，请稍后再试',
    };
    return false;
  }
  const transporter = nodeMailer.createTransport({
    /**
     *  端口465和587用于电子邮件客户端到电子邮件服务器通信 - 发送电子邮件。
     *  端口465用于smtps SSL加密在任何SMTP级别通信之前自动启动。
     *  端口587用于msa
     */
    host: Email.smtp.host,
    port: 587,
    secure: false, // true 监听465端口，false监听其他端口
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass,
    },
  });

  const ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username,
  };
  const mailOptions = {
    from: `"认证邮件" <${Email.smtp.user}>`,
    to: ko.email,
    subject: '邀请码',
    html: `用户${ko.user}, 您正在注册jianqingerp， 您的邀请码是${ko.code}`,
  };

  await transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return console.log('发送邮件失败');
    }
    Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email);
  });

  ctx.body = {
    code: 0,
    msg: '验证码已发送， 请注意查收， 可能会有延时，有效期5分钟',
  };
});

router.post('/register', async (ctx) => {
  const {
    username, password, email, code,
  } = ctx.request.body;
  console.log(`注册信息：${ctx.request.body}`);
  if (code) {
    const saveCode = await Store.hget(`nodemail:${username}`, 'code'); // 拿到已存储的真实的验证码
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire'); // 过期时间
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新申请',
        };
        return false;
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码',
      };
      return false;
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码',
    };
    return false;
  }
  const user = await User.find({ username });
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '该用户名已被注册',
    };
    return false;
  }

  const newUser = await User.create({
    username,
    password,
    email,
    token: createToken(this.username),
  });
  if (newUser) {
    ctx.body = {
      code: 0,
      msg: '注册成功',
    };
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败',
    };
  }
});

router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;
  const doc = await User.findOne({ username });
  console.log(doc, 444);
  if (!doc) {
    ctx.body = {
      code: -1,
      msg: '用户名不存在',
    };
  } else if (doc.password !== password) {
    ctx.body = {
      code: -1,
      msg: '密码错误',
    };
  } else if (doc.password === password) {
    const token = createToken(username);
    doc.token = token;
    try {
      await doc.save();
      ctx.body = {
        code: 0,
        msg: '登录成功',
        username,
        token,
      };
    } catch (err) {
      ctx.body = {
        code: -1,
        msg: '登录失败，请重新登录',
      };
    }
  }
});

router.get('/alluser', checkToken, async (ctx) => {
  try {
    const result = [];
    const doc = await User.find({});
    doc.map((val) => {
      result.push({
        email: val.email,
        username: val.username,
      });
    });
    ctx.body = {
      code: 0,
      msg: '查找成功',
      result,
    };
  } catch (error) {
    ctx.body = {
      code: -1,
      msg: '查找失败',
      result: error,
    };
  }
});

module.exports = {
  router,
};
