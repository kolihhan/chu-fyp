import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { createCheckIn, selectSelectedCompany, selectSelf } from '../../../reducers/employeeReducers';

import { AnyAction } from '@reduxjs/toolkit';
import { Button, Collapse, Layout } from "antd";
import { ThunkDispatch } from 'redux-thunk';
import { getAllEmployees, getCheckInRecord, getCompanyAnnouncement, getSelfFeedbackResponse } from '../../../api';

const CheckInPage: React.FC = () => {

  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
  const dispatch: AppDispatch = useDispatch();
  const employeeId = useSelector(selectSelf);
  const employeeSelect = useSelector(selectSelectedCompany);

  const [isCheckedIn, setIsCheckedIn] = useState<number>(0);
  const [isFeedBackRecord, setIsFeedBackRecode] = useState<any[]>([]);
  const [companyEmployees, setCompanyEmployees] = useState<any[]>([]);
  const [companyAnnouncement, setCompanyAnnouncement] = useState<any[]>([]);

  const { Header, Content } = Layout;
  const { Panel } = Collapse;

  useEffect(() => {
    // 获取请假记录
    fetchCheckInRecord();
  }, []);


  const fetchCheckInRecord = async () => {
    try {
      const checkInResponse = await getCheckInRecord(employeeId[employeeSelect].id);
      const employeeResponse = await getAllEmployees(employeeId[employeeSelect].company_id.id);
      const announcementResponse = await getCompanyAnnouncement(employeeId[employeeSelect].company_id.id, employeeId[employeeSelect].id);
      const feedbackResponse = await getSelfFeedbackResponse(employeeId[employeeSelect].id);


      setIsCheckedIn(checkInResponse.data.status);
      setCompanyEmployees(employeeResponse.data);
      setCompanyAnnouncement(announcementResponse.data);
      setIsFeedBackRecode(feedbackResponse.data);

      setIsCheckedIn(1)
    } catch (error) {
      console.log(error);
    }
  };


  const handleCheckIn = () => {
    dispatch(createCheckIn(employeeId[employeeSelect].id,"Check In"));
  };

  const handleCheckOut = () => {
    dispatch(createCheckIn(employeeId[employeeSelect].id,"Check Out"));
  };

  return (
    <Content className="container content">
      <div className="left-section">
        <Collapse
          className="collapse-box mt-3 ml-3 mr-3"
          defaultActiveKey={["1"]}
        >
          <Panel header="Collapse Box 1" key="1">

            <div className="collapse-content">

              <div>
                <h1>Check-In Page</h1>
                {
                  isCheckedIn === 1 ? (
                    <div>
                      <p>请点击下方按钮完成签到。</p>
                      <Button type="primary" onClick={handleCheckIn}>
                        签到
                      </Button>
                    </div>
                  ) : isCheckedIn === 2 ? (
                    <div>
                      <p>请点击下方按钮完成簽出。</p>
                      <Button type="primary" onClick={handleCheckOut}>
                        簽出
                      </Button>
                    </div>
                  ) : isCheckedIn === 3 ? (
                    <div>
                      <p>您已請假，无需签到。</p>
                    </div>
                  ) : (
                    <div>
                      <p>Loading....</p>
                    </div>
                  )
                }
              </div>
            </div>
          </Panel>
        </Collapse>

        <Collapse className="collapse-box" defaultActiveKey={["3"]}>
          <Panel header="Collapse Box 3" key="3">
            <div className="scrollable-box with-scrollbar">
              {Array.isArray(isFeedBackRecord) && isFeedBackRecord.map((feedback) => (
                <>{feedback.remarks}</>
              ))}

            </div>
          </Panel>
        </Collapse>

        <div className="scrollable-box">
          {Array.isArray(companyAnnouncement) &&  companyAnnouncement.map((announcement) => (
            <>{announcement.title}</>
          ))}
        </div>

      </div>
      <div className="right-section">
        <div className="scrollable-box with-scrollbar">
          {Array.isArray(companyEmployees) &&  companyEmployees.map((employee) => (
            <>{employee.user_id.name}</>
          ))}
        </div>
      </div>
    </Content>

  );
};

export default CheckInPage;
