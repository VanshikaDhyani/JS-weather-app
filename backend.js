const express = require('express');
const app = express();
const axios = require("axios");
const port = 3000;

const path = require('path');
// --------------------------------------------- Path to where ever this project is ---------
let publicPath = path.resolve(__dirname, "C:\\Users\\Tushar\\WebstormProjects\\internetapp1");
app.use(express.static(publicPath));

app.listen(port, () => {
    console.log(`Spike app listening on ${port}`);
});

function getCityData(city) {
    const weatherAPIresponse =
        axios({
            method: 'get',
            url: `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=3e2d927d4f28b456c6bc662f34350957`,
        })
        .then( function (response) {
            let weatherData = {
              "city": "",
              "dataList": []
            };

            for (let i = 0; i < response.data.list.length ; i++) {
                let currentDate = response.data.list[i].dt_txt.substring(0, 10);
                let tempObject = {
                    "minTemp": 100,
                    "maxTemp": -273,
                    "avgTemp": 0,
                    "avgWindSpeed": 0,
                    "avgRainfallLevel": 0,
                    "date": currentDate,
                };

                weatherData.city = response.data.city.name;

                let dataCount = 0;
                while (i < response.data.list.length && response.data.list[i].dt_txt.substring(0, 10) === currentDate) {
                    dataCount++;
                    if (response.data.list[i].rain && Object.keys(response.data.list[i].rain).length !== 0 ) {
                        tempObject.avgRainfallLevel += response.data.list[i].rain["3h"];
                    }

                    if (response.data.list[i].main.temp_min < tempObject.minTemp) {
                        tempObject.minTemp = response.data.list[i].main.temp_min;
                    }

                    if (response.data.list[i].main.temp_max > tempObject.maxTemp) {
                        tempObject.maxTemp = response.data.list[i].main.temp_max;
                    }

                    if (response.data.list[i].main.temp) {
                        tempObject.avgTemp += response.data.list[i].main.temp;
                    }

                    if (response.data.list[i].wind.speed) {
                        tempObject.avgWindSpeed += response.data.list[i].wind.speed;
                    }
                    i++;
                }

                tempObject.avgWindSpeed = (tempObject.avgWindSpeed/dataCount).toPrecision(2);
                tempObject.avgRainfallLevel = (tempObject.avgRainfallLevel);
                tempObject.avgTemp = (tempObject.avgTemp/dataCount).toPrecision(2);

                weatherData.dataList.push(tempObject);
            }

            return weatherData;
        })
        .catch(function (err) {
            console.log(err);
        });

    return weatherAPIresponse;
}

app.get('/favicon.ico', (req, res) => res.status(204));

app.get(`/:city`, async function (req, res) {
    const weatherAPIResult = await getCityData(req.params.city);
    res.send(weatherAPIResult);
});
