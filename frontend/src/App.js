import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Main from "./main";
import DrawDetail from "./DrawDetail";
import PersonalPage from "./PersonalPage";
import ReleaseDraw from "./ReleaseDraw";
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
)

export const connectors = [
  new CoinbaseWalletConnector({
    chains,
    options: {
      appName: "wagmi demo",
    },
  }),
  new MetaMaskConnector({
    chains,
  }),
];
 
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})


function App() {
  return (
    <WagmiConfig config={config} >
    <Router>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/DrawDetail/:contract" component={DrawDetail} /> 
        <Route exact path="/PersonalPage" component={PersonalPage} />
        <Route exact path="/ReleaseDraw" component={ReleaseDraw} />
      </Switch>
    </Router>
    </WagmiConfig>
  );
}

export default App;
