export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'lgin',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/record/:id',
    component: './Record',
  },
  {
    path: '/record/4',
    name: '监测记录',
    icon: 'line-chart',
    component: './Record',
  },
  {
    name: '设备管理',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    name: '报警管理',
    icon: 'alert',
    path: '/alarms',
    component: './AlarmManage',
  },
  {
    path: '/',
    redirect: '/record/4',
  },

  {
    component: './404',
  },
];
