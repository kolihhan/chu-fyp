import { createSlice, PayloadAction  } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../app/store';
import { getJobsApi, getCertainJobsApi, applyJobsApi, getUserResumes, getUserApplicationRecord } from '../api';
import requireAuthMiddleware from '../middleware/requireAuthMiddleware';
import { store } from '../app/store';

import { selectUser } from './authReducers';

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  requirement: string;
  minSalary: number;
  maxSalary: number;
  responsibilities: boolean;
  startAt: string; // 注意日期类型需要根据实际情况调整
  offeredAt: string; // 注意日期类型需要根据实际情况调整
  closeAt: string; // 注意日期类型需要根据实际情况调整
  employeeNeed: number;
  jobCategory: string;
  jobNature: string;
  businessTrip: boolean;
  workingHour: string;
  leavingSystem: string;
}

export interface UserState {
  jobs: Job[];
  jobsDetails: Job | null;
  resumes : any[];
}

const initialState: UserState = {
  jobs: [],
  jobsDetails: null,
  resumes : [],
};


export const userReducers = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
    },
    setJobDetails: (state, action: PayloadAction<Job>) => {
      state.jobsDetails = action.payload;
    },
    setResumes: (state, action: PayloadAction<any[]>) => {
      state.resumes = action.payload;
    },
  },
});

export const { setJobs, setJobDetails,setResumes } = userReducers.actions;

export const fetchJobs = (): ThunkAction<void, RootState, unknown, any> => async dispatch => {
  try {

    const response = await getJobsApi();
    const { data } = response; // Destructure the 'data' property from the response object
    
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
    const result = await dispatch(requireAuthMiddleware(store)(dispatch)(dispatch)(/* provide the required action */));
    if (result) {
      const user = selectUser(getState());

      const response = await applyJobsApi(jobId,resumeId,user?.id ?? 0);
      const { data } = response; // Destructure the 'data' property from the response object
  
      console.log(data);
    }

  } catch (error) {
    // 处理错误情况
    console.error(error);
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

    const response = await getUserApplicationRecord(user?.id ?? 0);
    const { data } = response; // Destructure the 'data' property from the response object
    
    dispatch(setJobDetails(data.data));
  } catch (error) {
    // 处理错误情况
    console.error(error);
  }
};



export const selectJobs = (state: RootState) => state.user.jobs;
export const selectJobsDetails = (state: RootState) => state.user.jobsDetails;
export const selectUserResume = (state: RootState) => state.user.resumes;
export const selectUserApplicationRecord = (state: RootState) => state.user.resumes;

export default userReducers.reducer;
