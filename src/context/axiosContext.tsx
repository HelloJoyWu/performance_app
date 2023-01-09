import React, {createContext, useContext} from 'react';
import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {AuthContext} from './authContext';
import {objToQueryString} from '../core/util';

type axiosContextType = {
  authCq9Axios: AxiosInstance;
  authChamplandAxios: AxiosInstance;
  authKimbabaAxios: AxiosInstance;
};

const AxiosContext = createContext({} as axiosContextType);
const {Provider} = AxiosContext;
// export const cq9BackendURL = 'http://127.0.0.1:9800';
export const cq9BackendURL = 'https://riskmanagement.cqgame.games';
// export const cq9BackendURL = 'https://riskmanagement.cqgame.cc';
export const champlandBackendURL = 'https://riskmanagement.ballking.cc';
export const kimbabaBackendURL = 'https://riskmanagement.rebirth.games';

interface axiosProviderProp {
  children: React.ReactNode;
}

const AxiosProvider: React.FC<axiosProviderProp> = ({children}) => {
  const authContext = useContext(AuthContext);

  const authCq9Axios = axios.create({
    baseURL: cq9BackendURL,
    headers: {
      accept: 'application/json',
    },
  });

  const authRequestInterceptor = async (config: AxiosRequestConfig) => {
    if (!config) {
      return Promise.reject('Missing configuration');
    } else if (!config.headers) {
      return Promise.reject('Missing headers');
    } else if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${authContext.authToken[cq9BackendURL].accessToken}`;
    }

    return config;
  };

  authCq9Axios.interceptors.request.use(
    async config => {
      return await authRequestInterceptor(config);
    },
    error => {
      return Promise.reject(error);
    },
  );

  let isCq9Refreshing = false;
  let cq9FailedQueue: any[] = [];
  const processCq9Queue = (error: any, token: {} | null = null) => {
    cq9FailedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    cq9FailedQueue = [];
  };

  const authErrorResponseInterceptor = async (error: any) => {
    console.log('Trigger refresh');
    const originalRequest = error.config;
    if (error.response.data.code === 10401 && !originalRequest._retry) {
      if (isCq9Refreshing) {
        return new Promise<any>((resolve, reject) => {
          cq9FailedQueue.push({resolve, reject});
        })
          .then(tokenData => {
            originalRequest.headers.Authorization =
              'Bearer ' + tokenData.access_token;
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
      if (
        authContext.authToken[cq9BackendURL]?.refreshToken === undefined ||
        authContext.authToken[cq9BackendURL].refreshToken === ''
      ) {
        console.log('Catch empty refreshToken, may from one-time refresh');
        authContext.logout();
        //return
        return Promise.reject(error);
      }
      originalRequest._retry = true;
      isCq9Refreshing = true;
      const refreshData = {
        refresh_token: authContext.authToken[cq9BackendURL].refreshToken,
      };
      return new Promise(function (resolve, reject) {
        console.log('Do refresh');
        axios
          .post(
            `${cq9BackendURL}/api/v1/auth/token/refresh`,
            objToQueryString(refreshData),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                accept: 'application/json',
              },
            },
          )
          .then(tokenRefreshResponse => {
            const tokenData = tokenRefreshResponse.data;
            console.log('Get token data');
            originalRequest.headers.Authorization =
              'Bearer ' + tokenData.access_token;
            authCq9Axios.defaults.headers.common.Authorization =
              'Bearer ' + tokenData.access_token;

            if (tokenData.access_token == null) {
              const err = 'Get access_token as null';
              console.log(err);
              processCq9Queue(err, null);
              reject(err);
              authContext.logout();
            } else {
              authContext.storeAuthToken({
                [cq9BackendURL]: {
                  accessToken: tokenData.access_token,
                  refreshToken: tokenData.refresh_token,
                },
              });

              processCq9Queue(null, tokenData);
              resolve(axios(originalRequest));
            }
          })
          .catch(err => {
            processCq9Queue(err, null);
            reject(err);
            authContext.logout();
          })
          .finally(() => {
            isCq9Refreshing = false;
          });
      });
    }
    return Promise.reject(error);
  };

  authCq9Axios.interceptors.response.use(
    response => {
      return response;
    },
    async (error: any) => {
      return await authErrorResponseInterceptor(error);
    },
  );

  const authChamplandAxios = axios.create({
    baseURL: champlandBackendURL,
    headers: {
      accept: 'application/json',
    },
  });

  authChamplandAxios.interceptors.request.use(
    async config => {
      return await authRequestInterceptor(config);
    },
    error => {
      return Promise.reject(error);
    },
  );

  authChamplandAxios.interceptors.response.use(
    response => {
      return response;
    },
    async (error: any) => {
      return await authErrorResponseInterceptor(error);
    },
  );

  const authKimbabaAxios = axios.create({
    baseURL: kimbabaBackendURL,
    headers: {
      accept: 'application/json',
    },
  });

  authKimbabaAxios.interceptors.request.use(
    async config => {
      return await authRequestInterceptor(config);
    },
    error => {
      return Promise.reject(error);
    },
  );

  authKimbabaAxios.interceptors.response.use(
    response => {
      return response;
    },
    async (error: any) => {
      return await authErrorResponseInterceptor(error);
    },
  );

  return (
    <Provider
      value={{
        authCq9Axios,
        authChamplandAxios,
        authKimbabaAxios,
      }}>
      {children}
    </Provider>
  );
};

export {AxiosContext, AxiosProvider};
