<script setup lang="ts">
const routes = [
    { name: 'Home', to: '/', text: '计算', icon: 'assets/calc.svg' },
    { name: 'Predict', to: '/predict', text: '预测', icon: 'assets/predict.svg' },
    { name: 'About', to: '/about', text: '关于', icon: 'assets/about.svg' },
]
</script>

<template>
    <div class="header">
        <router-link
            v-for="r in routes"
            :class="{ 'nav-to': true, on: r.name == $route.name }"
            :to="r.to"
        >
            <img :src="r.icon" />
            <b>{{ r.text }}</b>
        </router-link>
    </div>
    <div class="body">
        <router-view></router-view>
    </div>
</template>

<style>
body {
    box-sizing: border-box;
}
* {
    box-sizing: inherit;
    padding: 0;
    margin: 0;
}
.header {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 60px;
    background: #0076a8;
    box-shadow: 0 0 4px 0 #0007;
    z-index: 1;
    display: flex;
    justify-content: center;
    font-size: 20px;
    color: white;
}
.body {
    position: fixed;
    left: 0;
    right: 0;
    top: 60px;
    bottom: 0;
    background: #e5e5e5;
}
.nav-to {
    display: flex;
    align-items: center;
    padding: 0 15px;
    cursor: pointer;
    color: white;
    text-decoration: none;
    opacity: 0.5;
    transition: opacity 200ms ease;
}
.nav-to.on {
    opacity: 1;
}
.nav-to > img {
    margin-right: 5px;
}
.nav-to:hover {
    background: #fff3;
}
</style>
