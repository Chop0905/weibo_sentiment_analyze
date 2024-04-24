<template>
    <div style="display: grid; place-items: center;">
        <canvas ref="chart" width="400" height="300"></canvas>
        <p style="font-size: 1.2rem">话题情绪为: {{ sentiment }}</p>
    </div>
</template>

<script>
import Chart from "chart.js/auto";
import axios from "axios";

export default {
    data() {
        return {
            possibility: [],
            sentiment:null
        }
    },
    props: ['item_info'],
    mounted() {
        this.getPrediction();
    },
    methods: {
        async getPrediction() {
            const inputText = this.item_info["comments"].length > 512 ? this.item_info["comments"].slice(0, 500) : this.item_info["comments"];//截断过长的字符
            try {
                const headers = {
                    'Content-Type': 'text/plain',
                };
                const response = await axios.post('http://127.0.0.1:5000/pred', inputText, {headers});
                this.possibility = response.data.possibility;
                this.sentiment=response.data.sentiment;
                this.possibility.sort((a, b) => b[1] - a[1]);
                this.renderChart();
            } catch (error) {
                console.error(error);
            }
        },
        renderChart() {
            const ctx = this.$refs.chart.getContext('2d');
            this.chartInstance = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: this.possibility.map((item) => item[0]),
                    datasets: [{
                        label: '情绪比例',
                        data: this.possibility.map((item) => (item[1] * 100).toFixed(4)),
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
                    responsive: false, // 禁用响应式
                    maintainAspectRatio: false, // 禁用长宽比维护
                },
            });
        },
    }
}
</script>
