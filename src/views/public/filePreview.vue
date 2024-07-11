<template>
    <div class="common-layout file-preview">
        <el-container class="preview-body">
            <!-- 视频 -->
            <div ref="playerContainer" v-show="isPlayer"></div>

            <!-- 音频 -->
            <div v-show="isAudio" class='file-preview-center'>
                <div class="audio-name file-preview-center">{{ audioName }}</div>
                <div class="audio-logo file-preview-center"></div>
                <audio ref="audioContainer" autoplay controls :src="audioSource"></audio>
            </div>

            <!-- 无法获取文件 -->
            <div class="file-preview-center" v-show="isLoadFail">
                
            </div>
        </el-container>
    </div>
</template>
   
<script setup>
    import { ref, reactive, onMounted, onBeforeMount, onBeforeUnmount } from 'vue';
    import api from "@/api/api.js";
    import DPlayer from 'dplayer';
    import { ElMessage } from "element-plus";
    import axios from 'axios';
    import Hls from 'hls.js';

    import {
        queryAttachDtlList
    } from '@/api/attachApi/attachApi'
   
    const playerContainer = ref(null);
    const audioContainer = ref(null);
    const audioSource = ref('');
    const audioName = ref('');
    var isPlayer = ref(false);
    var isAudio = ref(false);
    var isLoadFail = ref(true);

    let player;

    // let filePreview = JSON.parse(sessionStorage.getItem('filePreview'))
    let filePreview = {
        attachDtlID: null,
        attachDtlContentType: null,
        attachDtlType: null,
        stoneFileToken: null
    }

    onBeforeMount(async () => {

    });
   
    onMounted(() => {
        const attachDtlID = sessionStorage.getItem('filePreviewAttachDtlID');

        initAttachDtlData(attachDtlID);
    });
   
    onBeforeUnmount(() => {
        console.log('----- onBeforeUnmount -----')
        if (playerContainer) {
            console.log('----- 开始销毁 -----')
            player.value.destroy();
        }
    });

    async function initAttachDtlData(attachDtlID) {

        if (!attachDtlID) {
            ElMessage({
                message: '加载失败,无法获取文件标识！',
                type: 'error',
                duration: 3.5 * 1000
            })
            return null;
        }

        try {
            const url = api.defaults.baseURL + '/attachment/files/selectAttachDtlList';
            const params = {attachDtlID: attachDtlID}
            const headers = {
                'Content-Type': 'application/json',
                'Stone-Token': sessionStorage.getItem('stoneFileToken')
            }

            // 使用 await 等待 Axios 请求完成
            const response = await axios.post(url, params, {headers});
            // 处理响应数据
            console.log('----- 获取请求数据出参 -----', response)
            filePreview = response.data.data[0];
            filePreview.stoneFileToken = sessionStorage.getItem('stoneFileToken')
            console.log('----- filePreview -----', filePreview)

            if (filePreview.attachDtlType === 'video') {
                isPlayer.value = true
                isLoadFail.value = false
                initPlayer();
            }

            if (filePreview.attachDtlType === 'audio') {
                isAudio.value = true
                isLoadFail.value = false
                initAudio();
            }
            
            return response.data;
        } catch (error) {
            // 处理错误
            console.error(error);
            throw error;
        }
    }

    function initPlayer() {

        console.log('initPlayer:', filePreview);

        player = new DPlayer({
            // container: videoContainer.value,
            container: playerContainer.value,
            // 其他配置...
            video: {
                url: api.defaults.baseURL + '/attachment/files/filePreview?' 
                                + 'attachDtlID=' + filePreview.attachDtlID
                                + '&stoneFileToken=' + filePreview.stoneFileToken
                                ,   // 视频 URL 或视频对象
                type: filePreview.attachDtlContentType,  // 视频类型，这里是 video/mp4
            },
        });

    }

    function initAudio() {

        console.log('initAudio:', filePreview);
        console.log('isLoadFail:', isLoadFail.value);

        let url = api.defaults.baseURL + '/attachment/files/filePreview?' 
                                + 'attachDtlID=' + filePreview.attachDtlID
                                + '&stoneFileToken=' + filePreview.stoneFileToken
                                ; // 视频 URL 或视频对象

        console.log('audioSource', url);

        // 设置音频名称
        let attachDtlName = filePreview.attachDtlName;
        let index = attachDtlName.lastIndexOf('.');
        if (index > -1) {
            audioName.value = attachDtlName.substring(0, index);
        } else {
            audioName.value = attachDtlName
        }

        // 设置音频源
        audioSource.value = url;

        // 播放音频
        audioContainer.value.load();

    }

</script>

<style>
.file-preview {
    background-color: black;
    height: 100vh;

    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
}
.preview-body {
    max-height: 100vh;
    overflow: auto;
}
.file-preview-center {
    margin: 0 auto;
}
.audio-name {
    margin-bottom: 20px;
    color: white;
}
.audio-logo {
    height: 200px;
    width: 200px;
    background-image: url("@/assets/image/filePreview/audio_logo.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    border-radius: 100px;
    margin-bottom: 20px;
}
</style>