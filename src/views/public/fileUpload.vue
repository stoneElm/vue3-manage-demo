<template>

    <!-- 
        :action="uploadUrl"         请求路径
        :headers="uploadHeaders"    添加请求头
        :data="uploadData"          添加参数
    -->

    <el-progress :percentage="progressBarValue" style="margin-bottom: 8px;"></el-progress>
    <el-upload
            class="upload-demo"
            ref="fileUpload"
        
            :http-request="handleFileUpload"

            action="#"

            :before-upload="handleBeforeUpload"
            :on-progress="handleProgress"
            :on-success="handleSuccess"
            :on-error="handleError"
            :before-remove="handleBeforeRemove"
            :on-remove="handleOnRemove"

            :file-list="fileList"
            show-file-list
            drag
            :multiple="multiple"
            :disabled="disabled"
            :auto-upload="autoUpload">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或点击上传</div>
    </el-upload>
</template>
   
<script setup>
    import { ref, defineEmits , onMounted, onBeforeMount, onBeforeUnmount } from 'vue';
    import { useRoute } from 'vue-router';
    import api from "@/api/api.js";
    import { ElMessage } from "element-plus";
    import axios from 'axios';

    const route = useRoute();

    const props = defineProps({
        disabled: Boolean,
        multiple: Boolean
    });

    const fileUpload = ref(null)

    // 禁止上传
    const disabled = ref(false);
    // 自动上传服务器
    const autoUpload = ref(true);
    // 多文件上传
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

    // 上传进度监听
    const onUploadProgress = (progressEvent) => {
        // 计算上传进度百分比
        const percentageComplete = ((progressEvent.loaded / progressEvent.total) * 100).toFixed(0);
        
        // 更新进度条值
        progressBarValue.value = parseInt(percentageComplete);   
    }

    const emit = defineEmits(['upload-success', 'upload-error', 'upload-delete']);

    const uploadData = ref({
        attachID: null
    })

    onBeforeMount(() => {

    });
   
    onMounted(() => {
        console.log('--- multiple ---', props.multiple);
        multiple.value = props.multiple;
        disabled.value = props.disabled;
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

        let message = '文件[' + file.name + ']上传成功';
        console.log('文件[' + file.name + ']上传成功')

        ElMessage({
            message: message,
            type: 'success',
            duration: 3.5 * 1000
        })

        emit('upload-success', file.raw.attachDtlID);
    }

    // 失败后钩子
    function handleError(error, file, fileList) {
        console.log('----- handleError -----')

        progressBarValue.value = 0;
        let message = '文件[' + file.name + ']上传失败，失败原因：' + error.message;

        ElMessage({
            message: message,
            type: 'error',
            duration: 3.5 * 1000
        })

        emit('upload-error', file.raw.attachDtlID);
    }

    // 文件删除前
    async function handleBeforeRemove(file, fileList) {
        console.log('----- handleBeforeRemove -----')

        let deleteUrl = api.defaults.baseURL + '/attachment/files/deleteAttachDtlByID' ;
        let deleteData = {
            attachDtlID: file.raw.attachDtlID
        }
        let deleteHeaders = {
            'Content-Type': 'application/json',
            'Stone-Token': sessionStorage.getItem('stoneFileToken')
        }
        let deleteConfig = {
            headers: deleteHeaders
        }

        await axios.post(deleteUrl, deleteData, deleteConfig)
        .then( response => {
            console.log('response', response)
            if (response.status === 200) {
                let res = response.request.responseText;
                if (res == "") {

                    ElMessage({
                        message: '请求错误，请稍后重试！',
                        type: 'error',
                        duration: 3.5 * 1000
                    })

                    return false
                }
                res = JSON.parse(res);
                if (res.code == '00000') {
                    return true;
                } else {
                    ElMessage({
                        message: res.message,
                        type: 'error',
                        duration: 3.5 * 1000
                    })

                    return false
                }
            } else {
                ElMessage({
                    message: '请求错误，请稍后重试！',
                    type: 'error',
                    duration: 3.5 * 1000
                })

                return false
            }
        })
        .catch( error => {
            let status;
            let message = error.message || '请求错误，请稍后重试！';

            if (error && error.response && error && error.response.status) {
                status = error.response.status
            }

            if (status === 403) {
                message = "登陆过期";

                ElMessage({
                    message: message,
                    type: 'error',
                    duration: 3.5 * 1000
                })

                sessionStorage.removeItem('Stone-Token');
			    sessionStorage.removeItem('stoneFileToken');
                route.push('/login');
                return false
            }

            ElMessage({
                message: message,
                type: 'error',
                duration: 3.5 * 1000
            })
            return false
        })
    }

    function handleOnRemove (file, fileList) {
        console.log('----- handleOnRemove -----')
        emit('upload-delete', file.raw.attachDtlID);
    }

    // 文件上传
    async function handleFileUpload(file) {
        console.log('----- handleFileUpload -----')

        progressBarValue.value = 0;

        const formData = new FormData();
        formData.append('files', file.file);
        formData.append('attachID', 1424061700000015);

        // 设置请求头

        const config = {
            headers: uploadHeaders.value,
            onUploadProgress
        }

        // 发送请求
        await axios.post(uploadUrl.value, formData, config)
        .then( response => {
            console.log('response', response)
            if (response.status === 200) {
                let res = response.request.responseText;
                if (res == "") {
                    return myCustomPromise(false, '请求错误，请稍后重试！');
                }
                res = JSON.parse(res);
                if (res.code == '00000') {
                    file.file.attachID = res.data[0].attachID;
                    file.file.attachDtlID = res.data[0].attachDtlID;
                    file.file.attachDtlName = res.data[0].attachDtlName;
                    return response;
                } else {
                    return myCustomPromise(false, res.message);
                }
            } else {
                return myCustomPromise(false, '请求错误，请稍后重试！');
            }
        })
        .catch( error => {
            let status;
            let message = error.message || '请求错误，请稍后重试！';

            if (error && error.response && error && error.response.status) {
                status = error.response.status
            }

            if (status === 403) {
                message = "登陆过期";

                sessionStorage.removeItem('Stone-Token');
			    sessionStorage.removeItem('stoneFileToken');
                route.push('/login');
            }

            return myCustomPromise(false, message);
        })
    }

    function myCustomPromise(condition, obj) {
        return new Promise((resolve, reject) => {
        if (condition) {
            resolve('操作成功');
        } else {
            reject(new Error(obj));
        }
    });

    function reset() {
        fileUpload.value.clearFiles();
    }

    defineExpose({
        reset
    });
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