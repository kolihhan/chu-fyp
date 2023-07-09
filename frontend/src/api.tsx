import axios from 'axios';
import dayjs from 'dayjs';  // 引入 dayjs 库
import { authHeaders, getUserFromToken, getUserId } from './utils';

const API_URL = 'http://localhost:8000/api';

export const loginApi = (username: string, password: string) =>
  axios.post(`${API_URL}/login`, { email: username, password: password }, { headers: authHeaders() });
  

export const registerApi = (username: string,email: string,password: string,checkPassword: string,gender: string,birthday: dayjs.Dayjs | null,address: string,phone: string,avatarUrl: string) =>
  axios.post(
    `${API_URL}/register`,
    { name: username,email,password,checkPassword,gender,birthday: dayjs(birthday).format('YYYY-MM-DD'),address,phone,avatar_url: avatarUrl},
    { headers: authHeaders() }
  );

  export const updateUserInfoApi = (id:number,username: string,email: string,gender: string,birthday: dayjs.Dayjs | null,address: string,phone: string,avatarUrl: string) =>
  axios.put(
    `${API_URL}/user/update/${id}`,
    { name: username,email,gender,birthday: dayjs(birthday).format('YYYY-MM-DD'),address,phone,avatar_url: avatarUrl},
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
  return axios.get(`${API_URL}/userApplicationRecord/get/user/all/${id}`, { headers: authHeaders() });
};

export const cancelApplicationIdApi = async (id : number) => {
  return axios.post(`${API_URL}/userApplicationRecord/delete/${id}`, null, { headers: authHeaders() });
};

export const createNewResumeApi = async (value : any) => {
  return axios.post(`${API_URL}/userResume/create`, 
  { value},
  { headers: authHeaders() });
};

export const updateResumeApi = async (id:number,value : any) => {
  return axios.put(`${API_URL}/userResume/update/${id}`, 
  { value},
  { headers: authHeaders() });
};

export const deleteResumeApi = async (id:number) => {
  return axios.delete(`${API_URL}/userResume/delete/${id}`, 
  { headers: authHeaders() });
};

export const updateOfferStatusApi = async (id:number,status : any) => {
  return axios.put(`${API_URL}/userApplicationRecord/update/${id}`, 
  { status },
  { headers: authHeaders() });
};



export const createFeedbackApi = async (data : any) => {
  return axios.post(`${API_URL}/companyEmployeeFeedBackReview/create`, 
  { data },
  { headers: authHeaders() });
};



export const getLeaveRecords = async (id : any) => {
  return axios.get(`${API_URL}/companyEmployeeLeave/get/employee/all/${id}`, 
  { headers: authHeaders() });
};

export const applyLeaveApi = async (data : any) => {
  return axios.post(`${API_URL}/companyEmployeeLeave/create`, 
  { data },
  { headers: authHeaders() });
};

export const getAllEmployees = async (id : any) => {
  return axios.get(`${API_URL}/companyEmployee/get/company/all/${id}`, 
  { headers: authHeaders() });
};

export const getCompanyAnnouncement = async (Cid:any,id : any) => {
  return axios.get(`${API_URL}/announcement/get/user/all/${Cid}/${id}`, 
  { headers: authHeaders() });
};

export const getSelfFeedbackResponse = async (id : any) => {
  return axios.get(`${API_URL}/companyEmployeeFeedBackReview/get/${id}`, 
  { headers: authHeaders() });
};



export const getCheckInRecord = async (id : any) => {
  return axios.get(`${API_URL}/company/check-in/${id}`, 
  { headers: authHeaders() });
};

export const createCheckInApi = async (id:number,status : any) => {
  return axios.post(`${API_URL}/company/check-in/${id}`, 
  { status },
  { headers: authHeaders() });
};


export const getBossAllCompany = async () => {
  console.log(sessionStorage.getItem('accessToken'))
  return axios.get( `${API_URL}/boss/company`, { headers: authHeaders() } )
};
