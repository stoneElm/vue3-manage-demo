<template>
    <div class="common-layout file-preview">
        <el-container class="preview-body">
            <!-- 视频 -->
            <div ref="playerContainer" class='file-preview-center' v-show="isPlayer" v-cloak></div>

            <!-- 音频 -->
            <div v-show="isAudio" class='file-preview-center'>
                <div class="audio-name file-preview-center">{{ audioName }}</div>
                <div class="audio-logo file-preview-center"></div>
                <audio ref="audioContainer" autoplay controls :src="audioSource"></audio>
            </div>

            <!-- pdf -->
            <div v-if="isPdf" class="file-preview-center"> 
                <div class="h-full w-full overflow-hidden rounded-lg">
                    <iframe class="border-0"
                        title="预览文档"
                        :src="pdfUrl"
                        width="100%"
                        height="100%"
                    ></iframe>
                </div>
            </div>

            <!-- text -->
            <div v-if="isText" class="file-preview-center file-preview-center-text">
                <div class="h-full w-full overflow-hidden">
                    <pre>{{ textContent }}</pre>
                </div>
            </div>

            <!-- 无法获取文件 -->
            <div class="file-preview-center" v-show="isLoadFail">
                
            </div>
        </el-container>
    </div>
</template>
   
<script setup>
    import { ref, reactive, onMounted, onBeforeMount, onBeforeUnmount } from 'vue';
    import { useRoute } from 'vue-router';
    import api from "@/api/api.js";
    import { ElMessage } from "element-plus";
    import axios from 'axios';

    import DPlayer from 'dplayer';
    import Hls from 'hls.js';

    const route = useRoute();

    let player;
    const playerContainer = ref(null);
    const isPlayer = ref(false);

    /* audio */
    const audioSource = ref('');
    const audioName = ref('');
    const audioContainer = ref(null);
    const isAudio = ref(false);

    /* PDF */
    const isPdf = ref(false);
    const pdfUrl = ref('');

    const isText = ref(false);
    const textContent = ref('');

    // let filePreview = JSON.parse(sessionStorage.getItem('filePreview'))
    const isLoadFail = ref(true);
    let filePreview = {
        attachDtlID: null,
        attachDtlContentType: null,
        attachDtlType: null,
        stoneFileToken: null
    }

    onBeforeMount(async () => {

    });
   
    onMounted(() => {
        let attachDtlID = sessionStorage.getItem('filePreviewAttachDtlID');

        // 参数获取优先级 路径

        console.log('----- 从路径获取参数信息 -----')
        console.log('----- route -----', route.query)
        // attachDtlID =  route.query.attachDtlID

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

            if (filePreview.attachDtlContentType === 'application/pdf') {
                isPdf.value = true
                isLoadFail.value = false
                initPdf();
            }

            if (filePreview.attachDtlType === 'text') {
                isText.value = true
                isLoadFail.value = false
                initText();
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

            // autoplay: true,     // 自动播放
        });

    }

    function initAudio() {

        console.log('initAudio:', filePreview);
        console.log('isLoadFail:', isLoadFail.value);

        let url = api.defaults.baseURL + '/attachment/files/filePreview?' 
                                + 'attachDtlID=' + filePreview.attachDtlID
                                + '&stoneFileToken=' + filePreview.stoneFileToken
                                ; // 音频 URL

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

    function initPdf() {
        console.log('initPdf:', filePreview);

        let url = api.defaults.baseURL + '/attachment/files/filePreview?' 
                                + 'attachDtlID=' + filePreview.attachDtlID
                                + '&stoneFileToken=' + filePreview.stoneFileToken
                                ; // PDF URL

        console.log('pdfUrl', url);
        let encodeUrl = encodeURIComponent(url)
        console.log('encodeUrl', url);
        pdfUrl.value = '/pdfjs-dist/web/viewer.html?file=' + encodeUrl;
    }

    function initText() {
        console.log('initText:', filePreview);

        let url = api.defaults.baseURL + '/attachment/files/filePreview?' 
                                + 'attachDtlID=' + filePreview.attachDtlID
                                + '&stoneFileToken=' + filePreview.stoneFileToken
                                ; // PDF URL

        axios.get(url, {
            responseType: 'text'
        })
        .then(response => {
            textContent.value = response.data;
        })
        .catch(error => {
            console.error('Error fetching file:', error);
        });
    }

    function initPdfByCanvas(pdf) {
        // 获取 PDF 文档的信息
        console.log(pdf.numPages);

        // 准备一个 canvas 元素用于渲染 PDF 页面
        const canvas = document.getElementById('pdfCanvas');
        console.log('canvas', canvas);
        const context = canvas.getContext('2d');

        // 指定要渲染的 PDF 页面编号
        const pageNumber = 1;

        // 使用 PDF.js 的 render 方法渲染页面
        const renderPromise = pdf.getPage(pageNumber).then(function(page) {
            // 设置 canvas 的大小等于 PDF 页面的大小
            const viewport = page.getViewport({ scale: 1.0 });
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            // 绘制 PDF 页面到 canvas 上
            return page.render({ canvasContext: context, viewport: viewport });
        });

        // 等待渲染完成后，将 canvas 插入到 div 中
        renderPromise.then(function() {
            document.getElementById('pdfContainer').appendChild(canvas);
        });
    }

</script>

<style>
.file-preview {
    background-color: black;
    height: 100vh;
    width: 100vm;

    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
}
.preview-body {
    max-height: 100vh;
}
.file-preview-center {
    margin: 0 auto;
    width: 100%;
}
.file-preview-center-text {
    overflow: auto;
    padding: 0px 8px;
    color:aliceblue
}
.file-preview-center-text pre {
    text-align:left
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
    animation: rotateBackground 10s linear infinite;
}
/* 定义旋转动画 */
@keyframes rotateBackground {
    0% {
        transform: rotate(0deg); /* 初始状态，不旋转 */
    }
    100% {
        transform: rotate(360deg); /* 最终状态，旋转360度 */
    }
}
.border-0 {
    border: 0px;
}
.h-full{
    height: 100vh;
} 
.w-full {
    width: 100vm;
}
.overflow-hidden {
    overflow: hidden;
}
.background-color-white {
    background-color: white;
}
[v-cloak] {
  display: none;
}
@media only screen and (max-width: 768px) {
    .preview-body {
        min-width: 100vm;
    }
}
</style>