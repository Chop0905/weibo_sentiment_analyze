<template>
    <div style="display: inline-block; margin-right: 10px;">
        <h2 style="font-size: 2.5rem">{{ component["name"] }}</h2>
        <p style="font-size: 0.9rem;text-align: center">热度值: {{ component["popularity"] }}</p>
        <hr>
    </div>
    <div class="text-content">
        <p style="text-indent: 2rem">{{ component["content"] }} <a :href="component['url']">->查看原文</a></p>
    </div>
    <div>
        <br>
        <draw-chart v-if="component['comments']" :item_info="component"/>
        <br>
        <draw-cloud v-if="component['image_data']" :item_info="component"/>
        <br>
    </div>
    <hr>
    <footer style="margin-bottom: 0">
        <p style="margin:0 ;font-size: 12px">©开发者：卢承福</p>
    </footer>
</template>

<script>
import axios from "axios";
import chart from "../components/Analysis/chart.vue";
import cloud from "../components/Analysis/cloud.vue";

export default {
    components: {
        "draw-chart": chart,
        "draw-cloud": cloud
    },
    data() {
        return {
            component: [],
        };
    },
    mounted() {
        this.get_item().then(() => {
            this.component["image_data"] = atob(this.component["image_data"]);
        })
    },
    methods: {
        async get_item() {
            const request_data = {
                id: this.$route.params.id
            };
            try {
                const response = await axios.post('http://127.0.0.1:5000/get_item', request_data);
                this.component = response.data;
            } catch (err) {
                console.error(err);
            }
        }
    }
}
</script>

<style>

.text-content {
    text-align: left;
    width: 500px;
    background-color: #dcfafa;
    margin: 0 auto;
}
</style>