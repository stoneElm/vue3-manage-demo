<template>
    <div class="button-list">
        <div class="float-left">
            <el-button :type="primary" style="color: #409eff;">
                <el-icon style="margin-right: 8px;"><Back /></el-icon>返回上级
            </el-button>
        </div>
        <div class="float-right">
            <el-dropdown style="color: #409eff;">
                <el-button :type="primary" style="color: #409eff;">
                    <el-icon style="margin-right: 8px;"><CirclePlus /></el-icon>新建
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
            <div v-if="item.isShow==='02'" class="attach-dtl-view-show" v-on:dblclick="filePreviewDblclick(item.attachDtlID)">
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

    <file-upload @upload-success="fileUploadSuccess" @upload-delete="fileUploadDelete"></file-upload>
</template>

<script setup>
    import { ref, reactive, onMounted, onUnmounted } from 'vue';
    import { useRouter } from 'vue-router'

    import fileUpload from '@/views/public/fileUpload.vue'

    import {
        queryAttachDtlList
    } from '@/api/attachApi/attachApi'

    const route = useRouter();

    const attachDtlList = ref([]);
    const attachDtlListList = ref([]);
    const calaWidth = ref(null);
    const defaultWidth = ref(100);
    const storageWidth = ref(0);

    onMounted(() => {
        window.addEventListener('resize', handleResize);
        initAttachDtlList();
    });

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
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
        console.log('aaa', attachDtlListTemp.length)

        // 计算个数
        let rows = Math.ceil(storageWidth.value / defaultWidth.value);

        let dtlListLen = attachDtlList.value.length;
        let line = Math.ceil(dtlListLen / rows);
        console.log('----- 计算结果 -----', line + '行;' + rows +'列');

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
</style>