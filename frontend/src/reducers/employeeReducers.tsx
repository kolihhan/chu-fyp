import { AnyAction,createSlice, PayloadAction  } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../app/store';
import requireAuthMiddleware from '../middleware/requireAuthMiddleware';
import { store } from '../app/store';

import { message } from 'antd';
import { applyLeaveApi, createCheckInApi, createFeedbackApi } from '../api';
export interface EmployeeUserState {
    employees: any[];
    selectCompany : number;
  }

const initialState: EmployeeUserState = {
    employees: [],
    selectCompany : 0,
  };

  
export const employeeReducers = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployees: (state, action: PayloadAction<any>) => {
      state.employees = action.payload;
    },
    setSelectCompany: (state, action: PayloadAction<any>) => {
      state.selectCompany = action.payload;
    },
  },
});

export const { setEmployees, setSelectCompany} = employeeReducers.actions;


export const createFeedback = (
  data: any
): ThunkAction<void, RootState, unknown, AnyAction> => async dispatch => {
  try {
     const result = await requireAuthMiddleware(store);
    
     if (result) {
      const response = await createFeedbackApi(data);


      if(response.status == 200){
          message.success('評價成功！');
      }

    }

  } catch (error) {


  }
};

export const applyLeave = (
  data: any
): ThunkAction<void, RootState, unknown, AnyAction> => async dispatch => {
  try {
    const result = await requireAuthMiddleware(store);

        
    if (result) {

      const response = await applyLeaveApi(data);

      
      message.success('申請成功，請等待批准');
      
    }


  } catch (error) {


  }
};


export const createCheckIn = (id:number,status: any): ThunkAction<void, RootState, unknown, AnyAction> => async dispatch => {
  try {
    const result = await requireAuthMiddleware(store);

    if(result){


      const response = await createCheckInApi(id,status);
      
      (status) ? message.success('簽到成功') : message.success('簽出成功');
    }

  } catch (error) {

    
  }
};


export const selectSelf = (state: RootState) => state.employee.employees;
export const selectSelectedCompany = (state: RootState) => state.employee.selectCompany;

export default employeeReducers.reducer;
