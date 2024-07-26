<template>
	<el-scrollbar>
    	<el-menu active-text-color="#ffd04b" background-color="#545c64" text-color="#fff" default-active="2" 
				class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen" @close="handleClose" router>
			<Menu :menus="menus"></Menu>
		</el-menu>
	</el-scrollbar>
	<div class="nav-handle-scollbar" @click="changeCollapse">
		<i class="nav-icon">
			<ArrowRightBold style="width: 1em; height: 1em" v-if="isCollapse" />
			<ArrowLeftBold style="width: 1em; height: 1em" v-else />
		</i>
	</div>
</template>

<script setup>
	import { ref, onMounted, onUnmounted } from 'vue'
	import { useRouter } from 'vue-router'
	import Menu from './menu.vue'

	const route = useRouter();
	const menus = route.options.routes.filter((item) => item.children)[0].children

	const isCollapse = ref(false);

	onMounted(() => {
 		const ua = window.navigator.userAgent.toLowerCase();
 		isCollapse.value = /mobile|android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
	});

	function handleOpen(key, keyPath) {
        console.log(key, keyPath);
    }

    function handleClose(key, keyPath) {
        console.log(key, keyPath);
    }

	function changeCollapse() {
		isCollapse.value = !isCollapse.value;
	}

</script>

<style>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 200px;
	}

	.el-menu {
		border-right: 0;
	}

	.title {
		font-size: 18px;
		display: flex;
		justify-content: center;
		top: 5px;
		margin-top: 15px;
	}
	.nav-handle-scollbar{
		background-color: rgb(67, 74, 80);
		position: absolute;
		width: 8px;
		height: 100px;
		top: 50%;
		margin-top: -50px;
		right: 2px;
		cursor: pointer;
		box-sizing: border-box;
		z-index: 99;
		transform: scaleX(1.4) perspective(20px) rotateY(-30deg);
		color: #ecf5ff;
	}
	.nav-handle-scollbar:hover{
		background-color: #ecf5ff;
		border-right: 1px solid rgb(67, 74, 80);
		color: #2c3e50;
	}
	.nav-icon {
		font-size: 8px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -7.5px;
		margin-left: -4px;
	}
</style>