<template>
    <div class="common-layout">
        <el-container>
            <el-aside class="table-list-view" width="200px" >
                <el-header>
                    <div style="border-left:4px solid #409EFF; margin-bottom: 20px; text-align:left">
                        <span style="padding-left: 15px;">请选择数据表</span>
                    </div>
                </el-header>
                <el-main style="padding-left: 0px;">
                    <template v-for="item in tableList" :key="item.tableName">
                        <el-menu-item>
                            <template #title>
				                <span>{{ item.tableName }}</span>
			                </template>
                        </el-menu-item>
                    </template>
                </el-main>
            </el-aside>
            <el-container class="table-list-view-2">
                <el-header style="padding-left: 20px;">
                    <div style="border-left:4px solid #409EFF; margin-bottom: 20px; text-align:left;">
                        <span style="padding-left: 15px;">当前处理中的数据表：{{ handleTableName }}</span>
                    </div>
                </el-header>
                <el-main>Main</el-main>
            </el-container>
        </el-container>
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
.table-list-view {
    height: calc(100vh - 64px - 0px - 48px - 40px);
    border-right: 1px solid #409EFF;
}
.table-list-view .el-header,
.table-list-view-2 .el-header {
    height: 40px;
    padding: 0px;
    border-bottom: 1px dashed #409EFF;
}
</style>