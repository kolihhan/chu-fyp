import axios from 'axios';
import dayjs from 'dayjs';  // 引入 dayjs 库
import { authHeaders, getUserFromToken, getUserId } from './utils';

const API_URL = 'http://localhost:8000/api';

export const loginApi = (username: string, password: string) =>
  axios.post(`${API_URL}/login`, { email: username, password: password }, { headers: authHeaders() });
  

export const registerApi = (username: string,email: string,password: string,checkPassword: string,gender: string,birthday: dayjs.Dayjs | null,address: string,phone: string,avatarUrl: string, type:string) =>
  axios.post(
    `${API_URL}/register`,
    { name: username,email,password,checkPassword,gender,birthday: dayjs(birthday).format('YYYY-MM-DD'),address,phone,avatar_url: avatarUrl, type: type},
    { headers: authHeaders() }
  );

  export const updateUserInfoApi = (id:number,username: string,email: string,gender: string,birthday: dayjs.Dayjs | null,address: string,phone: string,avatarUrl: string) =>
  axios.put(
    `${API_URL}/user/update/${id}`,
    { name: username,email,gender,birthday: dayjs(birthday).format('YYYY-MM-DD'),address,phone,avatar_url: avatarUrl},
    { headers: authHeaders() }
  );

export const changeUserPassword = (id:number,data:any) =>
axios.put(
  `${API_URL}/user/changeUserPassword/${id}`,
  data,
  { headers: authHeaders() }
);

