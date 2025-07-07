<template>
    <div class="wechat-container">
        <div class="wechat-sidebar">
            <div class="search-box">
                <el-badge :value="loginUserInvitedList.length" :max="99" class="item custom-badge"
                    :hidden="loginUserInvitedList.length === 0">
                    <el-input placeholder="搜索" prefix-icon="el-icon-search" v-model="searchText" clearable>
                        <template #append>
                            <el-button type="primary" circle @click="dialogVisible = true">
                                <el-icon>
                                    <Plus />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-input>
                </el-badge>

            </div>
            <contact-list :contacts="loginUserConversationList" :active-contact="activeContact"
                @select="handleSelectContact" />
        </div>
        <div class="wechat-main">
            <chat-main v-if="activeContact" :contact="activeContact" :messages="messages" :otherAvatarUrl="otherAvatarUrl" @send-message="handleSendMessage" />
            <div v-else class="empty-chat">
                <el-empty description="请选择聊天对象" />
            </div>
        </div>
    </div>


    <el-dialog v-if="dialogVisible" v-model="dialogVisible" title="添加好友或群组" width="25vm" :before-close="handleClose"
        custom-class="add-container-dialog" class="add-container-dialog">

        <el-tabs v-model="activeTab" class="demo-tabs">
            <el-tab-pane label="添加好友" name="friend">
                <template #label>
                    <el-badge :value="unreadMessageValue" :max="99" class="item custom-badge" :hidden="0 === 0">
                        <span>添加好友</span>
                    </el-badge>
                </template>
                <el-form ref="friendFormRef" :model="friendForm" :rules="formRules" label-width="100px">
                    <el-form-item label="用户ID/账号" prop="userId">
                        <el-input v-model="friendForm.userId" placeholder="请输入用户账号" clearable />
                    </el-form-item>
                    <el-form-item label="验证信息" prop="message">
                        <el-input v-model="friendForm.message" type="textarea" :rows="3" placeholder="请输入验证信息（可选）"
                            maxlength="100" show-word-limit />
                    </el-form-item>
                </el-form>
            </el-tab-pane>

            <el-tab-pane label="添加群组" name="group">
                <template #label>
                    <el-badge :value="unreadMessageValue" :max="99" class="item custom-badge" :hidden="0 === 0">
                        <span>添加群组</span>
                    </el-badge>
                </template>
                <el-form ref="groupFormRef" :model="groupForm" :rules="formRules" label-width="100px">
                    <el-form-item label="群组ID/名称" prop="groupId">
                        <el-input v-model="groupForm.groupId" placeholder="请输入群组ID" clearable />
                    </el-form-item>
                    <el-form-item label="验证信息" prop="message">
                        <el-input v-model="groupForm.message" type="textarea" :rows="3" placeholder="请输入验证信息（可选）"
                            maxlength="100" show-word-limit />
                    </el-form-item>
                </el-form>
            </el-tab-pane>

            <el-tab-pane label="验证消息" name="addChat">
                <template #label>
                    <el-badge :value="loginUserInvitedList.length" :max="99" class="item custom-badge"
                        :hidden="loginUserInvitedList.length === 0">
                        <span>验证消息</span>
                    </el-badge>
                </template>
                <div v-if="loginUserInvitedList.length === 0" class="empty-chat">
                    <el-empty description="当前没有要验证的消息" :image-size="70" />
                </div>
                <el-scrollbar v-if="loginUserInvitedList.length !== 0" height="141" class="invited-list">
                    <div v-for="loginUserInvited in loginUserInvitedList" :key="loginUserInvited.beInvitedObjectID"
                        class="invited-item">
                        <el-avatar :size="40" :src="loginUserInvited.avatarUrl" />
                        <div class="invited-info" style="padding: 0 20px; width: 300px;">
                            <div style="display: flex; margin-bottom: 4px;">
                                <div class="username" style="width: 40%;">账户：{{ loginUserInvited.invitedObjectName }}
                                </div>
                                <div class="nick-name" style="width: 60%;">昵称：{{ loginUserInvited.nickName }}</div>
                            </div>
                            <div class="last-message">验证消息：{{ loginUserInvited.verificationMessage }}</div>
                        </div>
                        <div class="invited-operate">
                            <div class="agree"><el-button link type="primary"
                                    @click="agreeConversationRequest">同意</el-button></div>
                        </div>
                    </div>
                </el-scrollbar>
            </el-tab-pane>
        </el-tabs>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit" :disabled="submitDisabled">确定</el-button>
            </span>
        </template>
    </el-dialog>

