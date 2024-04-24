<template>
    <h4>请输入需要分析的句子</h4>
    <textarea v-model="inputText" placeholder="" rows="10"
              style="width: 30vw; height: 30vh; padding: 10px; font-size: 1rem; border-radius: 5px;"
              @keyup.enter="getPrediction" spellcheck="false" @keydown.enter.prevent></textarea>
    <br>
  <!--  当输入的字数超过限制后，会变红色  -->
    <span :class="{ 'exceed-limit': characterCount > 512 }">{{ characterCount }}/512</span>
    <br>
    <button @click="getPrediction" class="custom-button">获取情绪预测</button>
    <p v-if="prediction">
        情感预测结果为：{{ component[0][0] }}</p>
    <div>
        <canvas ref="chart" width="400" height="300"></canvas>
    </div>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';

export default {
    data() {
        return {
            lastPredictionTime: 0, // 记录上次预测的时间戳
            inputText: '',
            prediction: '',
            text: '',
            component: [],
            predictionInterval: 3000, // 设置预测间隔为 3秒
        };
    },
    computed: {
        characterCount() {
            return this.inputText.length; // 计算输入文本的字符数
        },
    },
    methods: {
        async getPrediction() {
            const currentTime = Date.now();
            if (currentTime - this.lastPredictionTime < this.predictionInterval) {
                // 如果距离上次预测时间不足设定的间隔时间，不执行预测操作
                console.log('预测间隔过短');
                return 1;
            }
            const inputText = this.inputText.length > 512 ? this.inputText.slice(0, 500) : this.inputText;//截断过长的字符
            try {
                const headers = {
                    'Content-Type': 'text/plain',
                };
                const response = await axios.post('http://127.0.0.1:5000/pred', inputText, {headers});
                this.text = inputText;
                this.prediction = response.data.sentiment;
                this.component = response.data.possibility;
                this.component.sort((a, b) => b[1] - a[1]);
                // 在获取新预测之前销毁之前的 Chart 实例
                if (this.chartInstance) {
                    this.chartInstance.destroy();
                }
                this.renderChart();
                // 更新上次预测的时间
                this.lastPredictionTime = currentTime;

            } catch (error) {
                console.error('Error fetching prediction:', error);
            }
        },
        renderChart() {
            const ctx = this.$refs.chart.getContext('2d');
            this.chartInstance = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: this.component.map((item) => item[0]),
                    datasets: [{
                        label: '情绪比例',
                        data: this.component.map((item) => (item[1] * 100).toFixed(4)),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.9)',
                            'rgba(54, 162, 235, 0.9)',
                            'rgba(255, 206, 86, 0.9)',
                            'rgba(75, 192, 192, 0.9)',
                            'rgba(153, 102, 255, 0.9)',
                            'rgba(255, 159, 64, 0.9)',
                        ],
                    }],
                },
                options: {
                    // responsive: false, // 禁用响应式
                    maintainAspectRatio: false, // 禁用长宽比维护
                },
            });
        },
    },

};
</script>

<style scoped>
.custom-button {
    color: black; /* 设置按钮字体颜色 */
    background-color: #53a4c7; /* 设置按钮背景颜色 */
    border: none; /* 移除按钮边框 */
    padding: 10px 20px; /* 设置按钮内边距 */
    cursor: pointer; /* 设置鼠标样式为手型 */
    font-size: 16px; /* 设置字体大小 */
    border-radius: 5px; /* 设置边框圆角 */
}

.custom-button:hover {
    color: #383226;
}

.exceed-limit {
    color: red;
}

</style>

