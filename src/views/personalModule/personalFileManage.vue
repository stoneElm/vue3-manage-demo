<template>
    <div class="button-list">
        <div class="float-left">
            <el-button  style="color: #409eff;">
                <el-icon style="margin-right: 3px;"><Back /></el-icon>返回上级
            </el-button>
        </div>
        <div class="float-right">
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
    <div class="attach-dtl-list" v-for="attachDtlList in attachDtlListList">
        <div class="attach-dtl-view" v-for="item in attachDtlList" :key="item.attachDtlID">
            <div v-if="item.isShow==='02'" class="attach-dtl-view-show" v-on:dblclick="filePreviewDblclick(item.attachDtlID)" @contextmenu.prevent="showContextMenu($event, item.attachDtlID)">
                <div class="attach-dtl-logo">
                
                </div>
                <div :title="item.attachDtlName" class="attach-dtl-name">
                    <el-tooltip placement="top">
                        <template #content> {{ item.attachDtlName }} </template>
                        {{ item.attachDtlName }}
                    </el-tooltip>
                </div>
            </div>
            <div class="attach-dtl-view-none" v-else>

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
                        @click="handleMenuOperateClick(item.attachDtlID, item.type)"><span>{{ item.operate }}</span>
                    <span v-if="item.type !== 'reName'">&emsp;</span>
                </p>
            </el-scrollbar>
        </div>

    <file-upload @upload-success="fileUploadSuccess" @upload-delete="fileUploadDelete"></file-upload>
</template>

<script setup>
    import { ref, reactive, onMounted, onUnmounted } from 'vue';
    import { useRouter } from 'vue-router'
    import api from "@/api/api.js";
    import { ElMessage } from "element-plus";
    import axios from 'axios';

    import fileUpload from '@/views/public/fileUpload.vue'

    import {
        queryAttachDtlList,
        fileDownload
    } from '@/api/attachApi/attachApi'

    const route = useRouter();

    const attachDtlList = ref([]);
    const attachDtlListList = ref([]);
    const calaWidth = ref(null);
    const defaultWidth = ref(100);
    const storageWidth = ref(0);

    const isVisible = ref(0);
    const viewportWidth = ref(0);
    const viewportHeight = ref(0);
    const menuX = ref(0);
    const menuY = ref(0);
    const allMenuList = ref([
        {type: 'open', operate: '打开', attachDtlID: null},
        {type: 'preview', operate: '预览', attachDtlID: null},
        {type: 'download', operate: '下载', attachDtlID: null},
        {type: 'reName', operate: '重命名', attachDtlID: null},
        {type: 'delete', operate: '删除', attachDtlID: null},
    ]);
    const showMenuList = ref([]);
    const rightClickMenu = ref(null);
    

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
        let attachDtlQueryParam = {}

        queryAttachDtlList(attachDtlQueryParam).then(res => {
            if (res.code == '00000') {
                console.log('--- 查询附件详情列表出参 ---', res)

                res.data.forEach((value, index, array) => {
                    value.isShow = '02';
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

    function filePreviewDblclick(attachDtlID) {
        console.log('filePreviewDblclick:', attachDtlID);

        sessionStorage.setItem('filePreviewAttachDtlID', attachDtlID);

        // let filePreview = {};
        // let routeData = route.resolve({ path: '/filePreview', query: filePreview });

        let routeData = route.resolve({ path: '/filePreview'});

        window.open(routeData.href, '_blank');
    }

    function createFolder() {

    }

    function createFile() {
        
    }

    function fileUploadSuccess(attachDtlID) {
        console.log('----- 上传成功 -----')
    }

    function fileUploadDelete(attachDtlID) {
        console.log('----- 删除成功 -----')
    }

    function showContextMenu(event, attachDtlID) {
        // console.log('----- 自定义右键功能 -----', attachDtlID)
        console.log('x:', event.clientX, 'y:', event.clientY)

        event.preventDefault();

        showMenuList.value = [];

        // 获取触发右键点击事件的div元素
        allMenuList.value.forEach((value, index, array) => {
            value.attachDtlID = attachDtlID;
            if (value.type !== 'open') {
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

    function handleMenuOperateClick (attachDtlID, type) {
        console.log('----- 当前操作类型 -----', attachDtlID, type);
        if (type === 'download') {
            handleFileDownload(attachDtlID);
        }
    }

    function handleFileDownload (attachDtlID) {
        console.log('----- 文件下载 -----', attachDtlID);

        let postUrl = api.defaults.baseURL + '/attachment/files/download'
        let getUrl = api.defaults.baseURL + '/attachment/files/download/' + attachDtlID 
                + '?stoneFileToken=' + sessionStorage.getItem('stoneFileToken');
        let data = {
            attachDtlID: attachDtlID
        }
        let headers = {
            'Stone-Token': sessionStorage.getItem('stoneFileToken')
        }
        let config = {
            responseType: 'blob',
            headers: headers
        }
        
        axios.get(getUrl)
        .then( response => {

        })
        .catch( error => {
            ElMessage({
                message: '文件下载失败！',
                type: 'error',
                duration: 3.5 * 1000
            })

            console.log(error);
        })
    }

    function hideContextMenu() {
        console.log('----- 关闭菜单 -----')
        isVisible.value = false;
        showMenuList.value = [];
    }
</script>

<style>
.button-list {
    padding-bottom: 12px;
    height: 32px;
}
.width-full {
    width: 100%;
}
.div-left {
    position: relative;
    left: 0;
}
.div-right {
    position: relative;
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
    height: 110px;
}
.attach-dtl-view-show {
    cursor: pointer;
    padding: 0px 0px;
    height: calc(100% - 0px);
    width: calc(100% - 0px);
}
.attach-dtl-logo {
    height: 80px;
    border: 1px solid plum;
    margin-bottom: 3px;
}
.attach-dtl-view-none {
    cursor: pointer;
    height: 0px;
}
.attach-dtl-view:nth-child(odd):last-child,
.attach-dtl-view:nth-child(even):last-child {
 margin-right: 0; 
}
.attach-dtl-name {
    word-break: break-all;
    font-size: 12px;

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
</style>