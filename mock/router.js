const express = require('express');
const router = express.Router();
const adminMenu = require('./config/admin');
const userMenu = require('./config/user');
const smsTplList = []; // 短信模板
const mailTplList = []; // 邮件模板
const mailHistory = []; // 邮件历史
const mailCronjob = [];
const smsCronjob = [];
const pushCronjob = [];
const smsHistory = [];
const pushTopic = [];
const sensitivelList = [
  { word: 'asd13', editTime: 1587870807859, id: 13 },
  { word: 'asd12', editTime: 1587870807859, id: 12 },
  { word: '阿松asd11大', editTime: 1587870796018, id: 11 },
  { word: '阿wqe松1大', editTime: 1587870776523, id: 10 },
  { word: '阿wqe松9大', editTime: 1587870772274, id: 9 },
  { word: '阿松sda8大', editTime: 1587870737987, id: 8 },
  { word: 'asd7', editTime: 1587870807859, id: 7 },
  { word: '阿松6asd大', editTime: 1587870796018, id: 6 },
  { word: '阿wq5e松大', editTime: 1587870776523, id: 5 },
  { word: '阿w4qe松大', editTime: 1587870772274, id: 4 },
  { word: '阿松s3da大', editTime: 1587870737987, id: 3 },
  { word: '阿松s2da大', editTime: 1587870737987, id: 2 },
  { word: '阿松s1da大', editTime: 1587870737987, id: 1 },
]; // 敏感词

for (let i = 0; i < 14; i++) {
  mailHistory.push({
    emailContent: '<p>验证码是 adas,asd不要说哈！！！！</p>',
    emailStatus: (i % 2) + 1,
    emailTemplateId: 2,
    emailTitle: 'asd',
    id: 1,
    receivedUserEmail: 'sda@qq.com',
    sendTime: 1587968292000,
    statusDescribe: '',
  });
  smsHistory.push({
    id: i + 1,
    templateName: '模板名字' + i,
    smsContent: '验证码是 adas,asd不要说哈！！！！',
    kind: (i % 2) + 1,
    smsStatus: (i % 2) + 1,
    smsTemplateId: 2,
    smsTitle: 'asd',
    receivedUserSms: '13349899620',
    sendTime: 1587968292000,
    statusDescribe: '',
  });
  smsTplList.push({
    id: i + 1,
    templateName: '模板名称' + i,
    content:
      i % 2 === 0
        ? '验证码为：{1}，您正在登录，若非本人操作，请勿泄露。'
        : '您正在申请手机号码注册，验证码为：{1}，{2}分钟有效，为保障帐户安全，请勿向任何人提供此验证码。',
    kind: (i % 2) + 1,
    buKind: '9524',
    buId: 1,
    buSystem: '1',
    channel: '1',
    lastEditTime: new Date().getTime() - 10 * i * 1000,
    placeholderCount: i % 2 === 0 ? 1 : 2,
  });
  mailTplList.push({
    id: i + 1,
    templateName: '模板名称' + i,
    title: '阿松大',
    content: '<p>阿萨大大</p>',
    kind: (i % 2) + 1,
    buKind: '9524',
    buId: 1,
    buSystem: '1',
    channel: '1',
    lastEditTime: new Date().getTime() - 10 * i * 1000,
    placeholderCount: i,
  });
}

router.post('/web/login', (req, res) => {
  const result = {
    code: 0,
    data: {
      _id: '12345',
      username: req.body.userName || 'none',
      createTime: 15546291355,
      permission: req.body.userName === 'admin' ? 1 : 0, // 1 为write权限，可以增删改，2为read，只能查看，不能进行其他操作
      menu: req.body.userName === 'admin' ? adminMenu : userMenu,
    },
  };
  setTimeout(() => {
    res.json(result);
  }, 1000);
});
// sensitiveword
router.post('/web/newsensitiveword', (req, res) => {
  console.log(req.body);
  sensitivelList.unshift({
    word: req.body.word,
    editTime: new Date().getTime(),
    id: sensitivelList[0] ? sensitivelList[0].id + 1 : 1,
  });
  setTimeout(() => {
    res.json({
      code: 0,
      message: 'success',
    });
  }, 1000);
});
router.delete('/web/delsensitiveword', (req, res) => {
  const id = Number(req.query.id);
  const index = sensitivelList.findIndex((item) => item.id === id);
  console.log(index);
  sensitivelList.splice(index, 1);
  setTimeout(() => {
    res.json({
      code: 0,
      message: 'success',
    });
  }, 1000);
});
router.get('/web/sensitivewordlist', (req, res) => {
  const pageNo = Number(req.query.pageNo);
  setTimeout(() => {
    res.json({
      code: 0,
      message: 'success',
      data: {
        totalCount: sensitivelList.length,
        pageNo,
        list: sensitivelList.slice((pageNo - 1) * 10, pageNo * 10),
      },
    });
  }, 1000);
});

