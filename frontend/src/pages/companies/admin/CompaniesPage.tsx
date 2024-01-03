import { useLocation, useNavigate } from "react-router-dom";
import CompanyItem from "../../../components/Company/CompanyItem";
import { useLoading } from "../../../components/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import * as bossCompanyAction from "../../../reducers/companiesReducers";
import { useEffect } from "react";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "../../../app/store";
import { AnyAction } from "redux";
import { getCookie, getUserId, setCookie } from "../../../utils";
import { Button } from "antd";
import EmptyComponent from "../../../components/EmptyComponent";

const CompaniesPage: React.FC = () => {
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
  const dispatch: AppDispatch = useDispatch();
  const companies = useSelector(bossCompanyAction.bossCompanies);
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  
  useEffect(() => {
    document.title = "公司";
    dispatch(bossCompanyAction.fetchCompanies());
    setLoading(false);
    console.log(companies);
    if(getCookie('companyId')==null) {
      if(companies&&companies.length>0)
        setCookie("companyId", companies[0].id)
    }
  }, []);

  const handleCreateCompany = () => {
    if(isAdminPath) navigate("/admin/company/create");
    else navigate("/company/create-company");
  };

  return (
    <div style={{margin:'8px'}}>
      {companies && companies.length > 0 ? (
        <div>
          <div style={{textAlign:'right', marginBottom:'8px'}}>
            <Button type="primary" onClick={handleCreateCompany} >
              創建公司
            </Button>
          </div>
          {
            companies.map((cmp) => (
              <CompanyItem id={cmp["id"]} title={cmp["name"]} />
            ))
          }
        </div>
        ):(
          <div>
            <EmptyComponent />
            <div style={{width:'100%', marginBottom:'8px'}}>
              <Button type="primary" onClick={handleCreateCompany} style={{width:'100%'}}>
                創建公司
              </Button>
            </div>
          </div>
        )
      }
      
    </div>
  );
};

export default CompaniesPage;
