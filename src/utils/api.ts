import axiosInstance from './axiosConfig';
export const getData = (endpoint:string) => axiosInstance.get(endpoint);
export const postData = (endpoint:string, data:object) => axiosInstance.post(endpoint, data);
export const putData = (endpoint:string) => axiosInstance.put(endpoint);