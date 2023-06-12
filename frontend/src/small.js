import "./main.css"
import "./small.css"
import * as React from 'react';
import { useEffect } from "react";
import axios from "axios";
import Loading from "./component/loading";

export default function Small(props) {
  const [data, setData] = React.useState()
  const [isLoading, setIsLoading] = React.useState(true)

  function draw() {
    window.open("http://localhost:3000/DrawDetail/"+props.contract, "_blank", "width=800,height=600");
  };

  useEffect(() => {
    const getDraws = () => {
      axios.get('http://localhost:3001/firebase/read/' + props.contract).then(function (response) {
        setData(response.data)
        setIsLoading(false)
      })
    }

    getDraws()
  }, [])

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
      <div id="event">
        <div id="remaining">{data.unsoldUrls.length}/{data.unsoldUrls.length + data.soldUrls.length}</div>
        <div id="event_img_container"><img id="event_img" src={data.imageUrl} alt=""/></div>
        <div id="event_text_block">
          <div id="event_text_block_level1">
            <div id="event_title">{data.title}</div>
            <div id="event_btn" onClick={draw}>Mint</div>
          </div>
          <div id="event_description">
            {
              data.tags.map((item, i) => {
                if(item!==""){
                  return <div  id="special" key={i}>{item}</div>
                }
                return <div></div>
              })
            }
          </div>
        </div>
      </div>
  )
}