export const resetUserPassword = (data:any) =>
axios.put(
  `${API_URL}/user/resetUserPassword`,
  data,
  { headers: authHeaders() }
);

  export const getUserByEmail = (email: String) =>
  axios.get(
    `${API_URL}/user/get/email/${email}`,
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

export const getResume = (user : number) => {  
  return axios.get(`${API_URL}/userResume/get/${user}`, { headers: authHeaders() });
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

// companyRecruitment/get/applied/all
export const getRecruitmentApplicationRecord = async (id : number) => {
  return axios.get(`${API_URL}/companyRecruitment/get/applied/all/${id}`, { headers: authHeaders() });
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

export const updateOfferStatusApi = async (id:number,data : any) => {
  return axios.put(`${API_URL}/userApplicationRecord/update/${id}`, 
  { data },
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

export const getCompanyAllLeaveRecords = async (id : any) => {
  return axios.get(`${API_URL}/companyEmployeeLeave/get/company/all/${id}`, 
  { headers: authHeaders() });
};

export const updateLeaveRecords = async (id : any, data: any) => {
  return axios.put(`${API_URL}/companyEmployeeLeave/update/${id}`, 
  { data },
  { headers: authHeaders() });
};

export const applyLeaveApi = async (data : any) => {
  return axios.post(`${API_URL}/companyEmployeeLeave/create`, 
  { data },
  { headers: authHeaders() });
};

export const getCompanyEmployees = async (id : any) => {
  return axios.get(`${API_URL}/companyEmployee/get/${id}`, 
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
  
  return axios.get( `${API_URL}/boss/company`, { headers: authHeaders() } )
};

export const createCompany = async (data : any) => {
  return axios.post(`${API_URL}/createCompany`, 
  { data },
  { headers: authHeaders() });
};

export const getCompanyById = async (id : number) => {
  return axios.get( `${API_URL}/company/${id}`, { headers: authHeaders() } );
};

export const getAllEmployeesFeedback = async (id : number) => {
  return axios.get( `${API_URL}/companyEmployeeFeedBackReview/get/company/all/${id}`, { headers: authHeaders() } );
};

export const getAllEmployeesFeedbackFrom = async (id : number) => {
  return axios.get( `${API_URL}/companyEmployeeFeedBackReview/get/employee/by/all/${id}`, { headers: authHeaders() } );
};
export const getAllEmployeesFeedbackTo = async (id : number) => {
  return axios.get( `${API_URL}/companyEmployeeFeedBackReview/get/employee/to/all/${id}`, { headers: authHeaders() } );
};

export const getAllEmployeesPerformance = async (id : number) => {
  return axios.get( `${API_URL}/companyEmployeePerformance/get/company/all/${id}`, { headers: authHeaders() } );
};

export const getAllEmployeesPromotionHistory = async (id : number) => {
  return axios.get( `${API_URL}/companyPromotionHistory/get/company/all/${id}`, { headers: authHeaders() } );
};

export const createEmployeeTraining = async (data : any) => {
  return axios.post( `${API_URL}/companyEmployeeTraining/create`, 
  { data },
  { headers: authHeaders() } );
};

export const getAllCompanyTrainings = async (id : number) => {
  return axios.get( `${API_URL}/companyTraining/get/company/all/${id}`, { headers: authHeaders() } );
};

export const getAnnouncementsByCompany = async (id : number) => {
  return axios.get( `${API_URL}/announcement/get/company/all/${id}`, { headers: authHeaders() } );
};

export const addAnnouncement = async (data: any) => {
  return axios.post( `${API_URL}/announcement/create`, 
  { data },
  { headers: authHeaders() } );
};


export const deleteAnnouncement = async (id : number) => {
  return axios.delete( `${API_URL}/announcement/delete/${id}`, { headers: authHeaders() } );
};


export const updateAnnouncement = async (id : number , data:any) => {
  return axios.put( `${API_URL}/announcement/update/${id}`, 
  { data },
  { headers: authHeaders() } );
};


export const getBenefitsByCompany = async (id : number) => {
  return axios.get( `${API_URL}/companyBenefit/get/company/all/${id}`, { headers: authHeaders() } )
};

export const addBenefit = async (data:any) => {
  return axios.post( `${API_URL}/companyBenefit/create`, 
  { data },
  { headers: authHeaders() } );
};

export const updateBenefit = async (id:number, data:any) => {
  return axios.put( `${API_URL}/companyBenefit/update/${id}`,
  { data },
  { headers: authHeaders() });
};

export const deleteBenefit = async (id:number) => {
  return axios.delete( `${API_URL}/companyBenefit/delete/${id}`, { headers: authHeaders() } )
};

export const getCheckInRules = async (id : number) => {
  return axios.get( `${API_URL}/companyCheckInRule/get/${id}`, { headers: authHeaders() } )
};

export const getCheckInRecords = async (id : number) => {
  return axios.get( `${API_URL}/companyCheckIn/get/company/all/${id}`, { headers: authHeaders() } )
};

export const addCheckInRule = async (data: any) => {
  return axios.post( `${API_URL}/companyCheckInRule/create`, 
  { data },
  { headers: authHeaders() } )
};

export const updateCheckInRule = async (id : number,data: any) => {
  return axios.put( `${API_URL}/companyCheckInRule/update/${id}`, 
  { data },
  { headers: authHeaders() } )
};

export const deleteCheckInRule = async (id : number) => {
  return axios.delete( `${API_URL}/companyCheckInRule/delete/${id}`, { headers: authHeaders() } )
};

export const getDepartments = async (id : number) => {
  return axios.get( `${API_URL}/companyDepartment/get/company/all/${id}`, { headers: authHeaders() } )
};

export const createDepartment = async (data : any) => {
  return axios.post( `${API_URL}/companyDepartment/create`, 
  { data },
  { headers: authHeaders() } )
};

export const updateDepartment = async (id : number, data : any) => {
  
  return axios.put( `${API_URL}/companyDepartment/update/${id}`, 
  { data },
  { headers: authHeaders() } )
};

export const deleteDepartment = async (id : number) => {
  return axios.delete( `${API_URL}/companyDepartment/delete/${id}`, { headers: authHeaders() } )
};

export const getRecruitments = async (id : number) => {
  return axios.get( `${API_URL}/companyRecruitment/get/company/all/${id}`, { headers: authHeaders() } )
};

export const createRecruitment = async (data : any) => {
  
  return axios.post( `${API_URL}/companyRecruitment/create`, 
  { data },
  { headers: authHeaders() } )
};

export const updateRecruitment = async (id : number, recruitmentId: number, data: any) => {
  return axios.put( `${API_URL}/companyRecruitment/update/${recruitmentId}`, 
  { data },
  { headers: authHeaders() } )
};

export const deleteRecruitment = async (id : number, recruitmentId: number) => {
  
  return axios.delete( `${API_URL}/companyRecruitment/delete/${recruitmentId}`, { headers: authHeaders() } )
};

export const closeRecruitment = async (id : number, recruitmentId: number) => {

  return axios.put( `${API_URL}/companyRecruitment/close/${recruitmentId}`, { headers: authHeaders() } )
};

export const getEmployeePositions = async (id : number) => {
  
  return axios.get( `${API_URL}/companyPosition/get/company/all/${id}`, { headers: authHeaders() } )
};

export const getEmployeePositionsByDepartment = async (id : number) => {
  
  return axios.get( `${API_URL}/companyPosition/get/department/all/${id}`, { headers: authHeaders() } )
};

export const createPosition = async (data :any) => {
  
  return axios.post( `${API_URL}/companyPosition/create`, 
  { data },
  { headers: authHeaders() } )
};

export const updatePosition = async (id : number, positionId: number, data: any) => {
  
  return axios.put( `${API_URL}/companyPosition/update/${positionId}`, 
  { data },
  { headers: authHeaders() } )
};

export const deletePosition = async (id : number, positionId: number) => {
  
  return axios.delete( `${API_URL}/companyPosition/delete/${positionId}`, { headers: authHeaders() } )
};

export const getPermissions = async (id : number) => {
  
  return axios.get( `${API_URL}/companyPermission/get/company/all/${id}`, { headers: authHeaders() } )
};

export const createPermission = async (data: any) => {
  
  return axios.post( `${API_URL}/companyPermission/create`, 
  { data },
  { headers: authHeaders() } )
};


export const updatePermission = async (id : number, permissionId: number, data: any) => {
  
  return axios.put( `${API_URL}/companyPermission/update/${permissionId}`, 
  { data },
  { headers: authHeaders() } )
};

export const deletePermission = async (id : number, permissionId: any) => {
  
  return axios.delete( `${API_URL}/companyPermission/delete/${permissionId}`, { headers: authHeaders() } )
};

export const getEmployeeSettings = async (id : number) => {
  
  return axios.get( `${API_URL}/companyPosition/get/employee/${id}`, { headers: authHeaders() } )
};

export const updateEmployeeSettings = async (id : number, data: any) => {
  
  return axios.put( `${API_URL}/companyEmployee/update/${id}`, {data}, { headers: authHeaders() } )
};

export const getPositionById = async(id: number) => {
  return axios.get( `${API_URL}/companyPosition/get/${id}`, { headers: authHeaders() } )
}

export const getUserEmployee = async(id: number) => {
  return axios.get(`${API_URL}/companyEmployee/get/user/${id}`, { headers: authHeaders() })
}

export const createCompanyEmployee = async (data : any) => {
  return axios.post(`${API_URL}/companyEmployee/create`, 
  { data },
  { headers: authHeaders() });
};

export const fireCompanyEmployee = async (id: number) => {
  return axios.put(`${API_URL}/companyEmployee/fire/${id}`, 
  { id },
  { headers: authHeaders() });
};

export const resignCompanyEmployee = async (id: number) => {
  return axios.put(`${API_URL}/companyEmployee/resign/${id}`, 
  { id },
  { headers: authHeaders() });
};

export const getIDRecommendations = async(id: number) => {
  return axios.get(`${API_URL}/get_recommendations`, { 
    headers: authHeaders(),
    params: {
      job_id: id,
    },
  })
}

export const getFeedbackScore = async(id: number) => {
  return axios.get(`${API_URL}/calEmployeeScore/${id}`, { 
    headers: authHeaders(),
  })
}

export const getCompanyAllFeedbackScore = async(id: number) => {
  return axios.get(`${API_URL}/calCompanyAllEmployeeScore/${id}`, { 
    headers: authHeaders(),
  })
}

export const getTaskForcesByCompany = async(id: number) => {
  return axios.get(`${API_URL}/getTaskForcesByCompany/get/${id}`, { 
    headers: authHeaders(),
  })
}

export const fetchTaskForcesById = async(id: number) => {
  return axios.get(`${API_URL}/fetchTaskForcesById/get/${id}`, { 
    headers: authHeaders(),
  })
  
}

export const createTaskForces = async (data : any) => {
  return axios.post(`${API_URL}/createTaskForces`, 
  { data },
  { headers: authHeaders() });
};

export const updateTaskForces = (id:number, data: any) =>
axios.put(
  `${API_URL}/updateTaskForces/${id}`,
  { data },
  { headers: authHeaders() }
);

export const deleteTaskForce = async(id: number) => {
  return axios.delete(`${API_URL}/deleteTaskForce/${id}`, { 
    headers: authHeaders(),
  })
}

export const getTaskForceMilestone = async(id: number) => {
  return axios.get(`${API_URL}/taskForce/milestone/${id}`, { 
    headers: authHeaders(),
  })
}

export const getEmployeeTaskForce = async(companyId: number, employeeId: number) => {
  return axios.get(`${API_URL}/employee/taskForce/get/${companyId}/${employeeId}`, { 
    headers: authHeaders(),
  })
}

export const createTasks = async (data : any) => {
  return axios.post(`${API_URL}/createTasks`, 
  { data },
  { headers: authHeaders() });
};

export const getTasksByTf_id = async(id: number) => {
  return axios.get(`${API_URL}/getTasksByTfId/get/${id}`, { 
    headers: authHeaders(),
  })
}

export const updateTasks = (id:number, data: any) =>
axios.put(
  `${API_URL}/updateTasks/${id}`,
  { data },
  { headers: authHeaders() }
);

export const deleteTasks= async(id: number) => {
  return axios.delete(`${API_URL}/deleteTasks/${id}`, { 
    headers: authHeaders(),
  })
}

export const fetchTasksByEmployeeId = async(id: number) => {
  return axios.get(`${API_URL}/fetchTasksByEmployeeId/get/${id}`, { 
    headers: authHeaders(),
  })
}

export const findSuitableAssignee = async(id:number,description: string, title: string) => {
  return axios.get(`${API_URL}/recommendAssignee/${id}/get/${description}/${title}`, { 
    headers: authHeaders(),
  })
}

export const generateTimetable = async(companyEmployeeId:number) => {
  return axios.get(`${API_URL}/task/generateTimetable/${companyEmployeeId}`, { 
    headers: authHeaders(),
  })
}

export const getChartData = async(id:number) => {
  return axios.get(`${API_URL}/hr-data/${id}`, { 
    headers: authHeaders(),
  })
}

export const sendInvitation = async (data : any) => {
  return axios.post(`${API_URL}/sendInvitationEmail`, 
  data,
  { headers: authHeaders() });
};

export const acceptInvitation = async(data: any) => {
  return axios.post(`${API_URL}/registerAndJoinCompany`, 
  data,
  { headers: authHeaders() })
}

export const getInvitation = async(code: string) => {
  return axios.get(`${API_URL}/getInvitation/${code}`, 
  { headers: authHeaders() })
}