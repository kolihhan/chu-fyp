import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Card } from 'antd';

import { useSelector, useDispatch } from 'react-redux';

import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom';
import 'dayjs/locale/zh-cn';
import { getCookie, setCookie } from '../../utils';
import { getUserEmployee } from '../../api';
import { setSelectCompany } from '../../reducers/employeeReducers';



interface CompanyItemProps{
    id: number;
    title: String;
    // image: String;
}

interface ButtonRowProps{
    id: number
}


const ButtonRow: React.FC<ButtonRowProps> = ({id}) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isEmployee = useSelector((state: RootState) => state.employee.employees);

    const handlerView = async () => {
        const response = await getUserEmployee(Number(getCookie('userId')))
        response.data.map((cmp: any) => {
            if(cmp.company_id==id) {
                setCookie('employeeId', cmp.id)
            }
        })
        navigate(`/company/view`)
        setCookie("companyId", `${id}`)
    }

    const handlerEnter = async () => {
        setCookie("companyId", `${id}`)
        isEmployee.forEach((employee, index) => {
            if(employee.company_id.id==id) {
                console.log(employee)
                dispatch(setSelectCompany(index))
                // setCompanyName(employee.company_id.name);
                setCookie('employeeId', employee.id)
                setCookie("companyId", `${id}`)
                navigate(`/admin/company/employees`)
            }
        })
    }

    return (
            <Row gutter={[2, 16]}>
                <Col>
                    <Button type="default" onClick={() => handlerView()}>查看</Button>
                </Col>
                <Col>
                    <Button type="primary" onClick={() => handlerEnter()}>進入</Button>
                </Col>
                {/* <Col>
                    <Button type='primary' danger>刪除</Button>
                </Col> */}
            </Row>
    );
};

const CompanyItem: React.FC<CompanyItemProps> = ({id, title}) => {
    type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
    const dispatch: AppDispatch = useDispatch();

    const [showContent, setShowContent] = useState(false);
    useEffect(() => {
        setShowContent(false);
      }, []);

    return (
        <div style={{width: '100%', marginBottom: '8px'}}>
            <Card title={title} extra={<ButtonRow id={id}/>} bodyStyle={{display:'none'}}/>
        </div>
    )
}

export default CompanyItem