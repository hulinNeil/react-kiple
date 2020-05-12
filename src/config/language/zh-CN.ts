import smsMail from './zh-CN/smsMail';
import push from './zh-CN/push';
import account from './zh-CN/account';

export default {
  header: '总览',
  index: '这里是主页',
  search: '查询',
  edit: '修改',
  delete: '删除',
  preview: '预览',
  ok: '确定',
  cancel: '取消',
  all: '全部',
  add: '添加',
  reset: '重置',
  ...smsMail,
  ...push,
  ...account
};
