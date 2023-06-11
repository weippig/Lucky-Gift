import React, { useEffect } from 'react';
import axios from 'axios';
import Loading from './component/loading';

function NFTDetail(props) {
  console.log(props)
  let contract = props.contract
  let qid = props.qid?.slice(7)
  let receiptHash = props.receiptHash
  let tokenId = props.tokenId

  const [data, setData] = React.useState()
  const [isLoading, setIsLoading] = React.useState(true)

  useEffect(() =>{
    const getDetail = () => {
      axios.get("http://localhost:3001/pinata/get_metadata/"+qid).then(function(res){
        setData(res.data)
        setIsLoading(false)
      })
    }
    
    getDetail()
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
    <div className="gift_record_nft">
      <img className="record_image_nft" src={data.image} alt="nike"/>
      <div className="gift_record_right">
        <div className="gift_record_right_line1">{data.name}</div>
        <div className="gift_record_right_line2"><div className="gift_record_right_line2_text">{data.description}</div></div>
        <div className="gift_record_right_line3"><div className="gift_record_right_line3_text">Token id: </div><div className="">{tokenId}</div></div>
        <div className="gift_record_right_line4_nft">
          <div className="gift_record_right_line4_nft_text">Contract address:</div>
          <div className="gift_record_right_line4_nft_text_contract">{contract}</div>
        </div>
      </div>
    </div>
  )
}

export default function MyNFT(props) {
  const [nfts, setNFTs] = React.useState()
  const [isLoading, setIsLoading] = React.useState(true)

  useEffect(() => {
    
	  const getAllNFTs = () => {
      axios.get("http://localhost:3001/user/nfts/" + props.userAddress).then(function(res){
       setNFTs(res.data.nfts)
       setIsLoading(false)
      })
    }

    getAllNFTs()
	}, []);

  function getNFTDetail(data) {
    console.log(data)
    return(
      <div>
        {
          data.nfts?.map((nft)=>{
            return(
              <NFTDetail contract={data.contract} qid={nft.Metadata} receiptHash={nft.ReceiptHash} tokenId={nft.Tokenid
              } />
            )
          })
        }
      </div>
    )
  }

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
        nfts?.map((data)=>{
          return(
            getNFTDetail(data)
          )
        })
      }
    </div>
  )
}