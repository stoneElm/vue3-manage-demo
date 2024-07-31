<template>
    <div class="button-list">
        <div class="div-left">
            <el-button @click="handleReturnParent" :disabled="parentDocID === 1" style="color: #409eff;">
                <el-icon style="margin-right: 3px;"><Back /></el-icon>返回上级
            </el-button>
        </div>
        <div class="div-right">
            <el-dropdown style="color: #409eff;">
                <el-button  style="color: #409eff;">
                    <el-icon style="margin-right: 3px;"><CirclePlus /></el-icon>新建
                </el-button>
			    <template #dropdown>
				    <el-dropdown-menu>
					    <el-dropdown-item @click="createFolder">新建目录</el-dropdown-item>
					    <el-dropdown-item @click="createFile">新建文件</el-dropdown-item>
				    </el-dropdown-menu>
			    </template>
		    </el-dropdown>
        </div>
    </div>

    <div ref="calaWidth" class="width-full"></div>
    <div class="attach-dtl-main-view">
        <div class="attach-dtl-list" v-for="attachDtlList in attachDtlListList" :key="attachDtlList">
            <div class="attach-dtl-view" v-for="item in attachDtlList" :key="item.attachDtlID">
                <div v-if="item.isShow==='02'" class="attach-dtl-view-show" v-on:dblclick="filePreviewDblclick(item)" 
                        @contextmenu.prevent="showContextMenu($event, item)">
                    <div class="attach-dtl-logo">
                        <Folder v-if="item.icon === 'folder'"/>
                        <VideoPlay v-if="item.icon === 'video'"/>
                        <Headset v-if="item.icon === 'audio'"/>
                        <Picture v-if="item.icon === 'image'"></Picture>
                        <Document v-if="item.icon === 'document'"/>
                    </div>
                    <div :title="item.attachDtlName" class="attach-dtl-name">
                        <el-tooltip placement="bottom">
                            <template #content> {{ item.personalDocName }} </template>
                            {{ item.personalDocName }}
                        </el-tooltip>
                    </div>
                </div>
                <div class="attach-dtl-view-none" v-else>

                </div>
            </div>
        </div>
        
    </div>

    <div v-if="isVisible"
            ref="rightClickMenu"
            class="context-menu"
            :style="{ left: `${menuX}px`, top: `${menuY}px` }">
        <!-- 菜单项 -->
        <el-scrollbar>
            <p v-for="item in showMenuList" :key="item" 
                    class="scrollbar-demo-item"
                    @click="handleMenuOperateClick(item)"><span>{{ item.operate }}</span>
                <span v-if="item.type !== 'reName'">&emsp;</span>
            </p>
        </el-scrollbar>
    </div>

    <el-dialog v-model="createFileDialog" title="请上传文件" :show-close="false">
        <file-upload :multiple="true" :key="fileUploadKey" ref="uploadFileDiv" @upload-success="fileUploadSuccess" @upload-delete="fileUploadDelete"></file-upload>
        <template #footer>
	        <span class="dialog-footer">
	            <el-button @click="cancelUploadFile">取消</el-button>
	            <el-button type="primary" @click="handleUploadFile">
	                保存
	            </el-button>
	        </span>
	    </template>
    </el-dialog>

    <el-dialog v-model="createFolderDialog" title="请输入目录名称" style="margin-top: 30vh; max-width: 750px;">
        <el-input v-model="newFolderName" placeholder="目录名称"  clearable/>
        <template #footer>
	        <span class="dialog-footer">
	            <el-button @click="createFolderDialog = false">取消</el-button>
	            <el-button type="primary" @click="handleSaveFolder">
	                保存
	            </el-button>
	        </span>
	    </template>
    </el-dialog>

</template>

