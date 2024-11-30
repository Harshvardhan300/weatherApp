import axios from 'axios';
import { apiKey } from './api.js';
const forecastEndPoint = params=> `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}&aqi=yes&alerts=no`;
const LocationEndPoint = params=> `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;
const apiCall = async (endpoint)=>{
    const options = {
        method: 'GET',
        url: endpoint
    }
    try{
        const response = await axios.request(options);
        return response.data;
    }catch(err){
        console.log('error: ',err);
        return null;
    }
}

export const fetchWeatherForecast = params=>{
    return apiCall(forecastEndPoint(params));
}
export const fetchLocation = params=>{
    return apiCall(LocationEndPoint(params));
}