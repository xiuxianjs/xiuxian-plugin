import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const instance = axios.create({
  baseURL: './api'
});

/**
 *
 * @param config
 * @returns
 */
export const request = (config: AxiosRequestConfig): Promise<any> => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    instance(config)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const authRequest = (config: AxiosRequestConfig): Promise<any> => {
  const savedToken = localStorage.getItem('token');
  return new Promise<AxiosResponse>((resolve, reject) => {
    instance({
      headers: {
        Authorization: `Bearer ${savedToken}`
      },
      ...config
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};
