import "./PersonalPage.css"
import React, { useState , useEffect } from 'react';
import { InjectedConnector } from 'wagmi/connectors/injected'
import ConnectButton from "./component/connect";
import { useConnect, useAccount  } from 'wagmi'
import MyDraws from "./MyDraws";
import DrawsJoin from "./DrawsJoin";
import MyNFT from "./MyNFT";

function PersonalPage() {
	const { address, isConnected } = useAccount()

	let status=1;
	let [buttonColors, setButtonColors] = useState({
	  btn1: "#272727",
	  btn2: "#7B7B7B",
	  btn3: "#7B7B7B"
	});

	let [rightMainBlocks, setRightMainBlocks] = useState({
	  rightMainBlock1: "flex",
	  rightMainBlock2: "none",
	  rightMainBlock3: "none"
	});

	function main() {
		window.location.href="http://localhost:3000/";
	};

	function release_draw() {
		window.location.href="http://localhost:3000/ReleaseDraw";
	};

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
		connectWalletOnPageLoad()
	  judje_color_and_display();
	}, []);

	function judje_color_and_display() {
		if (status===1)
		{
			setButtonColors({
		      	btn1: "#272727",
			  	btn2: "#7B7B7B",
			  	btn3: "#7B7B7B"
		    });

		    setRightMainBlocks({
		      	rightMainBlock1: "flex",
			  	rightMainBlock2: "none",
			  	rightMainBlock3: "none"
		    });
		}
		else if (status===2)
		{
			setButtonColors({
		      	btn1: "#7B7B7B",
			  	btn2: "#272727",
			  	btn3: "#7B7B7B"
		    });

		    setRightMainBlocks({
		      	rightMainBlock1: "none",
			  	rightMainBlock2: "flex",
			  	rightMainBlock3: "none"
		    });
		}
		else if (status===3)
		{
			setButtonColors({
		      	btn1: "#7B7B7B",
			  	btn2: "#7B7B7B",
			  	btn3: "#272727"
		    });

		    setRightMainBlocks({
		      	rightMainBlock1: "none",
			  	rightMainBlock2: "none",
			  	rightMainBlock3: "flex"
		    });
		}
		else
		{
			alert("前端的索引值出錯");
		}
	}

	function btn1() {
		status=1;
	  	judje_color_and_display();
	};

	function btn2(){
		status=2;
	  	judje_color_and_display();
	};

	function btn3(){
		status=3;
	  	judje_color_and_display();
	};

	return(
		<div>
			<div id="banner">
				<div id="title_wrap"><div id="title">Lucky Gift</div></div>
				<div className="index" id="index1" onClick={main}>首頁</div>
				<div className="index" id="index2" onClick={release_draw}>發佈活動</div>
				<ConnectButton />
			</div>
			{
				!isConnected
				? (
					<div id="personal_body_wrap">
						<p id="common_title">請點擊右上角連接連錢包 (`･∀･)</p><br/>
						<img height="300px" src={require("./icon/gachapon.png")} alt='gachapon' />
					</div>
				)
				: (
					<div id="personal_body_wrap">
						<div id="personal_body">
							<div id="personal_tite">
								<div id="personal_name">{address}</div>
							</div>
							<div id="personal_main">
								<div id="left_main_wrap">
									<div id="left_tag_wrap">
										<div id="btn1" className="left_tag" onClick={btn1} style={{color: buttonColors.btn1}}>中獎物品欄</div>
										<div id="btn2" className="left_tag" onClick={btn2} style={{color: buttonColors.btn2}}>我參加的抽獎</div>
										<div id="btn3" className="left_tag" onClick={btn3} style={{color: buttonColors.btn3}}>我建立的抽獎</div>
									</div>
								</div>
								<div id="right_main_wrap">
									<div className="right_main_block" id="right_main_block1" style={{ display: rightMainBlocks.rightMainBlock1}}>
										<div id="right_main_block_title_wrap">
											<div id="right_main_block_title">中獎物品欄</div>	
										</div>
										<MyNFT  userAddress={address}/>
									</div>
									<div className="right_main_block" id="right_main_block2"  style={{ display: rightMainBlocks.rightMainBlock2}}>
										<div id="right_main_block_title_wrap">
											<div id="right_main_block_title">我參加的抽獎</div>	
										</div>
										<DrawsJoin  userAddress={address}/>
									</div>
									<div className="right_main_block" id="right_main_block3"  style={{ display: rightMainBlocks.rightMainBlock3}}>
										<div id="right_main_block_title_wrap">
											<div id="right_main_block_title">我建立的抽獎</div>	
										</div>
										<MyDraws userAddress={address} />
									</div>
								</div>
							</div>
						</div>
					</div>
				)
			}
		</div>
	  );
};

export default PersonalPage;