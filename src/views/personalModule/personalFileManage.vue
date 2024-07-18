<template>
    <div ref="calaWidth" style="width: 100%;"></div>
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
    
</template>

<script setup>
    import { ref, reactive, onMounted, onUnmounted } from 'vue';
    import { useRouter } from 'vue-router'

    import {
        queryAttachDtlList
    } from '@/api/attachApi/attachApi'

    const route = useRouter();

    const attachDtlList = ref([]);
    const attachDtlListList = ref([]);
    const calaWidth = ref(null);
    const defaultWidth = ref(120);
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
</script>

<style>
.attach-dtl-list {
    display: flex;
}
.attach-dtl-view {
    flex: 1;
    margin-right: 16px;
    margin-bottom: 16px;
    height: 130px;
}
.attach-dtl-view-show {
    cursor: pointer;
    padding: 0px 8px;
    height: calc(100% - 16px);
    width: calc(100% - 16px);
    background-color: pink;
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