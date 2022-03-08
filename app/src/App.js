import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import CandyMachine from './CandyMachine';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Constants
const TWITTER_HANDLE = 'hashequilibrium';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  const [walletAddress, setWalletAddress] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const requestAirdropSol = async() => {
    if (walletAddress) {
      const connection = new Connection(process.env.REACT_APP_SOLANA_RPC_HOST);
      const myAddress = new PublicKey(walletAddress);
      console.log("Requesting devnet airdrop")
      const signature = await connection.requestAirdrop(myAddress, LAMPORTS_PER_SOL *2 );
      await connection.confirmTransaction(signature);
      console.log("Airdrop completed")
    }
  }

  const connectWallet = async () => {
    const {solana} = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with pubkey', response.publicKey.toString())
      setWalletAddress(response.publicKey.toString())
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className = "cta-button connect-wallet-button"
      onClick = {connectWallet}
      >Connect to Wallet</button>
  );

  const renderAirdropContainer = () => (
    <button
    className = "cta-button"
    onClick = {requestAirdropSol}
    >Airdrop 2 SOL Devnet</button>
  )

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with Candy Machine 2</p>
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        {walletAddress && <CandyMachine walletAddress={window.solana}/>}
        <p></p>
        {walletAddress && renderAirdropContainer()}
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
