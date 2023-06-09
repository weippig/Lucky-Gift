import React, { useEffect } from 'react';
import axios from 'axios';
import Loading from './component/loading';


export default function DrawsJoin(props) {
  const [draws, setDraws] = React.useState()
  const [isLoading, setIsLoading] = React.useState(true)

  useEffect(() => {
    
	  const getAllDraws = () => {
      axios.get("http://localhost:3001/user/mycontract/join/" + props.userAddress).then(function(res){
        let contracts = res.data.contracts
        let promises = []
        for(let i=0; i<contracts.length; i++) {
          promises.push(axios.get("http://localhost:3001/firebase/read/"+contracts[i]))
        }

        Promise.all(promises).then(function(res){
          let details = []

          for(let i=0;i<res.length; i++) {
            details.push(
              res[i].data
            )
          }

          setDraws(details)
          setIsLoading(false)
        })
        setIsLoading(false)
      })
    }

    getAllDraws()
	}, []);

  if(isLoading){
    return(
      <div id="loading_wrap">
        <div id="loading">
          <Loading />
        </div>
      </div>
    )
  }
  
  return(
    <div id="gift_record_frame">
      {
        draws?.map((data)=>{
          return(
            <div className="gift_record">
              <img className="record_image" src={data.imageUrl} alt="nike"/>
              <div className="gift_record_right">
                <div className="gift_record_right_line1">{data.title}</div>
                <div className="gift_record_right_line2"><div className="gift_record_right_line2_text">{data.description}</div></div>
                <div className="gift_record_right_line3"><div className="gift_record_right_line3_text">剩餘數量:</div><div className="gift_record_right_line3_text">{data.unsoldUrls.length}</div></div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}