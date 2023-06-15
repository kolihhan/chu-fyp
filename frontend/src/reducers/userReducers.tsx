import { createSlice, PayloadAction,createAction  } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../app/store';
import { getJobsApi } from '../api';
import requireAuthMiddleware from '../middleware/requireAuthMiddleware';
import { store } from '../app/store';

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
}

const initialState: UserState = {
  jobs: [],
};

export const userReducers = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {

      state.jobs = action.payload;
    },
  },
});

export const { setJobs } = userReducers.actions;

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

export const applyJobs = (  jobId: number ): ThunkAction<void, RootState, unknown, any> => async dispatch => {
  try {

    // 在此处调用中间件逻辑
    const result = await dispatch(requireAuthMiddleware(store)(dispatch)(dispatch)(/* provide the required action */));
    
    const response = await getJobsApi();
    const { data } = response; // Destructure the 'data' property from the response object
    
    dispatch(setJobs(data.data));

  } catch (error) {
    // 处理错误情况
    console.error(error);
  }
};

export const selectJobs = (state: RootState) => state.user.jobs;

export default userReducers.reducer;
