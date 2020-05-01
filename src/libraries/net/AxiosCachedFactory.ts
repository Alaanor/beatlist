import axios, { AxiosAdapter, AxiosInstance } from "axios";
import {
  cacheAdapterEnhancer,
  throttleAdapterEnhancer,
} from "axios-extensions";
import axiosRetry, { exponentialDelay } from "axios-retry";

export default class AxiosCachedFactory {
  public static getAxios(apiBaseUrl: string): AxiosInstance {
    let axiosAdapter = axios.defaults.adapter as AxiosAdapter;
    axiosAdapter = cacheAdapterEnhancer(axiosAdapter);
    axiosAdapter = throttleAdapterEnhancer(axiosAdapter);

    const instance = axios.create({
      baseURL: apiBaseUrl,
      timeout: 10 * 1e3,
      adapter: axiosAdapter,
    });

    axiosRetry(instance, {
      retries: 3,
      retryDelay: exponentialDelay,
    });

    return instance;
  }
}
