import axios from 'axios';
import dayjs from 'dayjs';  // 引入 dayjs 库
import { authHeaders } from './utils';

const API_URL = 'http://localhost:8000/api';

export const loginApi = (username: string, password: string) =>
  axios.post(`${API_URL}/login`, { email: username, password: password }, { headers: authHeaders() });
  

export const registerApi = (username: string,email: string,password: string,checkPassword: string,gender: string,birthday: dayjs.Dayjs | null,address: string,phone: string,avatarUrl: string) =>
  axios.post(
    `${API_URL}/register`,
    { name: username,email,password,checkPassword,gender,birthday: dayjs(birthday).format('YYYY-MM-DD'),address,phone,avatar_url: avatarUrl},
    { headers: authHeaders() }
  );

export const refreshApi = (accessToken : string) =>
  axios.post(
    `${API_URL}/verify`,
    { accessToken },
    { headers: authHeaders() }
  );

export const getUserResumes = (user : number) => {  
  return axios.get(`${API_URL}/resume/get/user/${user}`, { headers: authHeaders() });
};

export const getJobsApi = async () => {
  return axios.get(`${API_URL}/companyRecruitment/get/company/all`, { headers: authHeaders() });
};

export const applyJobsApi = async (id : number, resumeId : number, user : number) => {
  
  return axios.post(`${API_URL}/userApplicationRecord/create`, 
  { companyRecruitment_id: id,
    userResume_id : resumeId,
    user : user,
  },
  { headers: authHeaders() });
};

export const getCertainJobsApi = async (id : number) => {
  return axios.get(`${API_URL}/companyRecruitment/get/${id}`, { headers: authHeaders() });
};

export const getUserApplicationRecord = async (id : number) => {
  return axios.get(`${API_URL}/companyRecruitment/get/${id}`, { headers: authHeaders() });
};