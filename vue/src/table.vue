<template>
    <div>
        <table>
            <thead>
            <tr>
                <th>NO.</th>
                <th>标题</th>
                <th>热度值</th>
                <th>情感倾向</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(user, index) in users" :key="user.id">
                <td> {{ index + 1 }}</td>
                <td><a :href="user[3]" target="_blank">{{ user[0] }}</a></td>
                <td>{{ user[1] }}</td>
                <td>{{ user[4] }}</td>
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
            users: [],
            contentLimit: 20 // 设置内容显示的字符数限制
        };
    },
    methods: {
        async fetchInfo() {
            try {
                // 发起请求获取数据
                const response = await axios.post('http://127.0.0.1:5000/get_info', {
                    start: 0, // 这里可以设置请求参数
                    end: 50    // 这里可以设置请求参数
                });

                // 将获取到的数据存入组件的数据中
                this.users = response.data
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
    },

    // 在组件加载完成时调用获取数据的方法
    mounted() {
        this.fetchInfo();
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
}
tr{
    color:black;
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

@media (max-width: 768px) {
    /* 在小屏幕设备上应用的样式 */
    table {
        width: 100%;
    }
}
</style>