// mail template
router.post('/web/:ms/newtemplate', (req, res) => {
  const list = req.params.ms === 'sms' ? smsTplList : mailTplList;
  const item = Object.assign(req.body, {
    lastEditTime: new Date().getTime(),
    buKind: '新增',
    id: list[0] ? list[0].id + 1 : 1,
  });
  list.unshift(item);
  setTimeout(() => {
    res.json({
      code: 0,
      message: 'success',
    });
  }, 1000);
});
router.post('/web/:ms/edittemplate', (req, res) => {
  const id = Number(req.body.id);
  const list = req.params.ms === 'sms' ? smsTplList : mailTplList;
  const index = list.findIndex((item) => item.id === id);
  list[index] = Object.assign(req.body, {
    lastEditTime: new Date().getTime(),
    buKind: '修改',
    id: Number(req.body.id),
  });
  setTimeout(() => {
    res.json({
      code: 0,
      message: 'success',
    });
  }, 1000);
});
router.delete('/web/:ms/deltemplate', (req, res) => {
  const id = Number(req.query.id);
  const list = req.params.ms === 'sms' ? smsTplList : mailTplList;
  const index = list.findIndex((item) => item.id === id);
  list.splice(index, 1);
  setTimeout(() => {
    res.json({
      code: 0,
      message: 'success',
    });
  }, 1000);
});
router.get('/web/:ms/templatelist', (req, res) => {
  const pageNo = Number(req.query.pageNo);
  const list = req.params.ms === 'sms' ? smsTplList : mailTplList;
  setTimeout(() => {
    res.json({
      code: 0,
      message: 'success',
      data: {
        totalCount: list.length,
        pageNo,
        list: list.slice((pageNo - 1) * 10, pageNo * 10),
      },
    });
  }, 1000);
});

// cronjob 定时任务
router.post('/web/:ms/newcronjob', (req, res) => {
  const ms = req.params.ms;
  const list = ms === 'sms' ? smsCronjob : ms === 'mail' ? mailCronjob : pushCronjob;
  const templateList = ms === 'sms' ? smsTplList : mailTplList;
  const item = Object.assign(req.body, {
    id: list[0] ? list[0].id + 1 : 1,
    status: 1,
    to: '133444,12312,',
  });

  if (ms !== 'push') {
    const tpl = templateList.find((item) => item.id === Number(req.body.templateId));
    item.templateName = tpl.templateName;
    item.kind = tpl.kind;
    item.content = tpl.content;
  }

  list.unshift(item);
  setTimeout(() => {
    res.json({
      code: 0,
      message: 'success',
    });
  }, 1000);
});
router.delete('/web/:ms/delcronjob', (req, res) => {
  const id = Number(req.query.id);
  const ms = req.params.ms;
  const list = ms === 'sms' ? smsCronjob : ms === 'mail' ? mailCronjob : pushCronjob;
  const index = list.findIndex((item) => item.id === id);
  list.splice(index, 1);
  setTimeout(() => {
    res.json({
      code: 0,
      message: 'success',
    });
  }, 1000);
});
router.get('/web/:ms/cronjoblist', (req, res) => {
  const pageNo = Number(req.query.pageNo);
  const ms = req.params.ms;
  const list = ms === 'sms' ? smsCronjob : ms === 'mail' ? mailCronjob : pushCronjob;
  setTimeout(() => {
    res.json({
      code: 0,
      message: 'success',
      data: {
        totalCount: list.length,
        pageNo,
        list: list.slice((pageNo - 1) * 10, pageNo * 10),
      },
    });
  }, 1000);
});

// sms mail history
router.post('/web/:ms/historylist', (req, res) => {
  const list = req.params.ms === 'sms' ? smsHistory : mailHistory;
  const pageNo = Number(req.body.pageNo);
  setTimeout(() => {
    res.json({
      code: 0,
      message: 'success',
      data: {
        totalCount: list.length,
        pageNo,
        list: list.slice((pageNo - 1) * 10, pageNo * 10),
      },
    });
  }, 1000);
});

router.get('/web/:sms/businesslist', (req, res) => {
  setTimeout(() => {
    res.json({
      code: 0,
      message: 'success',
      data: {
        list: [
          { buIn: 1, buKind: '业务线1', buSystem: '1-系统1' },
          { buIn: 1, buKind: '业务线1', buSystem: '1-系统2' },
          { buIn: 2, buKind: '业务线2', buSystem: '2-系统1' },
          { buIn: 2, buKind: '业务线2', buSystem: '2-系统2' },
        ],
      },
    });
  }, 1000);
});

router.post('/web/push/newtopic', (req, res) => {
  const item = Object.assign(req.body, {
    lastEditTime: new Date().getTime(),
    id: pushTopic[0] ? pushTopic[0].id + 1 : 1,
  });
  pushTopic.unshift(item);
  setTimeout(() => {
    res.json({
      code: 0,
      message: 'success',
    });
  }, 1000);
});
router.delete('/web/push/deltopic', (req, res) => {
  const id = Number(req.query.id);
  const index = pushTopic.findIndex((item) => item.id === id);
  pushTopic.splice(index, 1);
  setTimeout(() => {
    res.json({
      code: 0,
      message: 'success',
    });
  }, 1000);
});
router.get('/web/push/topiclist', (req, res) => {
  const pageNo = Number(req.query.pageNo);
  setTimeout(() => {
    res.json({
      code: 0,
      message: 'success',
      data: {
        totalCount: pushTopic.length,
        pageNo,
        list: pushTopic.slice((pageNo - 1) * 10, pageNo * 10),
      },
    });
  }, 1000);
});
module.exports = router;
