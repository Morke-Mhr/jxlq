const weather = (id) => {
    // let size = 30;
    window.WIDGET = {
        CONFIG: {
            // "modules": "012",
            // "background": 5,
            // "tmpColor": "403F40",
            // "tmpSize": 12,
            // "cityColor": "403F40",
            // "citySize": 12,
            // "aqiSize": 12,
            // "weatherIconSize": 12,
            // "alertIconSize": 18,
            // "padding": "10px 10px 10px 10px",
            // "shadow": "0",
            // "language": "auto",
            // "borderRadius": 5,
            // "fixed": "true",
            // "vertical": "middle",
            // "horizontal": "center",
            // "right": "30",
            // "top": "25",
            // "key": "9a6576b39af14830886daacb3f194df6",
            // "modules": "01",
            "background": 5,
            "tmpColor": "101010",
            "tmpSize": "12",
            "cityColor": "171717",
            "citySize": "12",
            "aqiSize": "12",
            "weatherIconSize": "12",
            "alertIconSize": 18,
            "padding": "10px 10px 10px 10px",
            "shadow": "1",
            "language": "auto",
            "fixed": "false",
            "vertical": "middle",
            "horizontal": "center",
            "key": "c9e0a8109c3d473caf43baf934297087"
        }
    };
    var url = "https://widget.heweather.net/simple/static/js/he-simple-common.js?v=1.1";
    var script = document.createElement('script');
    var weatherContainer = document.createElement('div');
    weatherContainer.id = 'he-plugin-simple';
    script.charset = 'utf-8';
    script.src = url;
    document.body.appendChild(script);
    // document.body.appendChild(weatherContainer);
    document.getElementById(id).appendChild(weatherContainer);
}

export default weather;