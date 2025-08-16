import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const instance = axios.create({
  baseURL: './api'
})

/**
 *
 * @param config
 * @returns
 */
export const request = (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    instance(config)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
