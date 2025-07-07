<template>
    <div class="chat-main">
        <div class="chat-header">
            <el-avatar :size="40" :src="contact.avatarUrl" />
            <div class="header-info">
                <div class="name">{{ contact.conversationUserName }}</div>
                <div class="status">{{ contact.conversationOnLineStat === '02'? '在线': '离线' }}</div>
            </div>
        </div>

        <div class="chat-messages" ref="messagesContainer">
            <el-scrollbar>
                <div class="messages-content">
                    <message-item v-for="message in messages" :key="message.chatMessageID" :message="message" :otherAvatarUrl="otherAvatarUrl" />
                </div>
            </el-scrollbar>
        </div>

        <div class="chat-input">
            <div class="input-toolbar">
                <el-icon>
                    <Picture />
                </el-icon>
                <el-icon>
                    <Folder />
                </el-icon>
                <el-icon>
                    <Microphone />
                </el-icon>
            </div>
            <el-input type="textarea" :rows="4" resize="none" v-model="inputMessage" @keyup.enter="sendMessage"
                placeholder="输入消息..." />
            <div class="input-actions">
                <el-button type="primary" size="small" @click="sendMessage">发送</el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, defineEmits, nextTick } from 'vue'
import MessageItem from '@/views/chat/MessageItem.vue'

const props = defineProps({
    contact: {
        type: Object,
        required: true
    },
    messages: {
        type: Array,
        default: () => []
    },
    otherAvatarUrl: String
});

const inputMessage = ref('')
const otherAvatarUrl = ref('')
const messagesContainer = ref(null)

const emit = defineEmits(['send-message']);

watch(() => props.otherAvatarUrl, (newVal) => {
    // console.log('数据已更新--对话头像信息--子组件:', newVal)
    otherAvatarUrl.value = newVal
})

// 当消息变化时自动滚动
watch(() => props.messages, () => {
    nextTick(() => {
        scrollToBottom()
    })
}, { deep: true })

// 发送消息
const sendMessage = () => {
    if (!inputMessage.value.trim()) return

    emit('send-message', inputMessage.value);

    inputMessage.value = ''

    // 滚动到底部
    nextTick(() => {
        scrollToBottom()
    })
}

// 滚动到底部
const scrollToBottom = () => {
    if (messagesContainer.value) {
        const scrollbar = messagesContainer.value.querySelector('.el-scrollbar__wrap')
        if (scrollbar) {
            scrollbar.scrollTop = scrollbar.scrollHeight
        }
    }
}

</script>

<style scoped>
.chat-main {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.chat-header {
    display: flex;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #e6e6e6;
    background-color: #fff;
}

.header-info {
    flex: 1;
    margin-left: 12px;
}

.header-info .name {
    font-size: 16px;
    font-weight: bold;
}

.header-info .status {
    font-size: 12px;
    color: #999;
}

.header-actions {
    margin-left: auto;
}

.chat-messages {
    flex: 1;
    overflow: hidden;
    padding: 20px;
    background-color: #f5f5f5;
}

.messages-content {
    display: flex;
    flex-direction: column;
    min-height: 100%;
}

.chat-input {
    border-top: 1px solid #e6e6e6;
    background-color: #fff;
}

.input-toolbar {
    padding: 8px 12px;
    border-bottom: 1px solid #f0f0f0;
}

.input-toolbar {
    display: flex;
    justify-content: flex-start;
    /* 左对齐 */
    gap: 10px;
    /* 图标间距 */
}

.input-actions {
    padding: 8px 12px;
    text-align: right;
    border-top: 1px solid #f0f0f0;
}
</style>