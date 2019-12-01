import axios, { AxiosAdapter, AxiosInstance } from 'axios';
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions';

export default class AxiosCachedFactory {
  public static getAxios(apiBaseUrl: string): AxiosInstance {
    let axiosAdapter = axios.defaults.adapter as AxiosAdapter;
    axiosAdapter = cacheAdapterEnhancer(axiosAdapter);
    axiosAdapter = throttleAdapterEnhancer(axiosAdapter);

    return axios.create({
      baseURL: apiBaseUrl,
      timeout: 2500,
      adapter: axiosAdapter,
    });
  }
}
