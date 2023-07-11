import { useNavigate } from "react-router-dom";
import CompanyItem from "../../../components/Company/CompanyItem";
import { useLoading } from "../../../components/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import * as bossCompanyAction from "../../../reducers/companiesReducers";
import { useEffect } from "react";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "../../../app/store";
import { AnyAction } from "redux";
import { getUserId } from "../../../utils";
import { Button } from "antd";

const CompaniesPage: React.FC = () => {
  type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
  const dispatch: AppDispatch = useDispatch();
  const companies = useSelector(bossCompanyAction.bossCompanies);
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "公司";
    dispatch(bossCompanyAction.fetchCompanies());
    setLoading(false);
    console.log(companies);
  }, []);

  const handleCreateCompany = () => {
    navigate("/company/create-company");
  };

  return (
    <div>
      <Button type="primary" onClick={handleCreateCompany}>
        创建公司
      </Button>
      {companies?.map((cmp) => (
        <CompanyItem id={cmp["id"]} title={cmp["name"]} />
      ))}
    </div>
  );
};

export default CompaniesPage;
