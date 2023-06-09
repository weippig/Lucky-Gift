import "./connect.css"
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import React from 'react'
import { useDisconnect } from 'wagmi'

export default function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })

  const { disconnect } = useDisconnect()

  async function connectWallet() {
    try {
      connect()
      localStorage.setItem('isWalletConnected', true)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnectWallet() {
    try {
      disconnect()
      localStorage.setItem('isWalletConnected', false)
    } catch (ex) {
      console.log(ex)
    }
  }

  if (isConnected) return(
    <div>
      <button  id='wallet_address' onClick={() => disconnectWallet()}>Connected to {address}</button>
    </div>
  )
  return(
    <div>
      <button id='personal_btn' onClick={() => connectWallet()}>Connect Wallet</button>
    </div>
  )
}
