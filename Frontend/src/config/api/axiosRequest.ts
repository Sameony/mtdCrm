import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

export const axiosRequest = {
    get: <T>(url: string, params?: {}) => axios.get<T>(url, {
        params: params
    }).then(responseBody),

    post: <T>(url: string, body: {}, params?: {}, type: any = 'json') => axios.post<T>(url, body, {
        responseType: type,
        params: params
    }).then(responseBody),

    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),

    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

axios.interceptors.request.use(config => {
    // const token = store.commonStore.token;
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config;
})

axios.interceptors.response.use(async response => {
    await sleep(1000);
    return response;
}, (error: AxiosError<any>) => {
    if (!error || !error.response) {
        toast.error('Something went wrong');
    }
    else {
        const { data, status, config } = error.response!;
        const history = useNavigate();
        switch (status) {
            case 400:
                if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                    history('/');
                }
                if (data.errors) {
                    const modalStateErrors = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modalStateErrors.push(data.errors[key])
                        }
                    }
                    throw modalStateErrors.flat();
                } else {
                    toast.error(data);
                }
                break;
            case 401:
                toast.error('unauthorised');
                break;
            case 404:
                history('/');
                break;
            case 500:
                // store.commonStore.setServerError(data);
                history('/');
                break;
        }
    }
    return Promise.reject(error);
});

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}