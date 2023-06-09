import "./ReleaseDraw.css"
import React, { useState , useEffect } from 'react';
import { InjectedConnector } from 'wagmi/connectors/injected'
import ConnectButton from "./component/connect";
import { useConnect, useAccount  } from 'wagmi'
import Loading from "./component/loading"
import Swal from 'sweetalert2'
import JSZip from 'jszip'
import axios from "axios";
 
function ReleaseDraw() {
	const { address, isConnected } = useAccount()
	const [ drawTitle, setDrawTitle ] = useState()
	const [ drawIntro, setDrawIntro ] = useState()
	const [ drawImageUrl, setDrawImageUrl ] = useState()
	const [ drawTags, setDrawTags ] = useState(['','','','',''])
	const [ NFTName, setNFTName ] = useState()
	const [ NFTAbbrev, setNFTAbbrev ] = useState()
	const [ NFTNum, setNFTNum ] = useState(0)
	const [ metadataZip, setMetadataZip ] = useState()
	const [ isLoading, setIsLoading] = useState(false)

	let status=1;
	let [buttonColors, setButtonColors] = useState({
	  	btn1: "#02DF82",
	  	btn2: "#9D9D9D"
	});
	let [Page, setPage] = useState({
	  	page1: "flex",
	  	page2: "none"
	});

	function handleTagsChange(index, v) {
    const nextTags = drawTags.map((c, i) => {
      if (i === index) {
        return v
      } else {
        return c;
      }
    });
    setDrawTags(nextTags);
  }

	function main() {
		window.location.href="http://localhost:3000/";
	};

	function personal_page() {
		window.location.href="http://localhost:3000/PersonalPage";
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
		      	btn1: "#02DF82",
	  			btn2: "#9D9D9D"
		    });

		    setPage({
		      page1: "flex",
	  			page2: "none"
		    });
		}
		else if (status===2)
		{
			setButtonColors({
		      btn1: "#9D9D9D",
	  			btn2: "#02DF82"
		    });

		    setPage({
		      page1: "none",
	  			page2: "flex"
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

	const handleSubmit = async() => {
		setIsLoading(true)

		const zip = new JSZip();
    const extractedFiles = await zip.loadAsync(metadataZip)
		
		let promises = []

    extractedFiles.forEach(async (relativePath, file) => {
      const content = await file.async("string");
			const metadataJson = JSON.parse(content)
			
			promises.push(axios.post('http://localhost:3001/pinata/upload_json', {
				jsonfile: metadataJson
			}))
			
			if(promises.length===Number(NFTNum)){
					Promise.all(promises).then(function(res) {
						let urls = []
						for(let i=0; i<res.length; i++) {
							urls.push(res[i].data.IpfsHash)
						}
						console.log(urls)
						axios.post('http://localhost:3001/nft/deploy', {
							name: NFTName,
							abbreviation: NFTAbbrev,
							title: drawTitle,
							description: drawIntro,
							imageUrl: drawImageUrl,
							metadataUrls: urls,
							holder: address,
							tags: drawTags
						})
						.then(function (response) {
							Swal.fire({
								icon: 'success',
								title: '創建成功',
								text: `您的 NFT 合約地址是 ${response.data.address}`,
							}).then(()=>{
								setIsLoading(false)
							})
						})
						.catch(function (error) {
							console.log(error);
							Swal.fire({
								icon: 'error',
								title: '出現錯誤',
								text: `請待會再試`
							})
						});
					});
			}
    })
	}

	return(
		<div>
			<div id="banner">
				<div id="title_wrap"><div id="title">Lucky Gift</div></div>
				<div className="index" id="index1" onClick={main}>首頁</div>
				<div className="index" id="index2" onClick={personal_page}>個人資料</div>
				<ConnectButton />
			</div>
			{
				isLoading
				? ( <Loading />)
				: (
			<div id="draw_body" src="./icon/left-arrow.png">
				<img id="left_arrow" width="40px" height="100px" onClick={btn1}  alt="right" src={require("./icon/left-arrow.png")}/>
				<div id="draw_frame">
					<div id="draw_frame_title">創建您的抽獎活動</div>
					<div id="progress_bar">
						<div id="progress_bar_step1" style={{backgroundColor: buttonColors.btn1}}><div id="progress_bar_step_circle1" style={{backgroundColor: buttonColors.btn1}}>1</div></div>
						<div id="progress_bar_step2" style={{backgroundColor: buttonColors.btn2}}><div id="progress_bar_step_circle2" style={{backgroundColor: buttonColors.btn2}}>2</div></div>
					</div>
					<div id="form_wrap_page1"  style={{ display: Page.page1}}>
						<div id="form_wrap_level1">
							<div id="form_title">活動名稱</div>
							<input type="text" id="draw_name" className="form_content1"  onChange={e => setDrawTitle(e.target.value)}/>
						</div>
						<div id="form_wrap_level1">
							<div id="form_title">活動簡介</div>
							<input type="text" id="draw_intro" className="form_content2" onChange={e => setDrawIntro(e.target.value)}/>
						</div>
						<div id="form_wrap_level1">
							<div id="form_title">活動照片 URL </div>
							<input type="text" id="draw_picture" className="form_content1" onChange={e => setDrawImageUrl(e.target.value)}/>
						</div>
						<div id="form_wrap_level1">
							<div id="form_title">活動Tag</div>
							<input type="text" id="draw_intro" className="form_content3" placeholder="(必填)" onChange={e=>handleTagsChange(0, e.target.value)}/>
							<input type="text" id="draw_intro" className="form_content3" placeholder="(選填)" onChange={e=>handleTagsChange(1, e.target.value)}/>
							<input type="text" id="draw_intro" className="form_content3" placeholder="(選填)" onChange={e=>handleTagsChange(2, e.target.value)}/>
							<input type="text" id="draw_intro" className="form_content3" placeholder="(選填)" onChange={e=>handleTagsChange(3, e.target.value)}/>
							<input type="text" id="draw_intro" className="form_content3" placeholder="(選填)" onChange={e=>handleTagsChange(4, e.target.value)}/>
						</div>
					</div>
					<div id="form_wrap_page2"  style={{ display: Page.page2}}>
						<div id="form_wrap_level1">
							<div id="form_title">NFT 項目名稱</div>
							<input type="text" id="draw_name" className="form_content1" placeholder="(請輸入英文)" onChange={e => setNFTName(e.target.value)}/>
						</div>
						<div id="form_wrap_level1">
							<div id="form_title">NFT 簡稱</div>
							<input type="text" id="draw_name" className="form_content1" placeholder="(五個字母內英文大寫)" onChange={e => setNFTAbbrev(e.target.value)}/>
						</div>
						<div id="form_wrap_level1">
							<div id="form_title">發起人address</div>
							{ isConnected? address : "請點擊右上角連線錢包"}
						</div>
						<div id="form_wrap_level1">
							<div id="form_title">Meta Data(請壓縮json檔後匯入)</div>
							<div id="form_json_wrap">
								<input type="file" accept=".zip"  onChange={(e) => setMetadataZip(e.target.files[0])} /><br/>
								<input type="number" id="nft_amount" className="form_content1" placeholder="(請輸入 metadata 數量)" onChange={e => setNFTNum(e.target.value)}/>
								{/* extractZip(e.target.files[0]) */}
							</div>
						</div>
						<div id="btn_wrap">
							<button id="found" onClick={handleSubmit}>創辦抽獎</button>
						</div>
					</div>
				</div>
				<img id="right_arrow" width="40px" height="100px" onClick={btn2}  alt="left" src={require("./icon/right-arrow.png")}/>
			</div>
				)
			}
		</div>
	  );
};

export default ReleaseDraw;