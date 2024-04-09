<template>
    <!-- 导航条部分 -->
    <div class="icon">
		<!-- <el-icon v-if="show" @click="change">
			<Fold />
		</el-icon>
		<el-icon v-else @click="change">
			<Expand />
		</el-icon> -->
	</div>
    <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <template v-for="item in current.matched" :key="item.path">
            <el-breadcrumb-item v-if="item.meta.title != '首页'">{{ item.meta.title }}</el-breadcrumb-item>
		</template>
	</el-breadcrumb>
</template>

<script>
import { ref, reactive, toRefs, computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
export default {
    data() {
        const router = useRouter();
        const current = computed(() => {
            console.log("当前点击菜单信息:")
            console.log(router.currentRoute.value)
		    return router.currentRoute.value
	    })
        return {
            current, current
        }
    },
    methods: {
        change() {
            show.value = !show.value;
            console.log(show.value);
        }
    }
}
</script>

<style>
    .icon {
        height: 17px;
		margin-top: 0px;
	}
</style>