export default class Graficos {

    constructor() {

    }

    setDataset(dataObj) {
        const { latitude, longitude, generationtime_ms, utc_offset_seconds, timezone, timezone_abbreviation, elevation, hourly_units, hourly } = dataObj;
        const state = {
            labels: [],
            data: hourly.temperature_2m
        }

        hourly.time.map((elem) => {
            state.labels.push(new Date(elem).getHours().toString())
        });
        
        this.setGrafico(state.labels, state.data);
    }

    setGrafico(labels, data) {
        const ctx = document.querySelector('#myChart');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'C° Temperatura',
                    data: data,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}