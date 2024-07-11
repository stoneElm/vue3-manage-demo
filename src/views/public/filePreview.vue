<template>
    <div class="common-layout file-preview">
        <el-container class="preview-body">
            <div ref="playerContainer" v-show="isPlayer"></div>
            <div class="file-preview-center" v-show="!isPlayer">文件加载中</div>
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
    var isPlayer = ref(false);

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
            player.destroy();
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
                isPlayer.value = ref(true)
                initPlayer();
            }
            
            return response.data;
        } catch (error) {
            // 处理错误
            console.error(error);
            throw error;
        }
    }

    function initPlayer() {

        console.log('initPlayer:',filePreview);

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
.dplayer.dplayer-no-danmaku.dplayer-arrow {
    margin: 0 auto;
}
.file-preview-center {
    margin: 0 auto;
}
</style>