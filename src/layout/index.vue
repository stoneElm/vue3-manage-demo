<template>
    <div class="common-layout main-layout-class">
        <el-container>
            <el-header class="header">
                <Header></Header>
            </el-header>
            <el-container>
                <el-aside style="width:fit-content;" class="aside">
                    <Aside></Aside>
                </el-aside>
                <el-main class="main" style="padding: 0px;">
                    <el-header class="main-navbar">
                        <Navbar></Navbar>
                    </el-header>
                    <el-main class="main-main">
                        <el-scrollbar>
                            <router-view></router-view>
                        </el-scrollbar>
                    </el-main>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import Aside from './aside.vue'
import Header from './header.vue'
import Navbar from './navbar.vue'
export default {
  components: {
    Aside,
    Header,
    Navbar
  }
}
</script>

<style>
    .main-layout-class {
        padding: 0px;
    }
    .aside{
		height: calc(100vh - 64px - 0px);
		background-color: #545c64;
        position: relative;
	}
	.header{
        height: 64px;
        background-color: #545c64;
		border-bottom: 1px solid #c9c6c6;
	}
    .main-navbar{
        height: 48px;
		border-bottom: 1px solid #c9c6c6;
	}
    .main-main {
        padding: 20px;
        height: calc(100vh - 64px - 0px - 48px);
    }
    .el-main.main-main>.el-scrollbar>.el-scrollbar__bar.is-horizontal>div {
        height: 0px;
    }
    .el-scrollbar__bar.is-vertical>div {
        width: 0px;
    } 
</style>