</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import ContactList from '@/views/chat/ContactList.vue'
import ChatMain from '@/views/chat/ChatMain.vue'
import { Message, MESSAGE_TYPE } from '@/utils/messageUtil';

import api from "@/api/api.js";

import { selectChatMessageListByConversationID, createChatMessageList } from '@/api/chat/chatMessage.js'
import { createChatConversationAppList } from '@/api/chat/chatConversationApp.js'

const props = defineProps({
    loginUserInvitedList: Array,
    loginUserConversationList: Array
});

const searchText = ref('')
const activeContact = ref(null)


const dialogVisible = ref(false)
const activeTab = ref('friend')

const friendFormRef = ref(null)
const groupFormRef = ref(null)

const unreadMessageValue = ref(0)
const loginUserConversationList = ref([])
const loginUserInvitedList = ref([])

const submitDisabled = ref(false)

const friendForm = ref({
    userId: '',
    message: ''
})

const groupForm = ref({
    groupId: '',
    message: ''
})

const otherAvatarUrl = ref('')

watch(() => props.loginUserInvitedList, (newVal) => {
    console.log('数据已更新--受邀信息--子组件:', newVal)
    loginUserInvitedList.value = newVal
})

watch(() => props.loginUserConversationList, (newVal) => {
    console.log('数据已更新--会话信息--子组件:', newVal)
    loginUserConversationList.value = newVal
})

watch(() => props.otherAvatarUrl, (newVal) => {
    // console.log('数据已更新--对话头像信息--父组件:', newVal)
    otherAvatarUrl.value = newVal
})

watch(() => activeTab.value, (newVal) => {
    if (activeTab.value === 'addChat') {
        submitDisabled.value = true
    } else {
        submitDisabled.value = false
    }
})

