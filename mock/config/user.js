const menuList = [
  {
    title: 'KipleBiz',
    icon: 'https://main.qcloudimg.com/image/product/500/16_16/gray.svg',
    children: [
      {
        title: '商户管理',
        key: '/merchant',
        icon:
          'https://cloudcache.tencent-cloud.com/open_proj/proj_qcloud_v2/mc_2014/server/css/img/aside-icon/cvm-logo.svg',
        children: [
          {
            title: '用户管理',
            key: '/merchant/user',
            icon: 'MailOutlined',
          },
          {
            title: '角色管理',
            key: '/merchant/role',
            icon: '',
          },
        ],
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
            title:'群发短信',
            key:'/sms/mass-send',
            icon: 'MailOutlined',
          },
          {
            title:'已发短信',
            key:'/sms/history',
            icon: 'MailOutlined',
          },
          {
            title: '敏感词管理',
            key: '/sms/sensitive',
            icon: 'WarningOutlined',
          },
        ],
      },{
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
            title:'群发邮件',
            key:'/mail/mass-send',
            icon: 'MailOutlined',
          },
          {
            title:'已发邮件',
            key:'/mail/history',
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
        title: '服务说明',
        key: 'https://www.baidu.com',
        icon: 'https://cloudcache.tencent-cloud.com/open_proj/proj_qcloud_v2/mc_2014/server/css/img/aside-icon/cvm-logo.svg',
      },
    ],
  },
];

module.exports = menuList;
