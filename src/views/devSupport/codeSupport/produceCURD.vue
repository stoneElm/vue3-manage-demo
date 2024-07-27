<template>
    <div class="curd-body">
        <div style="border-left:4px solid #409EFF; margin-bottom: 20px; text-align:left">
            <span style="padding-left: 15px;">数据表信息</span>
        </div>
        <el-form :model="tableQueryParam" class="demo-form-inline" @submit.native.prevent>
            <el-row :gutter="queryGutter">
                <el-col class="text-left" :xs="16" :sm="12" :md="8" :lg="6" :xl="4">
                    <el-form-item label="数据表名称">
                        <el-input v-model="tableQueryParam.tableName" placeholder="" @keyup.enter="handleSelectTableList" clearable />
                    </el-form-item>
                </el-col>
                <el-col class="text-left" :xs="1" :sm="1" :md="1" :lg="1" :xl="1">
                    <el-button type="primary" @click="handleSelectTableList">查询</el-button>
                </el-col>
            </el-row>
        </el-form>
        <el-form :inline="false" class="demo-form-inline">
            <div class="table-list-main">
                <el-row :gutter="tableGutter">
                    <el-col v-for="item in tableList" :key="item.tableName" 
                            class="table-list text-left"
                            :xs="12" :sm="8" :md="6" :lg="4" :xl="2">
                        <div v-if="item.activitySign" class="table-list-dtl activity" @click="handleSelectTableName(item.tableName)" @dblclick="handleDeleteTableName(item.tableName)">
                            <el-tooltip placement="top">
                                <template #content> 名称：{{ item.tableName }}<br /> 描述：{{ item.tableComment }} </template>
                                <div>
                                    <div class="table-name">{{ item.tableName }}</div>
                                    <div class="table-comment">{{ item.tableComment }}</div>
                                </div>
                            </el-tooltip>
                        </div>
                        <div v-else class="table-list-dtl" @click="handleSelectTableName(item.tableName)" @dblclick="handleDeleteTableName(item.tableName)">
                            <el-tooltip placement="top">
                                <template #content> 名称：{{ item.tableName }}<br /> 描述：{{ item.tableComment }} </template>
                                <div>
                                    <div class="table-name">{{ item.tableName }}</div>
                                    <div class="table-comment">{{ item.tableComment }}</div>
                                </div>
                            </el-tooltip>
                        </div>
                    </el-col>
                </el-row>
                <el-empty v-if="isEmpty" :image-size="20" />
            </div>
        </el-form>

        <div style="border-left:4px solid #409EFF; margin-bottom: 20px; text-align:left">
            <span style="padding-left: 15px;">当前选中表名称：</span>
            <span v-if="selectTableName !== null" style="font-size: 15px;">{{ selectTableName }}</span>
            <span v-if="selectTableName === null" style="font-size: 15px;">无</span>
        </div>

        <el-form :model="produceCodeParam" class="demo-form-inline">
            <el-row :gutter="queryGutter">
                <el-col class="text-left" :xs="16" :sm="12" :md="8" :lg="6" :xl="4">
                    <el-form-item label="操作类型">
                        <el-select v-model="produceCodeParam.operationType" placeholder="" clearable>
                            <el-option v-for="item in operationType" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col class="text-left" :xs="1" :sm="1" :md="1" :lg="1" :xl="1">
                    <el-button type="primary" @click="handleProduceCode">生成</el-button>
                </el-col>
            </el-row>
        </el-form>

        <div class="code-view">
            <el-empty v-if="isCodeEmpty" :image-size="40" />
        </div>
    </div>
</template>

<script setup>
    import { ref, reactive, onMounted, onUnmounted } from 'vue';

    import {
        selectTableList
    } from '@/api/developApi/codeSupportApi'

    const tableList = ref([]);
    const tableQueryParam = ref({
        tableName: ''
    });

    const queryGutter = ref(20)
    const tableGutter = ref(0)

    const isEmpty = ref(true);
    const isCodeEmpty = ref(true);

    const selectTableName = ref(null);

    const operationType = ref([
        {value: '01', label: '生成AO类'},
        {value: '02', label: '生成VO类'},
        {value: '03', label: '生成Controller'},
        {value: '04', label: '生成Service'},
        {value: '05', label: '生成ServiceImpl'},
        {value: '06', label: '生成Mapper'},
        {value: '07', label: '生成MapperXml'},
    ])
    const produceCodeParam = ref ({
        operationType: null
    })

    onMounted(() => {
        handleSelectTableList();
    })

    function handleSelectTableList() {
        selectTableList(tableQueryParam.value).then(res => {
            if (res.code == '00000') {
                console.log('--- 查询数据表列表出参 ---', res)
                tableList.value = res.data;

                tableList.value.forEach((value, index, array) => {
                    value.activitySign = false;
                });

                selectTableName.value = null;

                isEmpty.value = res.data.length === 0
            }
        })
    }

    function handleSelectTableName (tableName) {
        console.log('----- 数据表名： -----', tableName)

        tableList.value.forEach((value, index, array) => {
            if (value.tableName === tableName) {
                value.activitySign = true;
                selectTableName.value = tableName;
            } else {
                value.activitySign = false;
            } 
        });
    }

    function handleDeleteTableName (tableName) {
        tableList.value.forEach((value, index, array) => {
            value.activitySign = false;
        });
        selectTableName.value = null;
    }

    function handleProduceCode () {
        isCodeEmpty.value = true;
        console.log('----- 当前操作类型 -----', produceCodeParam.value.operationType)
    }
</script>

<style>
.text-left {
 text-align: left;
}
.curd-body {
    height: calc(100vh - 64px - 0px - 48px - 40px);
    width: 100%;
    box-sizing: border-box;
}
.table-list-main {
    max-height: 158px;
    box-sizing: border-box;
    overflow: auto;
    border: 1px solid #a0cfff;
    padding: 16px 0px 8px 16px;
    margin-bottom: 20px;

    /* 隐藏滚动条 */
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.table-list {
    box-sizing: border-box;
}
.table-list-dtl {
    border: 1px solid #d9ecff;
    margin-right: 16px;
    margin-bottom: 8px;
    padding: 8px 16px;
    cursor: pointer;
}
.table-list-dtl:hover {
    background-color: #d9ecff;
    border: 1px solid #c6e2ff;
}
.table-list-dtl.activity {
    background-color: #d9ecff;
    border: 1px solid #c6e2ff;
}
.table-list-dtl div {
    word-break: break-all;
    font-size: 14px;

    display: -webkit-box;               /* 开启弹性盒子布局 */
    -webkit-box-orient: vertical;       /* 设置弹性盒子的子元素排列方向为垂直 */
    -webkit-line-clamp: 1;              /* 设置可见的文本行数 */
    overflow: hidden;                   /* 隐藏溢出的内容 */
    text-overflow: ellipsis;            /* 超出容器的文本显示省略号 */
}
.code-view {
    box-sizing: border-box;
    border: 1px solid #a0cfff;
    min-height: 200px;
    width: 100%;
    padding: 16px;
}
</style>