const formRules = {
    userId: [
        { required: true, message: '请输入用户账号', trigger: 'blur' },
        { min: 6, max: 16, message: '长度在6到16个字符', trigger: 'blur' }
    ],
    groupId: [
        { required: true, message: '请输入群组ID或名称', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在3到20个字符', trigger: 'blur' }
    ]
}


// 模拟联系人数据
const contacts = ref([
    {
        id: 1,
        name: '张三',
        avatar: '',
        group: '好友',
        lastMessage: '你好，最近怎么样？',
        lastTime: '10:30',
        unread: 2
    },
    {
        chatConversationID: 2,
        conversationNickName: '李四',
        avatarUrl: '',
        group: '好友',
        conversationLastMessage: '项目进展如何？',
        conversationLastMessageDate: '昨天',
        unreadMessagesNumber: 0
    }
])

// 模拟消息数据
const messages = ref([
    { id: 1, contactId: 1, content: '你好，最近怎么样？', time: '10:30', isMe: false },
    { id: 2, contactId: 1, content: '还不错，项目刚上线', time: '10:32', isMe: true },
    { id: 3, contactId: 1, content: '你呢？', time: '10:32', isMe: true },
    { id: 4, contactId: 2, content: '项目进展如何？', time: '09:15', isMe: false },
    { id: 5, contactId: 3, content: '这个问题怎么解决？', time: '昨天 15:30', isMe: false, sender: '王五' }
])

onMounted(() => {
    loginUserInvitedList.value = props.loginUserInvitedList
    loginUserConversationList.value = props.loginUserConversationList

    if (!sessionStorage.getItem('Stone-Token')) {
        return;
    }
})

// 添加到会话
function handleSubmit() {
    if (activeTab.value === 'friend') {
        friendFormRef.value.validate((valid) => {
            if (valid) {
                // 发送会话验证申请到被申请人
                let param = [{
                    beInvitedObjectName: friendForm.value.userId
                }]

                createChatConversationAppList(param).then(res => {
                    if (res.code == '00000') {
                        console.log('--- 申请信息发送成功 ---', res.data);
                        dialogVisible.value = false
                        Message('申请信息发送成功！', MESSAGE_TYPE.MESSAGE_TYPE_SUCCESS)
                    }
                })


            } else {
                return false
            }
        })
    } else if ((activeTab.value === 'group')) {
        groupFormRef.value.validate((valid) => {
            if (valid) {
                addGroup()
            } else {
                return false
            }
        })
    }
}

// 同意会话请求
function agreeConversationRequest() {

}

// 选择联系人
const handleSelectContact = (contact) => {
    activeContact.value = contact

    console.log('----- 当前选择会话信息 -----', contact);

    otherAvatarUrl.value = contact.avatarUrl

    let param = {
        chatConversationID: activeContact.value.chatConversationID
    }

    // 查询当前会话消息
    selectChatMessageListByConversationID(param).then(res => {
        if (res.code == '00000') {

            res.data.forEach((value, index, array) => {
				if (value.avatarAttachDtlID) {
					value.avatarUrl = api.defaults.baseURL + '/attachment/files/filePreview?'
						+ 'attachDtlID=' + value.avatarAttachDtlID
						+ '&stoneFileToken=' + sessionStorage.getItem('Stone-Token')
				}
			});

            console.log('--- 通过会话唯一标识查询聊天记录成功 ---', res.data);

            messages.value = res.data
        }
    })

    // 消息标记为已读

}

// 发送消息
const handleSendMessage = (content) => {
    if (!activeContact.value) return

    const newMessage = [{
        chatConversationNo: activeContact.value.chatConversationNo,
        messageType: "01",
        senderID: activeContact.value.chatConversationActorID,
        receiver_id: activeContact.value.conversationObjectID,
        content: content
    }]

    console.log('----- 发送消息钩子 -----', newMessage)

    createChatMessageList(newMessage).then(res => {
        if (res.code == '00000') {
            console.log('--- 聊天消息发送成功 ---', res.data);
        } else {
            Message('申请信息发送失败！', MESSAGE_TYPE.MESSAGE_TYPE_ERROR)
        }
    })
}

</script>

<style>
.wechat-container {
    display: flex;
    width: calc(50vw);
    height: 50vh;
    overflow: hidden;
}

.wechat-sidebar {
    width: 280px;
    height: 100%;
    border-right: 1px solid #e6e6e6;
    display: flex;
    flex-direction: column;
}

.search-box {
    padding-top: 0px;
    padding-right: -10px;
    padding-left: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e6e6e6;
}

.wechat-main {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
}

.empty-chat {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.demo-tabs {
    margin: 0;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
}

.add-container-dialog.el-dialog {
    width: 500px !important;
    --el-dialog-margin-top: 25vh;
    --el-dialog-width: calc(30vw);
}

.add-container-dialog .el-dialog__body {
    padding-top: 0px;
    padding-bottom: 0px;
}

.add-container-dialog .empty-chat {
    height: 141px;
}

.add-container-dialog .el-tabs__nav {
    height: 50px;
}

.demo-tabs .el-badge span {
    font-size: 15px;
    padding-left: 24px;
    color: #505153;
}

.invited-item {
    display: flex;
    padding: 12px;
    cursor: pointer;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
}

.invited-item:nth-child(1) {
    padding-top: 0px;
}

.invited-info div {
    text-align: left;
}

.invited-info .username {
    font-size: 14px;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.invited-info .invited-operate {
    font-size: 12px;
    color: #999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>