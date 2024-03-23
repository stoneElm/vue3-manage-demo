<template>
    <el-menu active-text-color="#ffd04b" background-color="#545c64" text-color="#fff" default-active="2" 
	class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen" @close="handleClose" router>
		<Menu :menus="menus"></Menu>
	</el-menu>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Menu from './menu.vue'
export default {
	name: 'Aside',
	components: {
		Menu
	},
    data() {
        const router = useRouter();
        const isCollapse = ref(false);
        const menus = computed(() => {
		    let menu = router.options.routes.filter((item) => item.children);
		    return menu[0].children
	    });
        return {
            router: router,
            isCollapse: isCollapse,
            menus: menus
        }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
}
</script>

<style>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 200px;
		min-height: 400px;
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
</style>