<template>
    <div class="wechat-container">
        <div class="wechat-sidebar">
            <div class="search-box">
                <el-badge :value="loginUserInvitedList.length" :max="99" class="item custom-badge" :hidden="loginUserInvitedList.length === 0">
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
            <contact-list :contacts="contacts" :active-contact="activeContact" @select="handleSelectContact" />
        </div>
        <div class="wechat-main">
            <chat-main v-if="activeContact" :contact="activeContact" :messages="filteredMessages"
                @send="handleSendMessage" />
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
                        <el-input v-model="friendForm.userId" placeholder="请输入用户ID或账号" clearable />
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
                        <el-input v-model="groupForm.groupId" placeholder="请输入群组ID或名称" clearable />
                    </el-form-item>
                    <el-form-item label="验证信息" prop="message">
                        <el-input v-model="groupForm.message" type="textarea" :rows="3" placeholder="请输入验证信息（可选）"
                            maxlength="100" show-word-limit />
                    </el-form-item>
                </el-form>
            </el-tab-pane>

            <el-tab-pane label="验证消息" name="addChat">
                <template #label>
                    <el-badge :value="loginUserInvitedList.length" :max="99" class="item custom-badge" :hidden="loginUserInvitedList.length === 0">
                        <span >验证消息</span>
                    </el-badge>
                </template>
                <div v-if="loginUserInvitedList.length === 0" class="empty-chat">
                    <el-empty description="当前没有要验证的消息" :image-size="70" />
                </div>
                <el-scrollbar v-if="loginUserInvitedList.length !== 0" height="141" class="invited-list">
                    <div v-for="loginUserInvited in loginUserInvitedList" :key="loginUserInvited.beInvitedObjectID" class="invited-item" >
                        <el-avatar :size="40" :src="loginUserInvited.avatarUrl" />
                        <div class="invited-info" style="padding: 0 20px; width: 300px;">
                            <div style="display: flex; margin-bottom: 4px;">
                                <div class="username" style="width: 50%;">{{ loginUserInvited.invitedObjectName }}</div>
                                <!-- <div>在线</div> -->
                            </div>
                            <div class="last-message">验证消息：{{ loginUserInvited.verificationMessage }}</div>
                        </div>
                        <div class="invited-operate" >
                            <div class="agree"><el-button link type="primary" @click="agreeConversationRequest">同意</el-button></div>
                        </div>
                    </div>
                </el-scrollbar>
            </el-tab-pane>
        </el-tabs>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </span>
        </template>
    </el-dialog>

</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import ContactList from '@/views/chat/ContactList.vue'
import ChatMain from '@/views/chat/ChatMain.vue'
import { Message, MESSAGE_TYPE } from '@/utils/messageUtil';

import { selectChatConversationList } from '@/api/chat/chatConversation.js'
import { createChatConversationAppList } from '@/api/chat/chatConversationApp.js'

const props = defineProps({
        loginUserInvitedList: Array
    });

const searchText = ref('')
const activeContact = ref(null)


const dialogVisible = ref(false)
const activeTab = ref('friend')

const friendFormRef = ref(null)
const groupFormRef = ref(null)

const unreadMessageValue = ref(0)
const loginUserInvitedValue = ref(0)
const loginUserInvitedList = ref([])

const friendForm = ref({
    userId: '',
    message: ''
})

const groupForm = ref({
    groupId: '',
    message: ''
})

watch(() => props.loginUserInvitedList, (newVal) => {
	console.log('数据已更新--子组件:', newVal)
    loginUserInvitedList.value = newVal
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
        id: 2,
        name: '李四',
        avatar: '',
        group: '好友',
        lastMessage: '项目进展如何？',
        lastTime: '昨天',
        unread: 0
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
    if (!sessionStorage.getItem('Stone-Token')) {
        return;
    }

    let param = {
        chatConversationActor: JSON.parse(sessionStorage.getItem('userInfo')).userID
    }

    loginUserInvitedList.value = props.loginUserInvitedList

    console.log('----- 获取用户ID -----', JSON.parse(sessionStorage.getItem('userInfo')).userID)

    // 获取当前用户的会话列表
    selectChatConversationList(param).then(res => {
        if (res.code == '00000') {
            console.log('--- 获取当前用户的会话列表： ---', res.data);
            messages.value = res.data
        }
    })
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
    } else {
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

// 过滤出当前联系人的消息
const filteredMessages = computed(() => {
    if (!activeContact.value) return []
    return messages.value.filter(msg => msg.contactId === activeContact.value.id)
})

// 选择联系人
const handleSelectContact = (contact) => {
    activeContact.value = contact
    // 标记为已读
    const index = contacts.value.findIndex(c => c.id === contact.id)
    if (index !== -1) {
        contacts.value[index].unread = 0
    }
}

// 发送消息
const handleSendMessage = (content) => {
    if (!activeContact.value) return

    const newMessage = {
        id: messages.value.length + 1,
        contactId: activeContact.value.id,
        content,
        time: new Date().toLocaleTimeString(),
        isMe: true
    }

    messages.value.push(newMessage)

    // 更新联系人最后一条消息
    const contactIndex = contacts.value.findIndex(c => c.id === activeContact.value.id)
    if (contactIndex !== -1) {
        contacts.value[contactIndex].lastMessage = content
        contacts.value[contactIndex].lastTime = '刚刚'
    }
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

.add-container-dialog .el-dialog__body{
    padding-top: 0px;
    padding-bottom: 0px;
}

.add-container-dialog .empty-chat {
    height: 141px;
}

.add-container-dialog .el-tabs__nav {
    height: 50px;
}

.demo-tabs .el-badge span{
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
    color: #333;
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