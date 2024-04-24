<template>
    <router-link to="Home"></router-link>
    <router-view></router-view>
</template>


<script>
import Home from './views/Home.vue'

export default {
    components: {
        'Home': Home,
    },
}
</script>

<style>
</style>