<script setup>
    import { ref, reactive, onMounted, onUnmounted } from 'vue';
    import { useRouter } from 'vue-router'
    import { Message, MESSAGE_TYPE } from '@/utils/messageUtil';
    import api from "@/api/api.js";
    import { ElMessage } from "element-plus";
    import axios from 'axios';

    import fileUpload from '@/views/public/fileUpload.vue'

    import {
        queryAttachDtlList,
        fileDownload,
        deleteAttachDtlByID,
        deleteAttachDtlList
    } from '@/api/attachApi/attachApi'

    import {
        selectPersonalDocList, createPersonalDocList, updatePersonalDocList, deletePersonalDocList
    } from '@/api/personalCenterApi/personalDocApi'

    const route = useRouter();

    const attachDtlList = ref([]);
    const attachDtlListList = ref([]);
    const calaWidth = ref(null);
    const defaultWidth = ref(90);
    const storageWidth = ref(0);

    const isVisible = ref(0);
    const viewportWidth = ref(0);
    const viewportHeight = ref(0);
    const menuX = ref(0);
    const menuY = ref(0);
    const allMenuList = ref([
        {type: 'open', operate: '打开', personalDocID: null, personalDocType: null, attachDtlID: null, attachDtlName: null},
        {type: 'preview', operate: '预览', personalDocID: null, personalDocType: null, attachDtlID: null, attachDtlName: null},
        {type: 'download', operate: '下载', personalDocID: null, personalDocType: null,  attachDtlID: null, attachDtlName: null},
        {type: 'reName', operate: '重命名', personalDocID: null, personalDocType: null,  attachDtlID: null, attachDtlName: null},
        {type: 'delete', operate: '删除', personalDocID: null, personalDocType: null, attachDtlID: null, attachDtlName: null},
    ]);
    const showMenuList = ref([]);
    const rightClickMenu = ref(null);

    const uploadFileDiv = ref(null);
    const fileUploadKey = ref(0);
    const parentDocID = ref(1);
    const uploadAttachDtlList = ref([]);
    
    const createFileDialog = ref(false);
    const createFolderDialog = ref(false);
    const newFolderName = ref('');

    onMounted(() => {
        window.addEventListener('resize', handleResize);
        initAttachDtlList();

        // window.addEventListener('contextmenu', showContextMenu);
        window.addEventListener('click', hideContextMenu);

    });

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize);

        window.removeEventListener('contextmenu', showContextMenu);
        window.removeEventListener('click', hideContextMenu);
    });

    function initAttachDtlList() {
        let attachDtlQueryParam = {
            parentDocID: parentDocID.value
        }

        selectPersonalDocList(attachDtlQueryParam).then(res => {
            if (res.code == '00000') {
                console.log('--- 查询个人文档列表出参 ---', res)

                res.data.forEach((value, index, array) => {
                    value.isShow = '02';
                    value.activityFlag = false

                    if (value.personalDocType === '01') {
                        value.icon = 'folder'
                    } else if (value.attachDtlType === 'video') {
                        value.icon = 'video'
                    } else if (value.attachDtlType === 'audio') {
                        value.icon = 'audio'
                    } else if (value.attachDtlType === 'image') {
                        value.icon = 'image'
                    }
                    
                    else {
                        value.icon = 'document'
                    }
                });

                attachDtlList.value = res.data

                storageWidth.value = calaWidth.value.offsetWidth;
                console.log('----- storageWidth -----', storageWidth.value);
                initDtlListList();
            }
        })
    }

    function handleResize() {
        let divWidth = calaWidth.value.offsetWidth;
        if (divWidth - storageWidth.value >= defaultWidth.value 
                || divWidth - storageWidth.value <= defaultWidth.value * -1) {
            storageWidth.value = divWidth;
            console.log('----- storageWidth -----', storageWidth.value);
            initDtlListList();
        }
    }

    function initDtlListList() {

        let attachDtlListTemp = JSON.parse(JSON.stringify(attachDtlList.value));

        // 计算个数
        let rows = Math.ceil(storageWidth.value / defaultWidth.value);

        let dtlListLen = attachDtlList.value.length;
        let line = Math.ceil(dtlListLen / rows);
        // console.log('----- 计算结果 -----', line + '行;' + rows +'列');

        let addVal = line * rows - dtlListLen;
        if (addVal > 0) {
            for (var i = 0; i < addVal; i++) {
                attachDtlListTemp.push([])
            }
        }

        let list = [];

        for (var i = 0; i < attachDtlListTemp.length; i += rows) {
            var subArray = attachDtlListTemp.slice(i, i + rows);
            list.push(subArray);
        }

        attachDtlListList.value = list;
        console.log('----- 二维列表 -----', attachDtlListList.value);

    }

    function filePreviewDblclick(parentDoc) {
        if (parentDoc.personalDocType === '02') {
            console.log('filePreviewDblclick:', parentDoc.attachDtlID);

            sessionStorage.setItem('filePreviewAttachDtlID', parentDoc.attachDtlID);

            // let filePreview = {};
            // let routeData = route.resolve({ path: '/filePreview', query: filePreview });

            let routeData = route.resolve({ path: '/filePreview'});

            window.open(routeData.href, '_blank');
        }
        
        if (parentDoc.personalDocType === '01') {
            handleOpenFolder(parentDoc.personalDocID);
        }
    }

    function createFolder() {
        newFolderName.value = '';
        createFolderDialog.value = true;
    }

    function createFile() {
        uploadAttachDtlList.value = [];

        fileUploadKey.value = fileUploadKey.value + 1;

        createFileDialog.value = true;
    }

    function fileUploadSuccess(attachDtlID) {
        console.log('----- 上传成功 -----')
        uploadAttachDtlList.value.push({attachDtlID: attachDtlID});
        console.log('--- 待上传附件详情标识列表 ---', uploadAttachDtlList.value);
    }

    function fileUploadDelete(attachDtlID) {
        console.log('----- 删除成功 -----')

        let list = [];

        for (var i = 0; i < uploadAttachDtlList.value.length; i++) {
            if (uploadAttachDtlList.value[i].attachDtlID !== attachDtlID) {
                list.push(uploadAttachDtlList.value[i]);
            }
        }

        uploadAttachDtlList.value = list;
        console.log('--- 待上传附件详情标识列表 ---', uploadAttachDtlList.value);
    }

    function showContextMenu(event, personalDoc) {

        // 为点击的class添加活动属性
        let selecttor = document.querySelectorAll('.attach-dtl-view');
        for (var i = 0; i < selecttor.length; i++) {
            selecttor[i].classList.remove('active');
        }
        event.target.closest('.attach-dtl-view').classList.add('active');

        console.log('----- 自定义右键功能 -----', event.target)
        console.log('x:', event.clientX, 'y:', event.clientY)

        event.preventDefault();

        showMenuList.value = [];

        const folderOperateList = ['open', 'reName', 'delete'];
        const fileOperateList = ['preview', 'download', 'reName', 'delete'];

        // 获取触发右键点击事件的div元素
        allMenuList.value.forEach((value, index, array) => {
            value.personalDocID = personalDoc.personalDocID;
            value.personalDocType = personalDoc.personalDocType;
            value.attachDtlID = personalDoc.attachDtlID;
            value.attachDtlName = personalDoc.personalDocName;
            if (value.personalDocType === '01' && folderOperateList.includes(value.type)) {
                showMenuList.value.push(value);
            }
            if (value.personalDocType === '02' && fileOperateList.includes(value.type)) {
                showMenuList.value.push(value);
            }
        });

        const rightClickMenuHeight = showMenuList.value.length * 33 + 14;
        const rightClickMenuWidth = 120;
        // console.log('x:', rightClickMenuWidth, 'y:', rightClickMenuHeight)

        viewportWidth.value = window.innerWidth;
        viewportHeight.value = window.innerHeight;
        // console.log(viewportWidth.value, viewportHeight.value)
        
        menuX.value = event.clientX;
        menuY.value = event.clientY;

        if (viewportWidth.value - event.clientX < rightClickMenuWidth) {
            menuX.value = event.clientX - rightClickMenuWidth
        }
        if (viewportHeight.value - event.clientY < rightClickMenuWidth) {
            menuY.value = event.clientY - rightClickMenuHeight
        }
        isVisible.value = true;
    }

    function handleMenuOperateClick (operateObj) {
        console.log('----- 当前操作对象 -----', operateObj);

        let type = operateObj.type;

        if (type === 'open') {
            handleOpenFolder(operateObj.personalDocID);
        }
        
        if (type === 'download') {
            handleFileDownload(operateObj.attachDtlID, operateObj.attachDtlName);
        }

        if (type === 'preview') {
            filePreviewDblclick(operateObj);
        }

        if (type === 'delete') {
            handleFileDelete(operateObj.personalDocID);
        }
    }

    function handleFileDownload (attachDtlID, attachDtlName) {
        console.log('----- 文件下载 -----', attachDtlID);

        let fileDownloadParam = {attachDtlID: attachDtlID};

        fileDownload(fileDownloadParam).then(response => {
            // 创建一个 Blob 对象
            const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });
            // 创建一个 URL 对象
            const fileURL = window.URL.createObjectURL(fileBlob);
            // 创建一个 a 标签用于触发下载
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = fileURL;
            link.download = attachDtlName; // 设置下载文件的名称
            document.body.appendChild(link);
            link.click(); // 模拟点击以开始下载
            document.body.removeChild(link); // 下载完成后移除链接
            window.URL.revokeObjectURL(fileURL); // 释放 URL 对象
        })
    }

    function handleFileDelete(personalDocID) {
        let deleteFileParam = [{personalDocID: personalDocID}];

        deletePersonalDocList(deleteFileParam).then(res => {
            if (res.code == '00000') {
                console.log('删除成功了哦')

                initAttachDtlList();
            }
        })
    }

    function hideContextMenu() {
        console.log('----- 关闭菜单 -----')

        let selecttor = document.querySelectorAll('.attach-dtl-view');
        for (var i = 0; i < selecttor.length; i++) {
            selecttor[i].classList.remove('active');
        }

        isVisible.value = false;
        showMenuList.value = [];
    }

    function cancelUploadFile () {
        createFileDialog.value = false;

        let param = uploadAttachDtlList.value

        if (!(param && param.length > 0)) {
            return;
        }

        deleteAttachDtlList(param).then(res => {
            if (res.code == '00000') {
                console.log('--- 删除成功了哦： ---', param.attachDtlID);
            }
        })
    }

    function handleUploadFile() {
        if (!(uploadAttachDtlList.value && uploadAttachDtlList.value.length > 0)) {
            Message('请选择需要上传的文件！', MESSAGE_TYPE.MESSAGE_TYPE_ERROR)
            return;
        }

        let createList = [];

        for (var i = 0; i < uploadAttachDtlList.value.length; i++) {
            createList.push({
                attachDtlID: uploadAttachDtlList.value[i].attachDtlID,
                personalDocType: '02',
                parentDocID: parentDocID.value
            });
        }

        createPersonalDocList(createList).then(res => {
            if (res.code == '00000') {
                console.log('--- 创建个人文档列表出参 ---', res);
                createFileDialog.value = false;
                Message('上传文件成功！', MESSAGE_TYPE.MESSAGE_TYPE_SUCCESS);

                initAttachDtlList();
            }
        })
    }

    function handleSaveFolder() {
        if (!newFolderName.value) {
            Message('请输入目录名称！', MESSAGE_TYPE.MESSAGE_TYPE_ERROR);
            return
        }

        let createList = [{
            personalDocType: '01',
            personalDocName: newFolderName.value,
            parentDocID: parentDocID.value
        }]

        createPersonalDocList(createList).then(res => {
            if (res.code == '00000') {
                console.log('--- 创建个人文档列表出参 ---', res);
                createFolderDialog.value = false;
                Message('创建目录成功！', MESSAGE_TYPE.MESSAGE_TYPE_SUCCESS);

                initAttachDtlList();
            }
        })
    }

    function handleOpenFolder (personalDocID) {
        parentDocID.value = personalDocID;
        initAttachDtlList();
    }

    function handleReturnParent () {
        if (parentDocID.value === 1) {
            return;
        }

        selectPersonalDocList({personalDocID: parentDocID.value}).then(res => {
            if (res.code == '00000') {
                console.log('--- 查询父级信息出参 ---', res);
                
                parentDocID.value = res.data[0].parentDocID

                initAttachDtlList();
            }
        })
    }
