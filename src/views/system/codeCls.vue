<template>
    <!-- 标准代码分类维护 -->
    <div style="border-left:4px solid #409EFF; margin-bottom: 20px; text-align:left">
        <span style="padding-left: 15px;">标准代码分类维护</span>
    </div>
    <el-form :inline="true" :model="codeClsQueryParam" class="demo-form-inline">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-form-item label="标准代码分类名称">
                    <el-input v-model="codeClsQueryParam.codeClsName" placeholder="" clearable />
                </el-form-item>
            </el-col>

            <el-col :span="6">
                <el-form-item label="标准代码分类类型">
                    <el-input v-model="codeClsQueryParam.codeClsType" placeholder="" clearable />
                </el-form-item>
            </el-col>

            <el-col :span="2">
                <el-form-item>
                    <el-button type="primary" @click="codeClsQueryButtonEvent">查询</el-button>
                </el-form-item>
            </el-col>

            <el-col :offset="7" :span="1">
                <el-form-item style="margin-top: 14px;">
                    <el-button link type="primary" size="small" @click="createCodeCls">新增</el-button>
                </el-form-item>
            </el-col>
            <el-col :span="2">
                <el-form-item style="margin-top: 14px;">
                    <el-button link type="danger" size="small" @click="deleteCodeClsEvent">批量删除</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <el-table :data="codeClsList" :row-class-name="codeClsRowClassName" @selection-change="getCodeClsSelectionRows" @select="selectCodeCls" @row-click="codeClsTableClick" style="width: 100%; height: 240px;">
        <el-table-column type="selection" width="40" />
        <el-table-column prop="codeClsName" label="标准代码分类名称" />
        <el-table-column prop="codeClsType" label="标准代码分类类型" />
        <el-table-column prop="validFlagName" label="生效状态" />
        <el-table-column prop="validDate" label="生效时间" />
        <el-table-column prop="invalidDate" label="失效时间" />
        <el-table-column fixed="right" label="操作" >
            <template #default="scope">
                <el-button link type="primary" size="small" @click="editCodeCls(scope.$index)">
                    编辑
                </el-button>
                <el-button link type="danger" size="small" @click="deleteCodeCls(scope.$index)">
                    删除
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination style="margin: 10px 0px 20px 0px; display: flex; justify-content: right;" 
        v-model:current-page="codeClsPageInfo.currentPage" 
        v-model:page-size="codeClsPageInfo.pageSize"
        :page-sizes="[5, 10, 20, 50]"
        :small="codeClsPageInfo.small"
        :disabled="codeClsPageInfo.disabled"
        :background="codeClsPageInfo.background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="codeClsPageInfo.total"
        @size-change="codeClsQueryButtonEvent"
        @current-change="codeClsQueryButtonEvent"
    />


    <!-- 标准代码值维护 -->
    <div style="border-left:4px solid #409EFF; margin-bottom: 20px; text-align:left;">
        <span style="padding-left: 15px;">标准代码值维护</span>
    </div>
    <el-form :inline="true" :model="codeClsValQueryParam" class="demo-form-inline">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-form-item label="标准代码值名称">
                    <el-input v-model="codeClsValQueryParam.codeClsValName" placeholder="" clearable />
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="标准代码值">
                    <el-input v-model="codeClsValQueryParam.codeClsVal" placeholder="" clearable />
                </el-form-item>
            </el-col>
            <el-col :span="2">
                <el-form-item>
                    <el-button type="primary" @click="getCodeClsValList">查询</el-button>
                </el-form-item>
            </el-col>

            <el-col :offset="7" :span="1">
                <el-form-item style="margin-top: 14px;">
                    <el-button link type="primary" size="small" @click="createCodeValCls">新增</el-button>
                </el-form-item>
            </el-col>
            <el-col :span="2">
                <el-form-item style="margin-top: 14px;">
                    <el-button link type="danger" size="small" @click="deleteCodeClsValEvent">批量删除</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <el-table :data="codeClsValList" @selection-change="getCodeClsValSelectionRows" style="width: 100%; height: 240px;">
        <el-table-column type="selection" width="40" />
        <el-table-column prop="codeClsValName" label="标准代码值名称" />
        <el-table-column prop="codeClsVal" label="标准代码值" />
        <el-table-column prop="validFlagName" label="生效状态" />
        <el-table-column prop="validDate" label="生效时间" />
        <el-table-column prop="invalidDate" label="失效时间" />
        <el-table-column fixed="right" label="操作" >
            <template #default="scope">
                <el-button link type="primary" size="small" @click="editCodeValCls(scope.$index)">
                    编辑
                </el-button>
                <el-button link type="danger" size="small" @click="deleteCodeValCls(scope.$index)">
                    删除
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination style="margin: 10px 0px 20px 0px; display: flex; justify-content: right;" 
        v-model:current-page="codeClsValPageInfo.currentPage" 
        v-model:page-size="codeClsValPageInfo.pageSize"
        :page-sizes="[5, 10, 20, 50]"
        :small="codeClsValPageInfo.small"
        :disabled="codeClsValPageInfo.disabled"
        :background="codeClsValPageInfo.background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="codeClsValPageInfo.total"
        @size-change="getCodeClsValList"
        @current-change="getCodeClsValList"
    />

    <!-- 编辑标准代码分类信息 -->
    <el-dialog v-model="codeClsDialog" :title="codeClsDialogTitle" @closed="closedDialog('codeClsDialogRef')">
        <el-form ref="codeClsDialogRef" :inline="false" :model="saveCodeClsParam" :rules="codeClsDialogRules" status-icon label-width="155px" class="demo-form-inline">
            <el-row :gutter="20">
                <el-col :span="12" left>
                    <el-form-item label="标准代码分类名称" prop="codeClsName">
                        <el-input v-model="saveCodeClsParam.codeClsName" placeholder="" clearable />
                    </el-form-item>
                </el-col>

                <el-col :span="12" left>
                    <el-form-item label="标准代码分类类型" prop="codeClsType">
                        <el-input v-model="saveCodeClsParam.codeClsType" placeholder="" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="关联标准代码分类类型">
                        <el-input v-model="saveCodeClsParam.relaCodeClsType" disabled placeholder="" clearable />
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="生效状态" prop="validFlag">
                        <el-select v-model="saveCodeClsParam.validFlag" placeholder="" clearable>
                            <el-option v-for="item in validFlagOptions" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="生效日期">
                        <el-date-picker v-model="saveCodeClsParam.validDate" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" placeholder="" clearable />
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="失效日期">
                        <el-date-picker v-model="saveCodeClsParam.invalidDate" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" placeholder="" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
	        <span class="dialog-footer">
	            <el-button @click="codeClsDialog = false">取消</el-button>
	            <el-button type="primary" @click="saveCodeClsInfo('codeClsDialogRef')">
	                保存
	            </el-button>
	        </span>
	    </template>
    </el-dialog>

    <!-- 编辑标准代码值信息 -->
    <el-dialog v-model="codeClsValDialog" :title="codeClsValDialogTitle" @closed="closedDialog('codeClsValDialogRef')">
        <el-form ref="codeClsValDialogRef" :inline="false" :model="saveCodeClsValParam" :rules="codeClsValDialogRules" status-icon label-width="155px" class="demo-form-inline">
            <el-row :gutter="20">
                <el-col :span="12" left>
                    <el-form-item label="标准代码分类值名称" prop="codeClsValName">
                        <el-input v-model="saveCodeClsValParam.codeClsValName" placeholder="" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="12" left>
                    <el-form-item label="标准代码分类值" prop="codeClsVal">
                        <el-input v-model="saveCodeClsValParam.codeClsVal" placeholder="" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="标准代码分类类型" prop="codeClsType">
                        <el-input v-model="saveCodeClsValParam.codeClsType" disabled placeholder="" clearable />
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="生效状态" prop="validFlag">
                        <el-select v-model="saveCodeClsValParam.validFlag" placeholder="" clearable>
                            <el-option v-for="item in validFlagOptions" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="生效日期">
                        <el-date-picker v-model="saveCodeClsValParam.validDate" type="datetime" placeholder="" clearable />
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="失效日期">
                        <el-date-picker v-model="saveCodeClsValParam.invalidDate" type="datetime" placeholder="" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="代码分类别称">
                        <el-input v-model="saveCodeClsValParam.codeClsCategName" placeholder="" clearable />
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="排序序号">
                        <el-input v-model="saveCodeClsValParam.serialNumber" placeholder="" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="关于代码值的描述">
                        <el-input v-model="saveCodeClsValParam.codeValDesc" type="textarea" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
	        <span class="dialog-footer">
	            <el-button @click="codeClsValDialog = false">取消</el-button>
	            <el-button type="primary" @click="saveCodeClsValInfo('codeClsValDialogRef')">
	                保存
	            </el-button>
	        </span>
	    </template>
    </el-dialog>
