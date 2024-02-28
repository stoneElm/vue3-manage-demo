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

<script>
export default {

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