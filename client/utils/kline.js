import * as echarts from 'echarts';

export default (box, list) => {
    const myChart = echarts.init(box);
    const calculateMA = (dayCount, data) => {
        let result = [];
        for (let i = 0, len = data.length; i < len; i++) {
            if (i < dayCount) {
                result.push('-');
                continue;
            }
            let sum = 0;
            for (let j = 0; j < dayCount; j++) {
                sum += +data[i - j][1];
            }
            result.push((sum / dayCount).toFixed(2));
        }
        return result;
    }
    const dates = list.map(function (item) {
        return item.date;
    });
    const data = list.map(function (item) {
        let [close, open, now, high, low, volume, amount, deltaPercent, delta, pe] = item.data;
        return [open, now, low, high];
    });
    const volumes = list.map(function (item, idx) {
        let [close, open, now, high, low, volume, amount, deltaPercent, delta, pe] = item.data;
        return [idx, volume, now > open ? 1 : -1];
    });
    const option = {
        legend: {
            data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30'],
            inactiveColor: '#777'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false,
                type: 'cross',
            },
            position: function (pos, params, el, elRect, size) {
                const obj = {
                    top: 10
                };
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                return obj;
            }
        },
        axisPointer: {
            link: [{ xAxisIndex: 'all' }],
            label: { backgroundColor: '#777' }
        },
        visualMap: {
            show: false,
            seriesIndex: 5,
            dimension: 2,
            pieces: [{
                value: 1,
                color: '#ec0000'
            },
            {
                value: -1,
                color: '#00da3c'
            }]
        },
        xAxis: [{
            type: 'category',
            data: dates,
            scale: true,
            axisLine: { lineStyle: { color: '#8392A5' } },
        }, {
            type: 'category',
            gridIndex: 1,
            data: dates,
            scale: true,
            axisLabel: { show: false }
        }],
        yAxis: [{
            scale: true,
            splitArea: {
                show: true
            }
        },
        {
            scale: true,
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false }
        }],
        grid: [{
            bottom: 180,
            height: '50%',
            left: '10%',
            right: '8%'
        }, {
            top: '63%',
            height: '20%',
            bottom: 80,
            left: '10%',
            right: '8%',
        }],
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: [0, 1],
            },
            {
                show: true,
                xAxisIndex: [0, 1],
                type: 'slider',
            }
        ],
        series: [
            {
                type: 'candlestick',
                name: 'Day',
                data: data,
                itemStyle: {
                    color: '#FD1050',
                    color0: '#0CF49B',
                    borderColor: '#FD1050',
                    borderColor0: '#0CF49B'
                }
            },
            {
                name: 'MA5',
                type: 'line',
                data: calculateMA(5, data),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    width: 1
                }
            },
            {
                name: 'MA10',
                type: 'line',
                data: calculateMA(10, data),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    width: 1
                }
            },
            {
                name: 'MA20',
                type: 'line',
                data: calculateMA(20, data),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    width: 1
                }
            },
            {
                name: 'MA30',
                type: 'line',
                data: calculateMA(30, data),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    width: 1
                }
            },
            {
                name: 'Volume',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: volumes
            }
        ]
    };
    myChart.setOption(option);
};