</template>

<script>
import { ref, reactive } from 'vue'
import api from "@/api/api.js";
import { ElMessage, ElTable, ElMessageBox, FormProps, Action } from 'element-plus'
import {
    queryCodeClsList,
    createCodeClsList,
    updateCodeClsList,
    deleteCodeClsList,
    queryCodeClsValList,
    createCodeClsValList,
    updateCodeClsValList,
    deleteCodeClsValList
} from '@/api/systemApi/codeClsApi'
export default {
    data() {
        const codeClsQueryParam = reactive({
            codeClsName: '',
            codeClsType: ''
        })
        // 标准代码分类信息列表
        const codeClsList = []
        const codeClsPageInfo = reactive({
            currentPage: 1,
            pageSize: 5,
            small: true,
            disabled: false,
            total: 0,
        })
        const saveCodeClsParam = reactive({
            codeClsID: '',
            codeClsName: '',
            codeClsType: '',
            validDate: '2000-01-01 00:00:00',
            invalidDate: '2099-12-31 23:59:59',
            validFlag: '',
            relaCodeClsType: ''
        })
        const codeClsValQueryParam = reactive({
            codeClsVal: '',
            codeClsValName: ''
        })
        // 标准代码值信息列表
        const codeClsValList = []
        const codeClsValPageInfo = reactive({
            currentPage: 1,
            pageSize: 5,
            small: true,
            disabled: false,
            total: 0,
        })
        const saveCodeClsValParam = reactive({
            codeClsValID: '',
            codeClsID: '',
            codeClsType: '',
            codeClsVal: '',
            codeClsValName: '',
            prntCodeClsVal: '',
            validDate: '2000-01-01 00:00:00',
            invalidDate: '2099-12-31 23:59:59',
            validFlag: '',
            serialNumber: '',
            codeClsCategName: '',
            codeValDesc: ''
        })
        const codeClsDialogRules = reactive({
            codeClsName: [{required: true, message: '', trigger: ['blur', 'change']}],
            codeClsType: [{required: true, message: '', trigger: ['blur', 'change']}],
            validFlag: [{required: true, message: '', trigger: ['blur', 'change']}]
        })
        const codeClsValDialogRules = reactive({
            codeClsVal: [{required: true, message: '', trigger: ['blur', 'change']}],
            codeClsValName: [{required: true, message: '', trigger: ['blur', 'change']}],
            codeClsType: [{required: true, message: '', trigger: ['blur', 'change']}],
            validFlag: [{required: true, message: '', trigger: ['blur', 'change']}]
        })
        const validFlagOptions = reactive([
            {value: '01', label: '失效'},
            {value: '02', label: '生效'}
        ])
        return {
            codeClsQueryParam: codeClsQueryParam,
            codeClsList: codeClsList,
            codeClsPageInfo: codeClsPageInfo,
            codeClsValQueryParam: codeClsValQueryParam,
            codeClsValList: codeClsValList,
            codeClsValPageInfo: codeClsValPageInfo,
            codeClsDialog: false,
            saveCodeClsParam: saveCodeClsParam,
            saveCodeClsValParam: saveCodeClsValParam,
            codeClsValDialog: false,
            codeClsDialogTitle:"编辑标准代码分类信息",
            codeClsValDialogTitle:"编辑标准代码值信息",
            codeClsTableActivityIndex: '',
            codeClsDeleteData: [],
            codeClsValDeleteData: [],
            codeClsEditFlag: false,
            codeClsValEditFlag: false,
            codeClsSelectData: [],
            codeClsValSelectData: [],
            codeClsDialogRules: codeClsDialogRules,
            codeClsValDialogRules: codeClsValDialogRules,
            validFlagOptions, validFlagOptions
        }
    },
    methods: {
        codeClsQueryButtonEvent() {
            this.getCodeClsList()
        },
        // 查询标准代码分类列表
        getCodeClsList(data) {
            this.codeClsQueryParam.pageNo = this.codeClsPageInfo.currentPage;
            this.codeClsQueryParam.pageSize = this.codeClsPageInfo.pageSize;

            queryCodeClsList(this.codeClsQueryParam).then(res => {
                if (res.code == '00000') {
                    console.log('--- 查询标准代码分类列表出参 ---', res)

                    res.data.forEach((value, index, array) => {
                        value.validFlagName = this.getValidFlagNameByOption(value.validFlag);
                    });

                    this.codeClsList = res.data
                    this.codeClsPageInfo.total = res.total
                    this.codeClsTableActivityIndex = ''
                    this.codeClsValQueryParam.codeClsID = ''
                    this.codeClsValList = []
                    this.codeClsValPageInfo.total = 0
                }
            })
        },
        createCodeCls() {
            this.saveCodeClsParam = {
                codeClsID: '',
                codeClsName: '',
                codeClsType: '',
                validDate: '2000-01-01 00:00:00',
                invalidDate: '2099-12-31 23:59:59',
                validFlag: '',
                relaCodeClsType: ''
            }
            this.codeClsDialogTitle="新增标准代码分类信息"
            this.codeClsEditFlag = false
            this.codeClsDialog = true;
        },
        editCodeCls(index) {
            let queryParam = {
                codeClsID: this.codeClsList[index].codeClsID
            }
            this.saveCodeClsParam = {
                codeClsID: '',
                codeClsName: '',
                codeClsType: '',
                validDate: '',
                invalidDate: '',
                validFlag: '',
                relaCodeClsType: ''
            }
            this.codeClsDialogTitle="编辑标准代码分类信息"
            this.codeClsEditFlag = true
            this.codeClsDialog = true;

            queryCodeClsList(queryParam).then(res => {
                if (res.code == '00000') {
                    console.log('--- 查询标准代码分类列表出参 ---', res)
                    this.saveCodeClsParam = res.data[0]
                }
            })
        },
        deleteCodeCls(index) {
            let deleteParam = [this.codeClsList[index]]

            this.deleteCodeClsRequest(deleteParam)
        },
        saveCodeClsInfo(formName) {
            this.$refs[formName].validate((valid, fields) => {
                if (valid) {
                    // 校验成功
                    this.saveCodeClsRequest()
                } else {
                    console.log(fields);
                }
            });
        },
        saveCodeClsRequest () {
            let saveParam = [this.saveCodeClsParam]

            if (this.codeClsEditFlag) {
                updateCodeClsList(saveParam).then(res => {
                    if (res.code == '00000') {
                        console.log('--- 更新标准代码分类列表出参 ---', res)
                        ElMessage.success('保存成功!');
                        this.codeClsDialog = false;
                        this.getCodeClsList();
                    }
                })
            } else {
                createCodeClsList(saveParam).then(res => {
                    if (res.code == '00000') {
                        console.log('--- 新增标准代码分类列表出参 ---', res)
                        ElMessage.success('保存成功!');
                        this.codeClsDialog = false;
                        this.getCodeClsList();
                    }
                })
            }
        },
        codeClsRowClassName({row, rowIndex}) {
            row.index = rowIndex

            if (rowIndex === this.codeClsTableActivityIndex) {
                return 'success-row'
            } 
            return ''
        },
        codeClsTableClick(row) {
            let index = row.index
            this.codeClsValQueryParam.codeClsID = row.codeClsID
            this.codeClsValQueryParam.codeClsType = row.codeClsType

            this.codeClsTableActivityIndex = index;

            this.getCodeClsValList()
        },
        getCodeClsValList() {
            if (!this.codeClsValQueryParam.codeClsID) {
                ElMessage.warning('请选择标准代码分类');
                return;
            }

            this.codeClsValQueryParam.pageNo = this.codeClsValPageInfo.currentPage;
            this.codeClsValQueryParam.pageSize = this.codeClsValPageInfo.pageSize;

            this.queryCodeClsValRequest(this.codeClsValQueryParam);
        },
        createCodeValCls() {
            if (!this.codeClsValQueryParam.codeClsID) {
                ElMessage.warning('请选择标准代码分类');
                return;
            }

            this.saveCodeClsValParam = {
                codeClsValID: '',
                codeClsID: this.codeClsValQueryParam.codeClsID,
                codeClsType: this.codeClsValQueryParam.codeClsType,
                codeClsVal: '',
                codeClsValName: '',
                prntCodeClsVal: '',
                validDate: '2000-01-01 00:00:00',
                invalidDate: '2099-12-31 23:59:59',
                validFlag: '',
                serialNumber: '',
                codeClsCategName: '',
                codeValDesc: ''
            }
            this.codeClsValDialogTitle="新增标准代码值信息"
            this.codeClsValEditFlag = false
            this.codeClsValDialog = true;
        },
        editCodeValCls(index) {
            let queryParam = {
                codeClsValID: this.codeClsValList[index].codeClsValID,
                codeClsID: this.codeClsValQueryParam.codeClsID
            }
            this.saveCodeClsValParam = {
                codeClsValID: '',
                codeClsID: this.codeClsValQueryParam.codeClsID,
                codeClsType: this.codeClsValQueryParam.codeClsType,
                codeClsVal: '',
                codeClsValName: '',
                prntCodeClsVal: '',
                validDate: '',
                invalidDate: '',
                validFlag: '',
                serialNumber: '',
                codeClsCategName: '',
                codeValDesc: ''
            }
            this.codeClsValDialogTitle="编辑标准代码值信息"
            this.codeClsValEditFlag = true
            this.codeClsValDialog = true;

            queryCodeClsValList(queryParam).then(res => {
                if (res.code == '00000') {
                    console.log('--- 查询标准代码分类值列表出参 ---', res)

                    this.saveCodeClsValParam = res.data[0]
                    this.saveCodeClsValParam.codeClsType = this.codeClsValQueryParam.codeClsType
                }
            })
        },
        deleteCodeValCls(index) {
            let deleteParam = [this.codeClsValList[index]]
            this.deleteCodeClsValRequest(deleteParam)
        },
        saveCodeClsValInfo(formName) {
            this.$refs[formName].validate((valid, fields) => {
                if (valid) {
                    // 校验成功
                    this.saveCodeClsValRequest();
                } else {
                    console.log(fields);
                }
            });
        },
        saveCodeClsValRequest () {
            let saveParam = [this.saveCodeClsValParam]

            if (this.codeClsValEditFlag) {
                updateCodeClsValList(saveParam).then(res => {
                    if (res.code == '00000') {
                        console.log('--- 更新标准代码值列表出参 ---', res)
                        ElMessage.success('保存成功!');
                        this.codeClsValDialog = false;
                        this.getCodeClsValList();
                    }
                })
            } else {
                createCodeClsValList(saveParam).then(res => {
                    if (res.code == '00000') {
                        console.log('--- 新增标准代码值列表出参 ---', res)
                        ElMessage.success('保存成功!');
                        this.codeClsValDialog = false;
                        this.getCodeClsValList();
                    }
                })
            }
        },
        getCodeClsSelectionRows (pagination, index) {
            this.codeClsSelectData = pagination
        },
        getCodeClsValSelectionRows (pagination) {
            this.codeClsValSelectData = pagination
        },
        selectCodeCls (row, index) {
            this.codeClsTableActivityIndex = index.index;

            this.codeClsValQueryParam.codeClsID = index.codeClsID
            this.codeClsValQueryParam.codeClsType = index.codeClsType

            this.getCodeClsValList()
        },
        deleteCodeClsEvent () {
            if (!this.codeClsSelectData || this.codeClsSelectData.length === 0) {
                ElMessage.warning('请选择要删除的数据');
                return;
            }

            this.deleteCodeClsRequest(this.codeClsSelectData);
        },
        deleteCodeClsValEvent () {
            if (!this.codeClsValSelectData || this.codeClsValSelectData.length === 0) {
                ElMessage.warning('请选择要删除的数据');
                return;
            }

            this.deleteCodeClsValRequest(this.codeClsValSelectData);
        },
        deleteCodeClsRequest (data) {
            let message = ''

            data.forEach((value, index, array) => {
                message += '【' + value.codeClsType + '】'
            });

            message = '确定要删除标准代码分类类型为：' + message + '的标准代码分类以及其下的标准代码值'

            ElMessageBox.confirm(
                message, 
                '确认删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',}
            ).then (() => {
                deleteCodeClsList(data).then(res => {
                    if (res.code == '00000') {
                        console.log('--- 删除标准代码分类列表出参 ---', res)
                        ElMessage.success('删除成功!');
                        this.getCodeClsList();
                    }
                })
            }).catch(() => {

            })
        },
        deleteCodeClsValRequest (data) {
            let message = ''

            data.forEach((value, index, array) => {
                message += '【' + value.codeClsVal + '；' + value.codeClsValName + '】'
            });

            message = '确定要删除标准代码分类类型为：【' + this.codeClsValQueryParam.codeClsType + '】下标准代码值为；' + message + '的信息'

            ElMessageBox.confirm(
                message, 
                '确认删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',}
            ).then (() => {
                deleteCodeClsValList(data).then(res => {
                    if (res.code == '00000') {
                        console.log('--- 删除标准代码值列表出参 ---', res)
                        ElMessage.success('删除成功!');
                        this.getCodeClsValList();
                    }
                })
            }).catch(() => {

            })
        },
        queryCodeClsValRequest (data) {
            queryCodeClsValList(data).then(res => {
                if (res.code == '00000') {
                    console.log('--- 查询标准代码值列表出参 ---', res)

                    res.data.forEach((value, index, array) => {
                        value.validFlagName = this.getValidFlagNameByOption(value.validFlag);
                    });

                    this.codeClsValList = res.data
                    this.codeClsValPageInfo.total = res.total
                }
            })
        },
        getValidFlagNameByOption (validFlag) {

            for (let i = 0; i < this.validFlagOptions.length; i++) {
                if (this.validFlagOptions[i].value === validFlag) {
                    return this.validFlagOptions[i].label
                }
            }

            return validFlag;
        },
        closedDialog (formName) {
            this.$refs[formName].resetFields();
        },
        initCodeClsInfo () {
            let queryParam = {codeClsTypeList: ["vaildStat"]}
            queryCodeClsList(queryParam).then(res => {
                if (res.code == '00000' && res.data && res.data.length > 0) {
                    queryParam = {codeClsID: res.data[0].codeClsID}
                    queryCodeClsValList(queryParam).then(resp => {
                        if (resp.code == '00000' && resp.data && resp.data.length > 0) {
                            let options = [];
                            resp.data.forEach((value, index, array) => {
                                options.push({value: value.codeClsVal, label: value.codeClsValName})
                            });
                            this.validFlagOptions = options
                        } 
                    })
                }
            })
        }
    },
    created() {
        this.initCodeClsInfo()
    }
}
</script>

<style>
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
        padding: 30px;
    }
    .el-table .success-row {
        /* --el-table-tr-bg-color: var(--el-color-success-light-9); */
        --el-table-tr-bg-color: #ecf5ff;
    }
</style>