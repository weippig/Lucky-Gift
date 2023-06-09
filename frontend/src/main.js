import "./main.css"
import * as React from 'react';
import { useEffect } from "react";
import { InjectedConnector } from 'wagmi/connectors/injected'
import ConnectButton from "./component/connect";
import Small from "./small";
import { useConnect  } from 'wagmi'
import axios from "axios";
import Loading from "./component/loading";

function Main() {
	const { connect } = useConnect({
    connector: new InjectedConnector(),
  })

	const [draws, setDraws] = React.useState([])
	const [isLoading, setIsLoading] = React.useState(false)

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

		// const getDraws = () => {
		// 	setIsLoading(true)
			

		// 	axios.get('http://localhost:3001/firebase/contracts').then(function (response) {
		// 		Promise.all(response.data.contracts.map(contract => {
		// 			axios.get('http://localhost:3001/firebase/read/'+ contract).then(resp => {
		// 				draws.push(resp.data)
		// 			})
		// 		})).then(()=>{
		// 			setIsLoading(false)
		// 		})
		// 	})

		// 	setIsLoading(false)
		// }

		const getDraws = () => {
			setIsLoading(true)
			axios.get('http://localhost:3001/firebase/contracts').then(function (response) {
				let contracts = response.data.contracts
				setDraws(contracts)
			})

			setIsLoading(false)
		}

		getDraws()
		connectWalletOnPageLoad()
	}, [])

	

	function personal_page() {
		window.location.href="http://localhost:3000/PersonalPage";
	};

	function release_draw() {
		window.location.href="http://localhost:3000/ReleaseDraw";
	};

	if (isLoading) {
    return (
      <Loading />
    )
  }


	return(
		<div>
			<div id="banner">
				<div id="title_wrap"><div id="title">Lucky Gift</div></div>
				<div className="index" id="index1" onClick={release_draw}>發佈活動</div>
				<div className="index" id="index2" onClick={personal_page}>個人資料</div>
				<div><ConnectButton /></div>
			</div>
			<div>
				{
					draws?.map((data) => {
						return(
							<Small contract={data} />
						)
					})
				}
			</div>
		</div>
	  );
};

export default Main;

