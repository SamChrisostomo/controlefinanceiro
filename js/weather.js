import Graficos from "./Graficos.js";

export default class Weather {
    g = new Graficos();
    
    constructor() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.getWeatherData(latitude, longitude);
            },
            this.handleError,
            {
                maximumAge: "600_000",
                timeout: "10_000"
            }
        )
    }

    handleError(error) {
        const { code } = error;

        switch (code) {
            case GeolocationPositionError.PERMISSION_DENIED:
                M.toast({
                    html: "Local: Permissão Negada"
                });
                break;
            case GeolocationPositionError.POSITION_UNAVAILABLE:
                M.toast({
                    html: "Local: Permissão Indisponível"
                });
                break;
            case GeolocationPositionError.TIMEOUT:
                M.toast({
                    html: "Local: Tempo limite de pesquisa atingido"
                });
                break;
            default:
                break;
        }
    }

    getWeatherData(latitude, longitude) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=America%2FSao_Paulo&forecast_days=1`;

        fetch(url).then((response) => response.json()).then((data) => this.g.setDataset(data)).catch((error) => {
            console.error(error);
            throw error;
        });
    }
}