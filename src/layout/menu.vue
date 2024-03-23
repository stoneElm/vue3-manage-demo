<template>
    <template v-for="subItem in menus" :key="subItem.path">
		<!-- 如果有子菜单 -->
		<el-sub-menu v-if="subItem.children" :index="subItem.path">
            <template #title>
                <el-icon>
				    <component :is="subItem.meta.icon"></component>
			    </el-icon>
				<span>{{ subItem.meta.title }}</span>
			</template>
			<Menu :menus = subItem.children></Menu>
		</el-sub-menu>
		<!-- 如果没有子菜单 -->
		<el-menu-item v-else :index="subItem.path">
            <el-icon>
				<component :is="subItem.meta.icon"></component>
			</el-icon>
            <template #title>
				<span>{{ subItem.meta.title }}</span>
			</template>
		</el-menu-item>
	</template>
</template>

<script>
export default {
    name: "Menu",
    props: {
        menus: {
            type: Object,
            default: () => {}
        }
     },
     data() {
        return {};
    },
    methods: {
  
    },
    mounted() {

    }
}
</script>

<style>

</style>