</script>

<style>
.button-list {
    background-color: #fff;
    padding-bottom: 12px;
    margin-bottom: 12px;
    border-bottom: 1px solid #a0cfff;
    height: 32px;

    width: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
}
.attach-dtl-main-view {
    padding-top: 56px;
}
.width-full {
    width: 100%;
}
.div-left {
    position: absolute;
    left: 0;
}
.div-right {
    position: absolute;
    right: 0;
}
.float-left {
    float: left;
}
.float-right {
    float: right;
}
.attach-dtl-list {
    display: flex;
}
.attach-dtl-view {
    flex: 1;
    margin-right: 10px;
    margin-bottom: 16px;
    height: 85px;
    box-sizing: border-box;
}
.attach-dtl-view-show {
    cursor: pointer;
    padding: 0px 0px;
    height: calc(100% - 0px);
    width: calc(100% - 0px);
}
.attach-dtl-logo {
    height: 55px;
    /* border: 1px solid plum; */
    margin-bottom: 3px;
    box-sizing: border-box;
    color: #a8abb2;
    padding-bottom: 8px;
}
.attach-dtl-logo svg {
    max-width: 55px;
    max-height: 55px;
}
.attach-dtl-view-none {
    cursor: pointer;
    height: 0px;
}
.attach-dtl-view:nth-child(odd):last-child,
.attach-dtl-view:nth-child(even):last-child {
 margin-right: 1px; 
}
.attach-dtl-name {
    word-break: break-all;
    font-size: 13px;

    display: -webkit-box;               /* 开启弹性盒子布局 */
    -webkit-box-orient: vertical;       /* 设置弹性盒子的子元素排列方向为垂直 */
    -webkit-line-clamp: 2;              /* 设置可见的文本行数 */
    overflow: hidden;                   /* 隐藏溢出的内容 */
    text-overflow: ellipsis;            /* 超出容器的文本显示省略号 */
}
.context-menu {
    width: 120px;
    z-index: 99;
    position: absolute;
    position: fixed;
    background: #fff;
    box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.2);     /* 这里设置了阴影的样式 */
    font-size: 14px;
    padding: 7px 0px;
}
.context-menu .scrollbar-demo-item {
    margin: 0px;
    padding: 7px 0px;
    cursor: pointer;
    color: #409eff;
}
.context-menu .scrollbar-demo-item:hover {
    background-color: #ecf5ff;
}
.attach-dtl-view-show:hover {
    background-color: #ecf5ff;
    border: 1px solid #dcdfe6;
}
.attach-dtl-view.active {
    background-color: #d9ecff;
    border: 1px solid #dcdfe6;
}
.el-dialog {
    width: 50% !important;
    min-width: 350px !important;
}
.el-dialog__header {
    text-align: left;
    margin-bottom: 0px; 
}
.el-dialog__title {
    display: block;
    border-left:4px solid #409EFF; 
    padding-left: 15px;
}
.el-dialog__body {
    padding: 15px 30px 15px 30px;
}
</style>