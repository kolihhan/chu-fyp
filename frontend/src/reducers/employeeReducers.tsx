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

export interface EmployeeUserState {
    employees: any;
    jobsDetails: any;
    resumes : any[];
    applicaitonRecords : any[],
  }

const initialState: EmployeeUserState = {
    employees: [],
    jobsDetails: null,
    resumes : [],
    applicaitonRecords : [],
  };

  
export const employeeReducers = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployees: (state, action: PayloadAction<any>) => {
      state.employees = action.payload;
    },
  },
});

export const { setEmployees } = employeeReducers.actions;



export const selectJobs = (state: RootState) => state.employee.employees;

export default employeeReducers.reducer;
