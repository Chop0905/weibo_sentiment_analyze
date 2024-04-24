<template>
    <h1>微博情感分析系统</h1>
    <div class="content">
        <div class="centered-container">
            <div class="table-responsive"> <!-- 添加包含表格的容器 -->
                <table-component/>
            </div>
            <prediction-component/>
        </div>
    </div>
    <hr>
    <footer style="margin-bottom: 0">
        <p style="margin:0 ;font-size: 12px">©20智科 卢承福</p>
    </footer>
</template>


<script>
import table from "../components/Home/table.vue";
import prediction from "../components/Home/prediction.vue";

export default {
    components: {
        'table-component': table,
        'prediction-component': prediction,
    },
    methods: {},
}
</script>

<style>

.content {
    display: flex;
    justify-content: center; /* 将内容垂直居中 */
}

.centered-container {
    display: flex;
    flex-direction: column; /* 竖向排列 */
    align-items: center; /* 将内容水平居中 */
    margin-top: 110px; /* 将表格整体往下移 */

}
</style>


