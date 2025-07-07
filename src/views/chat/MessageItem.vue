<template>
    <div class="message-item" :class="{ 'is-me': message.currentUserMessage }">
        <el-avatar :size="36" :src="message.currentUserMessage ? myAvatarUrl : message.avatarUrl" />
        <div class="message-content">
            <div v-if="false" class="message-sender"></div>
            <div class="message-bubble">{{ message.content }}</div>
            <div class="message-time">{{ message.messageSendDateStr }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, onMounted, watch } from 'vue'
import api from "@/api/api.js";

const otherAvatarUrl = ref('')
const myAvatarUrl = ref('')

const props = defineProps({
    otherAvatarUrl: String,
    message: Object
});

watch(() => props.otherAvatarUrl, (newVal) => {
    // console.log('数据已更新--对话头像信息--孙子组件:', newVal)
    otherAvatarUrl.value = newVal
})

onMounted(() => {
    // 如果未登录
	if (!sessionStorage.getItem('Stone-Token')) {
		console.log('当前用户未登录，不加载头像！')
		return;
	}

    // 获取头像
	myAvatarUrl.value = api.defaults.baseURL + '/attachment/files/filePreview?'
		+ 'attachDtlID=' + JSON.parse(sessionStorage.getItem('userInfo')).avatarAttachDtlID
		+ '&stoneFileToken=' + sessionStorage.getItem('Stone-Token')

})


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