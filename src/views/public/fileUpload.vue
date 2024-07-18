<template>

    <!-- 
        :action="uploadUrl"         请求路径
        :headers="uploadHeaders"    添加请求头
        :data="uploadData"          添加参数
    -->

    <el-upload
            class="upload-demo"
            ref="fileUpload"
        
            :http-request="handleFileUpload"

            action="#"

            :before-upload="handleBeforeUpload"
            :on-progress="handleProgress"
            :on-success="handleSuccess"
            :before-remove="handleBeforeRemove"

            :file-list="fileList"
            show-file-list
            drag
            :multiple="multiple"
            :disabled="disabled"
            :auto-upload="autoUpload">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或点击上传</div>
    </el-upload>
    <el-progress :percentage="progressBarValue"></el-progress>
</template>
   
<script setup>
    import { ref, reactive, onMounted, onBeforeMount, onBeforeUnmount } from 'vue';
    import { useRoute } from 'vue-router';
    import api from "@/api/api.js";
    import { ElMessage } from "element-plus";

    const route = useRoute();

    // 禁止上传
    const disabled = ref(false);
    // 自动上传服务器
    const autoUpload = ref(true);
    // 自动上传服务器
    const multiple = ref(true);
    // 进度条
    const progressBarValue = ref(0);

    const fileList = ref([]);

    // 上传路径
    const uploadUrl = ref(
        api.defaults.baseURL + '/attachment/files/batchUpload' 
    ) 

    const uploadHeaders = ref({
        'Content-Type': 'multipart/form-data',
        'Stone-Token': sessionStorage.getItem('stoneFileToken')
    })

    const uploadData = ref({
        attachID: null
    })

    onBeforeMount(() => {

    });
   
    onMounted(() => {
        
    });
   
    onBeforeUnmount(() => {
        
    });

    // 文件上传前钩子
    function handleBeforeUpload (file) {
        console.log('----- beforeUpload -----')

        return true;
    }

    // 进度跟踪钩子
    function handleProgress (event, file, fileList) {
        console.log('----- handleProgress -----')
        progressBarValue.value = event.percent;   // 更新进度条值
    }

    // 成功后钩子
    function handleSuccess(response, file, fileList) {
        console.log('----- handleSuccess -----')

    }

    // 文件删除前
    function handleBeforeRemove(file, fileList) {
        console.log('----- handleBeforeRemove -----')
    }

    // 文件上传
    function handleFileUpload(file) {
        console.log('----- handleFileUpload -----')

        console.log('----- file -----', file.file)

        const formData = new FormData();
        formData.append('file', file.file);
    }

    
</script>

<style>
.el-upload-dragger {
    padding: 25px 10px;
}
.el-upload-dragger .el-icon--upload {
    font-size: 32px;
    margin-bottom: 8px
}
</style>