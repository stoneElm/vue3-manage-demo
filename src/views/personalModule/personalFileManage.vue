<template>
    <div ref="calaWidth" style="width: 100%;"></div>
    <div class="attach-dtl-list" v-for="attachDtlList in attachDtlListList">
        <div class="attach-dtl-view" v-for="item in attachDtlList" :key="item.attachDtlID">
            <div v-if="item.isShow==='02'" class="attach-dtl-view-show" v-on:dblclick="filePreviewDblclick(item.attachDtlID)">
                <div class="attach-dtl-logo">
                
                </div>
                <div class="attach-dtl-name">{{ item.attachDtlName }}</div>
            </div>
            <div class="attach-dtl-view-none">

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
    const defaultWidth = ref(150);
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
    background-color: pink;
    margin-right: 20px;
    margin-bottom: 20px;
}
.attach-dtl-view-show {
    cursor: pointer;
    padding: 8px;
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
}
</style>