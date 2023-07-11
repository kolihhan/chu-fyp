import { createSlice, PayloadAction  } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../app/store';
import { updateUserInfoApi,getJobsApi, getCertainJobsApi, applyJobsApi, getUserResumes, getUserApplicationRecord, cancelApplicationIdApi, createNewResumeApi, updateResumeApi, deleteResumeApi, updateOfferStatusApi, getBossAllCompany, getCompanyById } from '../api';
import requireAuthMiddleware from '../middleware/requireAuthMiddleware';
import { store } from '../app/store';

import { selectUser, setUser } from './authReducers';
import dayjs from 'dayjs';  // 引入 dayjs 库
import { message } from 'antd';
import { getUserFromToken } from '../utils';

export interface CompanyState{
    name: String;
    bossId: Number;
    email: String;
    phone: String;
    address: String;
    company_desc: String;
    company_benefits: String;
    create_at: String;
    update_at: String;
}

export interface CompaniesState{
    companies: any[];
}

const initialState: CompaniesState = {
    companies: []
}

export const companiesReducer = createSlice({
  name: 'companies', 
  initialState, 
  reducers:{
    setCompanies: (state, action: PayloadAction<any>) => {
        state.companies = action.payload
    }
  }  
})

export const { setCompanies } = companiesReducer.actions

export const fetchCompanies  = (): ThunkAction<void, RootState, unknown, any> => async dispatch => {
    try {
        const response = await getBossAllCompany();
        const { data } = response;
        dispatch(setCompanies(data))
    } catch (error) {
        console.error(error);
    }
}

export const bossCompanies = (state: RootState) => state.companies.companies

export const companyById = (byId: number) => (state: RootState) => 
    state.companies.companies.filter((cmp) => cmp.id == byId)

export default companiesReducer.reducer