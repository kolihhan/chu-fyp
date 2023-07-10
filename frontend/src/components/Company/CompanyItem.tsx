import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Card } from 'antd';

import { useSelector, useDispatch } from 'react-redux';

import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom';
import 'dayjs/locale/zh-cn';



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

    const handlerView = () => {
        navigate(`/company/${id}/view`)
    }

    const handlerEnter = () => {
        navigate(`/admin/company/${id}/employees`)
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
        <div style={{width: '100vw', margin: '8px'}}>
            <Card title={title} extra={<ButtonRow id={id}/>} bodyStyle={{display:'none'}}/>
        </div>
    )
}

export default CompanyItem