
import {createRouter, createWebHashHistory} from "vue-router";

import Login from '../views/login/login.vue'
import Layout from '../layout/index.vue'


// 定义路由组件信息
const routes = [
	// {
	// 	path: '/', 
	// 	redirect: '/login',
	// },
	{
		path: '/', 
		redirect: '/home',
	},
	{
		path: '/login', 
		name: 'login', 
		component: Login,
	},
	{
		path: '/', 
		component: Layout,
		meta: {
			title: '首页',
			icon: 'House'
		},
		children: [
			{
				path: "/home",
				name: "home",
				meta: {
					title: '首页',
					icon: 'House'
				},
				/** 在src/views 文件下创建home文件 */
				component: () => import("../components/HelloWorld.vue"),
			},
			{
				path: "/system",
				name: "system",
				meta: {
					title: '系统概况',
					icon: 'Grid'
				},
				/** 在src/views 文件下创建system文件 */
				// component: () => import("../views/system/index.vue"),
				children: [
					{
						path: "/systemParam",
						name: "systemParam",
						meta: {
							title: '系统参数维护',
							icon: 'House'
						},
						/** 在src/views 文件下创建home文件 */
						component: () => import("../views/system/systemParam.vue"),
					},
					{
						path: "/codeCls",
						name: "codeCls",
						meta: {
							title: '标准代码维护',
							icon: 'House'
						},
						/** 在src/views 文件下创建home文件 */
						component: () => import("../views/system/codeCls.vue"),
					}
				]
			},
			{
				path: "/projectFund",
				name: "projectFund",
				meta: {
					title: '项目管理',
					icon: 'Grid'
				},
				/** 在src/views 文件下创建system文件 */
				// component: () => import("../views/projectFund/index.vue"),
				children: [
					{
						path: "/agrtManage",
						name: "agrtManage",
						meta: {
							title: '合同管理',
							icon: 'House'
						},
						/** 在src/views 文件下创建home文件 */
						component: () => import("../views/projectFund/agrtManage.vue"),
					},
					{
						path: "/orderManage",
						name: "orderManage",
						meta: {
							title: '订单管理',
							icon: 'House'
						},
						/** 在src/views 文件下创建home文件 */
						component: () => import("../views/projectFund/orderManage.vue"),
					}
				]

			}
		]
	}
]

// 创建路由对象
const router = createRouter({
	history:createWebHashHistory(),
	routes
});

export default router;