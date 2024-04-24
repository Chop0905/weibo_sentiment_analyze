<template>
    <div>
        <img :src="'data:image/png;base64,' + item_info['image_data']" alt="图片" class="cloud-image">
        <p style="font-size: 1.1rem">讨论词云图</p>
    </div>
</template>

<script>
export default {
    props:["item_info"],
    mounted() {
    }
};
</script>

<style>
.cloud-image {
    max-width: 400px;
    max-height: 500px;
}
</style>
