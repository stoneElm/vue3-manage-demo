<template>
    <div class="curd-body">
        
    </div>
</template>

<script setup>
    import { ref, reactive, onMounted, onUnmounted } from 'vue';

    import {
        selectTableList
    } from '@/api/developApi/codeSupportApi'

    const tableList = ref([]);
    const handleTableName = ref('无');

    onMounted(() => {
        let selectTableListParam = {};
        selectTableList(selectTableListParam).then(res => {
            if (res.code == '00000') {
                console.log('--- 查询数据表列表出参 ---', res)
                tableList.value = res.data;
            }
        })
    })
</script>

<style>
.curd-body {
    height: calc(100vh - 64px - 0px - 48px - 40px);
    width: 100%;
    border: 1px solid pink;
}
</style>