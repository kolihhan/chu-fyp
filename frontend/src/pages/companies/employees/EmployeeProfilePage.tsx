import { useEffect, useState } from "react"
import { getCookie } from "../../../utils"
import { getCompanyEmployees } from "../../../api"

const EmployeeProfilePage: React.FC = () => {

    const userId = getCookie('userId')
    const employeeId = getCookie('employeeId')
    const role = getCookie("role")
    const [employeeData, setEmployeeData] = useState<any>(null)

    useEffect(() => {
        if(employeeId!=null){
            getEmployeeData()
          }
    }, [])

    const getEmployeeData = async () => {
        const response = await getCompanyEmployees(employeeId)
        if(response.status==200){
            console.log(response.data)
            setEmployeeData(response.data)
        }
    }

    return (
        <div></div>
    )
}

export default EmployeeProfilePage