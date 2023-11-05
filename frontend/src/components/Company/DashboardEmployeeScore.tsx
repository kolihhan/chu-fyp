import { Card, Progress } from "antd"
import { getCompanyAllFeedbackScore } from "../../api"
import { useEffect, useState } from "react"
import ReactDOM from 'react-dom';
import { getCookie } from "../../utils"
import { Column } from '@ant-design/plots';

const DashboardEmployeeScore:React.FC = () => {

    const companyId = Number(getCookie('companyId'))
    const [employeeScoreList, setEmployeeScoreList] = useState([])
    const [employeeFeedbackList, setEmployeeFeedbackList] = useState([])
    const [employeeAverageScore, setEmployeeAverageScore] = useState(0)
    const [scoreColor, setScoreColor] = useState("blue")

    useEffect(() => {
        calFeedbackScore() 
    }, [])

    const calFeedbackScore = async () => {
        const response = await getCompanyAllFeedbackScore(companyId)
        console.log(response.data.data)
        setEmployeeScoreList(response.data.data.scoreList)
        setEmployeeAverageScore(response.data.data.average)
        setEmployeeFeedbackList(response.data.data.remarkList)
        if(response.data.data.average < 40){
            setScoreColor('red')
        }else if(response.data.data.average < 60){
            setScoreColor('yellow')
        }else if(response.data.data.average < 80){
            setScoreColor('green')
        }else{
            setScoreColor('blue')
        }

        let feedbackdata: any = []
        response.data.data.remarkList.map((fb: any) => {
            feedbackdata.push({
                remarks: fb.remarks,
                count: fb.count
            })
        })
        setEmployeeFeedbackList(feedbackdata)
    }

      const meta = {
        remarks: { alias: '評價' },
        count: { alias: '數量' },
      }

      const xAxis = {
        label: { autoHide: false, autoRotate: true },
      }

    return (
        <Card title="Employee Average Score and Performance" >
            <div style={{ display:'flex', justifyContent:'space-around', alignItems:'center', height:'350px' }}>
                <Progress type="circle" percent={employeeAverageScore} strokeColor={scoreColor}
                format={(percent) => `${percent}`}/>
                <Column data={employeeFeedbackList} xField='remarks' yField='count'
                meta={meta} xAxis={xAxis} />;
            </div>
        </Card>
    )
}

export default DashboardEmployeeScore