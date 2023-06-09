import "./DrawDetail.css"
import { useAccount, useConnect } from "wagmi";
import React, { useState , useEffect } from 'react';
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2'
import axios from "axios";
import { InjectedConnector } from 'wagmi/connectors/injected'
import Loading from "./component/loading";

function DrawDetail() {
	const [data, setData] = React.useState()
  const [isLoading, setIsLoading] = React.useState(true)
	const { contract } = useParams()
	const { address, isConnected } = useAccount()

	const { connect } = useConnect({
    connector: new InjectedConnector(),
  })

	useEffect(() => {
		const connectWalletOnPageLoad = async () => {
			if (localStorage?.getItem('isWalletConnected') === 'true') {
				try {
					connect()
				} catch (ex) {
					console.log(ex)
				}
			}
		}

		const getDraws = () => {
			axios.get('http://localhost:3001/firebase/read/' + contract).then(function (response) {
				setData(response.data)
        setIsLoading(false)
			})
		}

		getDraws()
		connectWalletOnPageLoad()
	}, []);

	function draw_btn_click() {
		if(localStorage?.getItem('isWalletConnected') === 'false'){
			Swal.fire({
				icon: 'warning',
				title: '尚未連接錢包',
				text: `請先點擊右上角按鈕連接錢包`
			})

			return
		}

		axios.post("http://localhost:3001/nft/mint", {
			"contractAddress": contract,
  		"receiver": address
		}).then(function(response){
			Swal.fire({
				icon: 'success',
				title: 'Mint 成功！',
				text: `抽獎的合約地址為${response.data.contract}, 您的 Token id 為: ${response.data.tokenId}, Receipt Hash 為 ${response.data.receiptHash}`
			}).then(()=>{
				window.location.reload()
			})
		}).catch(function (error) {
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: '出現錯誤',
				text: `請待會再試`
			})
		});
	};

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
		<div>
			<div id="detail_wrap">
				<div id="detail_title">{data.title}</div>
				<div id="detail_describe_wrap">
					<div id="detail_describe">{data.description}</div>
				</div>
				<div id="detail_content_wrap">
					<div id="detail_content_text">剩餘數量: {data.unsoldUrls.length}</div>
				</div>
				<div id="detail_button_wrap">
					<button id="attend" onClick={draw_btn_click}>參加抽獎</button>
				</div>
			</div>
		</div>
	  );
};

export default DrawDetail;

