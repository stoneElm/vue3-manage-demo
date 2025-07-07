<template>
	<div class="left" style="color: white; font-size: 21px;">
		STONE 管理系统
	</div>
	<div class="right">
		<el-badge :value="reminderMessageValue" :max="99" class="item custom-badge" :hidden="reminderMessageValue === 0"
			@click="openChatDialog">
			<el-icon style="color: #c9c6c6" :size="22">
				<Message />
			</el-icon>
			<el-icon style="width: 4px;"></el-icon>
		</el-badge>

		<el-avatar :size="30" :src="circleUrl" />

		<el-dropdown>
			<span class="el-dropdown-link" style="color: darkgrey;">
				设置
				<el-icon class="el-icon--right">
					<arrow-down />
				</el-icon>
			</span>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item>设置账号</el-dropdown-item>
					<el-dropdown-item>更改头像</el-dropdown-item>
					<el-dropdown-item @click="exit">退出登录</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>

	<el-dialog v-model="chatDialogVisible" title="" :show-close="true" class="chat-dialog">
		<Chat :loginUserInvitedList="loginUserInvitedList" :loginUserConversationList="loginUserConversationList"></Chat>
	</el-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading, ElMessageBox } from "element-plus";
import { useWebSocketStore } from '@/utils/websocket.ts';

import Chat from '@/views/chat/chat.vue'

import { logout } from '@/api/userApi/userLoginApi'
import { selectLoginUserInvitedInfo } from '@/api/chat/chatConversationApp.js'
import { selectLoginUserConversationList } from '@/api/chat/chatConversation.js'

import api from "@/api/api.js";

var baseURL = api.defaults.baseURL;

// 弹框显示状态
const chatDialogVisible = ref(false)

// 输入的消息
const inputMessage = ref('')

// 消息容器引用（用于自动滚动到底部）
const messageContainer = ref(null)

const route = useRouter();

const circleUrl = ref(null);

const wsStore = useWebSocketStore();

const reminderMessageValue = ref(0)
const loginUserInvitedValue = ref(0)
const loginUserInvitedList = ref([])
const loginUserConversationList = ref([])
const unreadMessageValue = ref(0)

watch(() => loginUserInvitedList.value, (newVal) => {
	console.log('数据已更新--用户受邀信息--父组件:', newVal)
})

watch(() => loginUserConversationList.value, (newVal) => {
	console.log('数据已更新--用户会话信息--父组件:', newVal)
})

// 组件加载完成时执行
onMounted(() => {
	// 如果未登录
	if (!sessionStorage.getItem('Stone-Token')) {
		console.log('当前用户未登录，不允许连接webSocket！')
		return;
	}

	wsStore.connect('');

	// 监听websocket消息
	wsStore.onmessage = (event) => {
		let message = JSON.parse(event.data);

		if (message.messageType === 'Refresh unread') {
			console.log('webSocket 刷新未读消息！')

			// 获取当前用户受邀信息
			getLoginUserInvitedInfo();
			// 聊天会话信息
			getNumberOfUnreadMessages();
		}
	}

	// 获取头像
	circleUrl.value = baseURL + '/attachment/files/filePreview?'
		+ 'attachDtlID=' + JSON.parse(sessionStorage.getItem('userInfo')).avatarAttachDtlID
		+ '&stoneFileToken=' + sessionStorage.getItem('Stone-Token')
});

// 组件卸载时执行
onUnmounted(() => {
	console.log("关闭webSocket会话连接")
	if (wsStore.socket) {
		wsStore.disconnect();
	}
});

function getNumberOfUnreadMessages() {
	selectLoginUserConversationList({}).then(res => {
		if (res.code == '00000') {
			console.log('--- 查询聊天会话列表成功 ---', res);

			res.data.forEach((value, index, array) => {
				if (value.avatarAttachDtlID) {
					value.avatarUrl = baseURL + '/attachment/files/filePreview?'
						+ 'attachDtlID=' + value.avatarAttachDtlID
						+ '&stoneFileToken=' + sessionStorage.getItem('Stone-Token')
				}
				value.group = '好友'
			});

			console.log('--- 查询聊天会话列表成功 ---', res);

			unreadMessageValue.value = res.total
			loginUserConversationList.value = res.data
			reminderMessageValue.value = loginUserInvitedValue.value + unreadMessageValue.value
		}
	})
}

function getLoginUserInvitedInfo() {
	// 聊天会话待邀请信息

	selectLoginUserInvitedInfo({}).then(res => {
		if (res.code == '00000') {
			console.log('--- 查询聊天会话待邀请成功 ---', res.data);

			res.data.forEach((value, index, array) => {
				if (value.avatarAttachDtlID) {
					value.avatarUrl = baseURL + '/attachment/files/filePreview?'
						+ 'attachDtlID=' + value.avatarAttachDtlID
						+ '&stoneFileToken=' + sessionStorage.getItem('Stone-Token')
				}
			});

			loginUserInvitedValue.value = res.total
			loginUserInvitedList.value = res.data
			reminderMessageValue.value = loginUserInvitedValue.value + unreadMessageValue.value
		}
	})
}

function openChatDialog() {
	chatDialogVisible.value = true
}

function exit() {
	ElMessageBox.confirm(
		'退出登陆后再次访问页面需重新输入用户凭证信息!',
		'确定退出？',
		{
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning',
			draggable: true,
		}
	)
		.then(() => {
			console.log("确定退出")
			logout({}).then(res => {
				if (res.code == '00000') {
					console.log('--- 发起退出登录请求出参 ---', res)
					sessionStorage.removeItem('Stone-Token');
					sessionStorage.removeItem('stoneFileToken');
					route.push('/login');
				}
			})

		})
		.catch(() => {

		})
}

</script>

<style>
.example-showcase .el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}

.left {
	display: flex;
	padding-left: 30px;
	float: left;
	justify-content: space-between;
	align-items: center;
	margin-top: 15px;
}

.right {
	display: flex;
	padding-right: 30px;
	width: 125px;
	justify-content: space-between;
	align-items: center;
	float: right;
	margin-top: 17px;
}

.right .el-icon--right {
	display: none;
}

.item {
	margin-top: 10px;
	margin-right: 40px;
}

.chat-dialog>.el-dialog__body {
	padding: 0;
}

.chat-dialog>.el-dialog__headerbtn {
	height: 0;
}
</style>