import Graficos from "./graficos.js";

export default class Weather {
    g = new Graficos();

    constructor() {

    }

    getLocation() {
        const geo = navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.getWeatherData(latitude, longitude);
            },
            (error) => {
                const code = error.code;

                switch (code) {
                    case error.PERMISSION_DENIED:
                        M.toast({
                            html: "Local: Permissão Negada"
                        });
                        break;
                    case error.POSITION_UNAVAILABLE:
                        M.toast({
                            html: "Local: Permissão Indisponível"
                        });
                        break;
                    case error.TIMEOUT:
                        M.toast({
                            html: "Local: Tempo limite de pesquisa atingido"
                        });
                        break;
                    default:
                        break;
                }
            },
            {
                timeout: "20_00",
                maximumAge: "60_00"
            }
        );

        return null;
    }

    getWeatherData(latitude, longitude) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=America%2FSao_Paulo&forecast_days=1`;

        fetch(url, {
            method: "GET",
        }).then((response) => response.json()).then((data) => this.g.setDataset(data)).catch((error) => {
            console.error(error);
                throw error;
        });
    }
}