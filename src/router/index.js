
import {createRouter, createWebHashHistory} from "vue-router";

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
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
				component: () => import("@/components/HelloWorld.vue"),
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
						component: () => import("@/views/system/systemParam.vue"),
					},
					{
						path: "/codeCls",
						name: "codeCls",
						meta: {
							title: '标准代码维护',
							icon: 'House'
						},
						/** 在src/views 文件下创建home文件 */
						component: () => import("@/views/system/codeCls.vue"),
					}
				]
			},
			{
				path: "/siteSkills",
				name: "siteSkills",
				meta: {
					title: '站点技术',
					icon: 'Grid'
				},
				/** 在src/views 文件下创建siteSkills文件夹 */
				// component: () => import("../views/siteSkills/index.vue"),
				children: [
					{
						path: "/storageSkills",
						name: "storageSkills",
						meta: {
							title: '储存技术',
							icon: 'House'
						},

						children: [
							{
								path: "/mysqlSkill",
								name: "mysqlSkill",
								meta: {
									title: 'MYSQL数据库',
									icon: 'House'
								},
								/** 在src/views 文件下创建home文件 */
								component: () => import("@/views/siteSkills/storageSkills/mysqlSkill.vue"),
							},
							{
								path: "/redisSkill",
								name: "redisSkill",
								meta: {
									title: 'Redis缓存',
									icon: 'House'
								},
								/** 在src/views 文件下创建home文件 */
								component: () => import("@/views/siteSkills/storageSkills/redisSkill.vue"),
							}
						]
		


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