import {Image} from "antd"

const EmptyComponent: React.FC = () => {
    const image = "/image/empty.png"
    return (
        <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
            <center>
                <Image src={image} style={{height:'64px', width:'64px'}}></Image>
                <h3>Nothing here</h3>
            </center>
        </div>
    )
}

export default EmptyComponent