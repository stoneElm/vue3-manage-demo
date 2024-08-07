
import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Login from '@/views/login/login.vue'
import Layout from '@/layout/index.vue'
import FilePreview from '@/views/public/filePreview.vue'

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
		path: '/filePreview', 
		name: 'filePreview', 
		component: FilePreview,
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
					not_login_required: true,
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
					not_login_required: false,
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
				path: "/personalCenter",
				name: "personalCenter",
				meta: {
					not_login_required: false,
					title: '个人中心',
					icon: 'Grid'
				},
				children: [
					{
						path: "/documentCenter",
						name: "documentCenter",
						meta: {
							title: '文档中心',
							icon: 'House'
						},
						/** 在src/views 文件下创建home文件 */
						component: () => import("@/views/personalCenter/documentCenter.vue")
					}
				]
			},
			{
				path: "/siteSkills",
				name: "siteSkills",
				meta: {
					not_login_required: false,
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
			},
			{
				path: "/devSupport",
				name: "devSupport",
				meta: {
					not_login_required: false,
					title: '研发支撑',
					icon: 'Grid'
				},
				children: [
					{
						path: "/codeSupport",
						name: "codeSupport",
						meta: {
							title: '代码支撑',
							icon: 'House'
						},

						children: [
							{
								path: "/produceCURD",
								name: "produceCURD",
								meta: {
									title: 'CURD生成',
									icon: 'House'
								},
								/** 在src/views 文件下创建home文件 */
								component: () => import("@/views/devSupport/codeSupport/produceCURD.vue"),
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
	history: createWebHistory(),
	routes
});

router.beforeEach((to, from, next) => {
	let not_login_required = to.matched.some((record) => {return record.meta.not_login_required});
	
	// 判断是否已经登陆,是否本身就是登陆页面,是否必须登录
	if (!sessionStorage.getItem('Stone-Token') && to.fullPath !== '/login' && !not_login_required) {
		if (to.fullPath === '/filePreview') {
			next();
		} else {
			next('/login');
		}
	} else {
		next();
	}
});

export default router;