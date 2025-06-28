<template>
    <div class="message-item" :class="{ 'is-me': message.isMe }">
        <div class="message-content">
            <div v-if="message.sender && !message.isMe" class="message-sender">哈哈{{ message.sender }}</div>
            <div class="message-bubble">{{ message.content }}</div>
            <div class="message-time">{{ message.time }}</div>
        </div>
        <el-avatar :size="36" :src="message.isMe ? myAvatar : contactAvatar" />
    </div>
</template>

<script>
import { computed } from 'vue'

export default {
    props: {
        message: {
            type: Object,
            required: true
        }
    },
    setup() {
        const myAvatar = 'https://via.placeholder.com/36/0084ff/ffffff?text=ME'
        const contactAvatar = 'https://via.placeholder.com/36'
    
        return {
            myAvatar,
            contactAvatar
        }
    }
}
</script>

<style scoped>
.message-item {
    display: flex;
    margin-bottom: 16px;
}

.message-item.is-me {
    flex-direction: row-reverse;
}

.message-item.is-me .message-content {
    align-items: flex-end;
}

.message-content {
    max-width: 60%;
    display: flex;
    flex-direction: column;
    margin: 0 12px;
}

.message-sender {
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
}

.message-bubble {
    padding: 10px 14px;
    border-radius: 4px;
    background-color: #fff;
    position: relative;
    word-break: break-word;
}

.message-item.is-me .message-bubble {
    background-color: #95ec69;
}

.message-time {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
}
</style>