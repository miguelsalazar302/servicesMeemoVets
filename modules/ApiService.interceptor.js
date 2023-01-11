import axios from 'axios';
import promise from 'promise';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userDataLocalStorage} from "../models/constants";

// Add a request interceptor
const axiosInstance = axios.create();

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

axiosInstance.interceptors.request.use(async (config) => {
    config.headers = headers;

    let userData = await AsyncStorage.getItem(userDataLocalStorage);
    userData = JSON.parse(userData);


    if(userData && userData.token) {
        console.log('USER DATA:');
        console.log(userData);
        config.headers.authorizationjwt = userData.token;
    }

    return config;
}, (error) => {
    // Do something with request error
    console.log('ERROR:');
    console.log(error);
    return promise.reject(error);
});

export default axiosInstance;