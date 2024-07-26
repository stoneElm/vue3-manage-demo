<template>
    <div class="left" style="color: white; font-size: 21px;">
        STONE 管理系统
    </div>
    <div class="right">
		<el-icon>
			<Message />
		</el-icon>
		<el-avatar :size="30" :src="circleUrl" />
		<el-dropdown>
			<span class="el-dropdown-link" style="color: darkgrey;">
				设置
				<el-icon class="el-icon--right">
					<arrow-down />
				</el-icon>
			</span>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item>设置账号</el-dropdown-item>
					<el-dropdown-item>更改头像</el-dropdown-item>
					<el-dropdown-item @click="exit">退出登录</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>

<script setup>
	import { ref, onMounted, onUnmounted } from 'vue';
	import { useRouter } from 'vue-router'
	import { ElMessage, ElLoading, ElMessageBox } from "element-plus";
	import {
    	logout
	} from '@/api/userApi/userLoginApi'

	const route = useRouter();

	const circleUrl = ref(null);

	onMounted(() => {
		
    });

    onUnmounted(() => {
        
    });

	function exit() {
		ElMessageBox.confirm(
    		'退出登陆后再次访问页面需重新输入用户凭证信息!',
    		'确定退出？',
    		{
      			confirmButtonText: '确认',
      			cancelButtonText: '取消',
      			type: 'warning',
      			draggable: true,
    		}
  		)		
    	.then(() => {
      		console.log("确定退出")
			logout({}).then(res => {
            	if (res.code == '00000') {
                	console.log('--- 发起退出登录请求出参 ---', res)
					sessionStorage.removeItem('Stone-Token');
					sessionStorage.removeItem('stoneFileToken');
                	route.push('/login');
            	}
        	})

    	})
    	.catch(() => {
				
		})
	}

</script>

<style>
    .example-showcase .el-dropdown-link {
		cursor: pointer;
		color: var(--el-color-primary);
		display: flex;
		align-items: center;
	}

    .left {
        display: flex;
		padding-left: 30px;
        float: left;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
    }

	.right {
		display: flex;
		padding-right: 30px;
		width: 110px;
		justify-content: space-between;
		align-items: center;
		float: right;
		margin-top: 17px;
	}

    .right .el-icon--right {
		display: none;
	}
</style>