import axios from 'axios';
import { loadToken } from './utils';
import dayjs from 'dayjs';  // 引入 dayjs 库


const API_URL = 'http://localhost:8000/api';

const headers = {
  'Content-Type': 'application/json',
};

export const loginApi = (username: string, password: string) =>
  axios.post(`${API_URL}/login`, { email: username, password: password }, { headers });

export const registerApi = (username: string,email: string,password: string,checkPassword: string,gender: string,birthday: dayjs.Dayjs | null,address: string,phone: string,avatarUrl: string) =>
  axios.post(
    `${API_URL}/register`,
    { name: username,email,password,checkPassword,gender,birthday: dayjs(birthday).format('YYYY-MM-DD'),address,phone,avatar_url: avatarUrl},
    { headers }
  );

export const refreshApi = (accessToken : string) =>
  axios.post(
    `${API_URL}/register`,
    { accessToken },
    { headers }
  );

export const getProfileApi = () => {
  const token = loadToken ();
  const headers = { Authorization: `Bearer ${token}` };
  return axios.get(`${API_URL}/auth/user/`, { headers });
};


export const getJobsApi = async () => {
  return axios.get(`${API_URL}/companyRecruitment/get/company/all`, { headers });
};