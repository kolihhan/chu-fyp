import { createSlice, PayloadAction  } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../app/store';
import { updateUserInfoApi,getJobsApi, getCertainJobsApi, applyJobsApi, getUserResumes, getUserApplicationRecord, cancelApplicationIdApi, createNewResumeApi, updateResumeApi, deleteResumeApi, updateOfferStatusApi } from '../api';
import requireAuthMiddleware from '../middleware/requireAuthMiddleware';
import { store } from '../app/store';

import { selectUser, setUser } from './authReducers';
import dayjs from 'dayjs';  // 引入 dayjs 库
import { message } from 'antd';
import { getUserFromToken } from '../utils';

export interface UserState {
  jobs: any;
  jobsDetails: any;
  resumes : any[];
  applicaitonRecords : any[],
}

const initialState: UserState = {
  jobs: [],
  jobsDetails: null,
  resumes : [],
  applicaitonRecords : [],
};


export const userReducers = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<any>) => {
      state.jobs = action.payload;
    },
    setJobDetails: (state, action: PayloadAction<any>) => {
      state.jobsDetails = action.payload;
    },
    setResumes: (state, action: PayloadAction<any[]>) => {
      state.resumes = action.payload;
    },
    setApplicationRecords: (state, action: PayloadAction<any[]>) => {
      state.applicaitonRecords = action.payload;
    },
  },
});

export const { setJobs, setJobDetails,setResumes, setApplicationRecords } = userReducers.actions;

export const fetchJobs = (): ThunkAction<void, RootState, unknown, any> => async dispatch => {
  try {

    const response = await getJobsApi();
    const { data } = response; // Destructure the 'data' property from the response object
    
    // id: data.id,
    // title: data.title,
    // company: data.companyEmployeePosition.company_id.name,
    // location: data.location,
    // description: data.description,
    // requirement: data.requirement,
    // min_salary: parseFloat(data.min_salary),
    // max_salary: parseFloat(data.max_salary),
    // responsibilities: data.responsibilities,
    // startAt: data.start_at,
    // offeredAt: data.offered_at,
    // closeAt: data.close_at,
    // employeeNeed: data.employee_need,
    // jobCategory: data.job_category,
    // jobNature: data.job_nature,
    // businessTrip: data.buiness_trip,
    // workingHour: data.working_hour,
    // leavingSystem: data.leaving_system,
    
    dispatch(setJobs(data.data));

  } catch (error) {
    // 处理错误情况
    console.error(error);
  }
};

export const fetchResumes = (): ThunkAction<void, RootState, unknown, any> => async (dispatch, getState) => {
  try {

    const user = selectUser(getState());

    if (user != null) {
      const response = await getUserResumes(user.id);
      const { data } = response; // Destructure the 'data' property from the response object
      
      dispatch(setResumes(data.data));
    }
 

  } catch (error) {
    // 处理错误情况
    console.error(error);
  }
};


export const applyJobs = (  jobId: number , resumeId : number ): ThunkAction<void, RootState, unknown, any> => async (dispatch, getState) => {
  try {

    // 在此处调用中间件逻辑
    const result = await requireAuthMiddleware(store);
    if (result) {
      const user = selectUser(getState());

      await applyJobsApi(jobId,resumeId,user?.id ?? 0);
    
      message.success('應聘成功');
    }

  } catch (e : any) {
    // 处理错误情况
    const { error } = e.response.data;
    message.error(error);
  }
};


export const fetchApplicationDetails = (id: number):  ThunkAction<void, RootState, unknown, any> => async (dispatch) => {
  try {
    const response = await getCertainJobsApi(id);
    const { data } = response; // Destructure the 'data' property from the response object

    dispatch(setJobDetails(data.data));
  } catch (error) {
    // 处理错误情况
    console.error(error);
  }
};

export const fetchUserApplicationRecord = ():  ThunkAction<void, RootState, unknown, any> => async (dispatch, getState) => {
  try {
    const user = selectUser(getState());
    const result = await requireAuthMiddleware(store);

    if (result) {
      const response = await getUserApplicationRecord(user?.id ?? 0);
      const { data } = response; // Destructure the 'data' property from the response object
      
      dispatch(setApplicationRecords(data.data));
    }

  } catch (error) {
    // 处理错误情况
    console.error(error);
  }
};

export const updateUserInfo = ( 
  username: string,
  email: string,
  gender: string,
  birthday: dayjs.Dayjs | null,
  address: string,
  phone: string,
  avatarUrl: string
): ThunkAction<void, RootState, unknown, any> => async (dispatch, getState) => {
  try {
    const user = selectUser(getState());
    const result = await requireAuthMiddleware(store);;

    if(result){
      const response = await updateUserInfoApi(user?.id ?? 0,username,email,gender,birthday,address,phone,avatarUrl);
      message.success('修改成功');
      
      const userData = getUserFromToken(response);
      dispatch(setUser(userData));

  
    }

  } catch (error) {
    message.error("修改失敗，請確認格式是否正確");
  }
};


export const cancelApplicationId = (id: number):  ThunkAction<void, RootState, unknown, any> => async (dispatch, getState) => {
  try {

    const result = await requireAuthMiddleware(store);

    if (result) {
      const response = await cancelApplicationIdApi(id);
     
      message.success('取消應聘記錄成功');
      

    }

  } catch (error) {
    // 处理错误情况
    console.error(error);
  }
};

export const createNewResume = (value : any):  ThunkAction<void, RootState, unknown, any> => async (dispatch, getState) => {
  try {
    const user = selectUser(getState());
    const result = await requireAuthMiddleware(store);
  
    if (result) {
      value.user = user?.id;
      const response = await createNewResumeApi(value);

      message.success('創建履歷成功');
      dispatch(fetchResumes());
    }

  } catch (error) {
    // 处理错误情况
    console.error(error);
  }
};

export const editResume = (id: number, value : any):  ThunkAction<void, RootState, unknown, any> => async (dispatch, getState) => {
  try {
    const result = await requireAuthMiddleware(store);

    if (result) {
      const response = await updateResumeApi(id,value);

      message.success('修改成功');
      dispatch(fetchResumes());
    }

  } catch (error) {
    // 处理错误情况
    console.error(error);
  }
};

export const deleteResume = (id: number):  ThunkAction<void, RootState, unknown, any> => async (dispatch, getState) => {
  try {
    const result = await requireAuthMiddleware(store);

    if (result) {
      const response = await deleteResumeApi(id);

      message.success('刪除成功');
      dispatch(fetchResumes());
    }

  } catch (error) {
    // 处理错误情况
    console.error(error);
  }
};

export const updateOfferStatus = (id: number,status:any):  ThunkAction<void, RootState, unknown, any> => async (dispatch, getState) => {
  try {

    const result = await requireAuthMiddleware(store);

    
    if (result) {
      const response = await updateOfferStatusApi(id,status);

      
      message.success('操作成功');
      
    }

  } catch (error) {
    // 处理错误情况
    console.error(error);
  }
};


export const selectJobs = (state: RootState) => state.user.jobs;
export const selectJobsDetails = (state: RootState) => state.user.jobsDetails;
export const selectUserResume = (state: RootState) => state.user.resumes;
export const selectUserApplicationRecord = (state: RootState) => state.user.applicaitonRecords;

export default userReducers.reducer;
