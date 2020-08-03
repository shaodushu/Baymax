export default [
    {
        path: '/user',
        layout: false,
        routes: [
            {
                name: '登录',
                path: '/user/login',
                component: './User/login',
            },
        ],
    },
    {
        path: '/',
        redirect: '/report/index',
    },
    {
        path: '/report',
        name: '日报',
        icon: 'smile',
        routes: [
            {
                path: '/report/index',
                name: '日报日志',
                icon: 'smile',
                component: './Report/index',
            },
            {
                path: '/report/edit',
                name: '填写日报',
                access: 'canUser',
                icon: 'smile',
                component: './Report/edit',
            },
        ],
    },
    // {
    //   path: '/admin',
    //   name: '日报',
    //   icon: 'crown',
    //   access: 'canAdmin',
    //   component: './Admin',
    //   routes: [
    //     {
    //       path: '/admin/sub-page',
    //       name: 'sub-page',
    //       icon: 'smile',
    //       component: './Welcome',
    //     },
    //   ],
    // },
    {
        component: './404',
    },
]