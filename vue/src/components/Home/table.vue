<template>
    <div>
        <table>
            <thead>
            <tr>
                <th style="width: 1vw;">NO.</th>
                <th style="width: 16vw;">标题</th>
                <th style="width: 5vw;">热度值</th>
                <th style="width: 7vw; text-align: center">情感倾向</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(user, index) in items" :key="user.id">
                <td> {{ index + 1 }}</td>
                <td><a :href="user[5]" target="_blank">{{ user[1] }}</a></td>
                <td>{{ user[2] }}</td>
                <td>{{ user[6] }}--><router-link :to="{ name: 'Analysis', params: { id: user[0] } }" target="_blank">查看分析</router-link>
                </td>
            </tr>
            <tr v-if="load_more">
                <td colspan="4" style="text-align: center;" >
                    <button @click="fetchMore">加载更多 >>></button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            items: [],
            load_more: true, // 控制是否显示加载更多按钮
            contentLimit: 20 // 设置内容显示的字符数限制
        };
    },
    methods: {
        async fetchInfo(num) {
            try {
                // 发起请求获取数据
                const response = await axios.post('http://127.0.0.1:5000/get_info', {
                    num: num, // 设置请求的数量
                });

                // 将获取到的数据存入组件的数据中
                this.items = response.data;

                // 如果获取到的数据条数少于请求的条数，则说明没有更多数据可加载
                if (response.data.length < num) {
                    this.load_more = false;
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        fetchMore() {
            // 当用户点击加载更多按钮时，加载更多数据
            // 这里可以根据需要设置每次加载的条数
            this.fetchInfo(50); // 发起请求获取更多数据
            this.load_more=false;
        }
    },

    // 在组件加载完成时调用获取数据的方法
    mounted() {
        // 初始化加载第一批数据
        this.fetchInfo(20);
    }

};
</script>

<style scoped>
table {
    width: 100%;
    max-width: 100%;
    border-collapse: collapse;
    font-size: 14px; /* 设置表格中文字的大小为12像素 */
    line-height: 1.2; /* 设置表格行的行高为1.2倍文字大小 */
    padding: 4px; /* 设置单元格的内边距为4像素 */
    margin: 0 auto; /* 将表格水平居中 */
}

tr {
    color: black;
}

th, td {
    color: black;
    padding: 8px;
    border: 1px solid #1e1d1d;
    text-align: left; /*设置为左对齐*/
}

/* 当鼠标悬停在表格单元格上时应用的样式 */
td:hover {
    background-color: #f2f2f2; /* 浅灰色背景 */
}

th {
    background-color: #9be1dc;
}

button {
    background-color: transparent;
    border: none;
    outline: none; /* 去除按钮的默认外边框 */
}



</style>
