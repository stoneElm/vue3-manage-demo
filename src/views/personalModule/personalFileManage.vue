<template>
    <el-button type="primary" @click="filePreview('video')">文件预览VIDEO</el-button>
    <el-button type="primary" @click="filePreview('pdf')">文件预览PDF</el-button>
    <el-button type="primary" @click="filePreview('mp3')">文件预览MP3</el-button>
    <el-button type="primary" @click="filePreview('text')">文件预览MP3</el-button>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
export default {
    data() {
        const route = useRoute();
        
    },
    methods: {
        filePreview(attachType) {
            console.log('文件预览');

            let stoneFileToken = sessionStorage.getItem('stoneFileToken');

            if (!stoneFileToken) {
                ElMessage({
                    message: '登录过期，请重新登录！',
                    type: 'error',
                    duration: 3.5 * 1000
                })
            }

            let attachDtlID;

            if (attachType === 'video') {
                attachDtlID = 1424070900000002;
            }

            if (attachType === 'pdf') {
                attachDtlID = 1424070900000001;
            }

            if (attachType === 'text') {
                attachDtlID = 1424062100000001;
            }

            if (attachType === 'map3') {
                attachDtlID = 1424071100000001;
            }

            sessionStorage.setItem('filePreviewAttachDtlID', attachDtlID);

            // let routeData = this.$router.resolve({ path: '/filePreview', query: filePreview });
            let routeData = this.$router.resolve({ path: '/filePreview'});

            window.open(routeData.href, '_blank');
            
        },
        
    },
    setup() {
        const route = useRoute();
    
        function openNewTab() {
            // 打开新标签页的逻辑
            const newTabRoute = {
                path: '/filePreview',
                name: 'filePreview'
            };
            route.push(newTabRoute);
        }

        // 其他设置...
    }
}
</script>

<style>

</style>