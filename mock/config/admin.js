const menuList = [
  {
    title: 'KipleBiz',
    icon: 'https://main.qcloudimg.com/image/product/500/16_16/gray.svg',
    children: [
      {
        title: '商户中心',
        key: '/merchant',
        icon: 'https://cloudcache.tencent-cloud.com/open_proj/proj_qcloud_v2/mc_2014/server/css/img/aside-icon/cvm-logo.svg',
        children: [
          {
            title: '信息管理',
            key: '/merchant/overview',
            icon: 'MailOutlined',
          },
          {
            title: '子商户管理',
            key: '/merchant/sub',
            icon: 'MailOutlined',
          },
          {
            title: '用户管理',
            key: '/merchant/user',
            icon: 'MailOutlined',
          },
        ],
      },
      {
        title: '个人中心',
        key: '/account',
        icon: 'https://cloudcache.tencent-cloud.com/open_proj/proj_qcloud_v2/mc_2014/server/css/img/aside-icon/cvm-logo.svg',
        children: [
          {
            title: '信息管理',
            key: '/account/overview',
            icon: 'MailOutlined',
          },
        ],
      },
      {
        title: '订单管理',
        key: '/charts',
        icon: 'https://cloudcache.tencent-cloud.com/open_proj/proj_qcloud_v2/mc_2014/server/css/img/aside-icon/cvm-logo.svg',
        children: [
          {
            title: '概述',
            key: '/charts/bar',
            icon: 'MailOutlined',
          },
          {
            title: '订单需求',
            key: '/charts/radar',
            icon: 'MailOutlined',
          },
        ],
      },
    ],
  },
  {
    title: 'KipleLive',
    icon: 'https://main.qcloudimg.com/image/product/2478/16_16/gray.svg',
    children: [
      {
        title: '家政服务',
        key: '/housekeeping',
        icon: 'https://cloudcache.tencent-cloud.com/open_proj/proj_qcloud_v2/mc_2014/server/css/img/aside-icon/cvm-logo.svg',
        children: [
          {
            title: '概述',
            key: '/housekeeping/overview',
            icon: 'ProjectOutlined',
          },
          {
            title: '模版管理',
            key: '/housekeeping/template',
            icon: 'UnorderedListOutlined',
          },
        ],
      },
      {
        title: '跳转链接',
        key: 'https://www.qidian.com',
        icon: 'https://cloudcache.tencent-cloud.com/open_proj/proj_qcloud_v2/mc_2014/server/css/img/aside-icon/cvm-logo.svg',
      },
    ],
  },
  {
    title: 'CommonServer',
    icon: 'https://main.qcloudimg.com/image/product/2478/16_16/gray.svg',
    children: [
      {
        title: '短信服务',
        key: '/sms',
        icon: 'https://cloudcache.tencent-cloud.com/open_proj/proj_qcloud_v2/mc_2014/server/css/img/aside-icon/cvm-logo.svg',
        children: [
          {
            title: '概述',
            key: '/sms/overview',
            icon: 'ProjectOutlined',
          },
          {
            title: '模版管理',
            key: '/sms/template',
            icon: 'UnorderedListOutlined',
          },
          {
            title: '群发短信',
            key: '/sms/mass-send',
            icon: 'MailOutlined',
          },
          {
            title: '已发短信',
            key: '/sms/history',
            icon: 'MailOutlined',
          },
          {
            title: '敏感词管理',
            key: '/sms/sensitive',
            icon: 'WarningOutlined',
          },
        ],
      },
      {
        title: '邮件服务',
        key: '/mail',
        icon: 'https://cloudcache.tencent-cloud.com/open_proj/proj_qcloud_v2/mc_2014/server/css/img/aside-icon/cvm-logo.svg',
        children: [
          {
            title: '概述',
            key: '/mail/overview',
            icon: 'ProjectOutlined',
          },
          {
            title: '模版管理',
            key: '/mail/template',
            icon: 'UnorderedListOutlined',
          },
          {
            title: '群发邮件',
            key: '/mail/mass-send',
            icon: 'MailOutlined',
          },
          {
            title: '已发邮件',
            key: '/mail/history',
            icon: 'MailOutlined',
          },
          {
            title: '敏感词管理',
            key: '/mail/sensitive',
            icon: 'WarningOutlined',
          },
        ],
      },
      {
        title: '推送服务',
        key: '/push',
        icon: 'https://cloudcache.tencent-cloud.com/open_proj/proj_qcloud_v2/mc_2014/server/css/img/aside-icon/cvm-logo.svg',
        children: [
          {
            title: '主题管理',
            key: '/push/topic',
            icon: 'UnorderedListOutlined',
          },
          {
            title: '推送任务',
            key: '/push/cronjob',
            icon: 'MailOutlined',
          },
        ],
      },
      {
        title: '服务说明',
        key: 'https://www.baidu.com',
        icon: 'https://cloudcache.tencent-cloud.com/open_proj/proj_qcloud_v2/mc_2014/server/css/img/aside-icon/cvm-logo.svg',
      },
    ],
  },
];

module.exports = menuList;
