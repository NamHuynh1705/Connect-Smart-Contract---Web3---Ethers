import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';
import SmartContracts from './components/SmartContracts/smart-contracts';
import SendEthPayment from './components/SendEthPayment';
import NetworkSwitch from './components/NetworkSwitch';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null)
  const [balance, setBalance] = useState(0)
  const [signer, setSigner] = useState(null);

  // Gửi yêu cầu liên kết meta mask
  const requestAccount = async () => {
    // Check if MetaMask Extension exists
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts"
        })
        setWalletAddress(accounts[0] || null);
      } catch (error) {
        console.error("Error connecting ...");
      }
    } else {
      alert("Please install MetaMask");
    }
  }

  // Kết nối ví => lấy các thông tin ví
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await requestAccount();
        setIsConnected(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setSigner(provider.getSigner());
      } catch (error) {
        console.error({ error });
      }
    } else {
      setIsConnected(false);
    }
  }

  // Lấy số dư của tài khoản
  const checkBalance = async () => {
    if (window.ethereum) {
      try {
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [walletAddress, "latest"],
        });
        setBalance(balance || 0);
      } catch (error) {
        console.error({ error });
      }
    }
  }

  const execute = async () => {
    if (typeof window.ethereum !== "undefined") {
      const contractAddress = walletAddress;
      const abi = [
        {
          inputs: [
            {
              internalType: "string",
              name: "_name",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "_favoriteNumber",
              type: "uint256",
            },
          ],
          name: "addPerson",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          name: "nameToFavoriteNumber",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "people",
          outputs: [
            {
              internalType: "uint256",
              name: "favoriteNumber",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "retrieve",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_favoriteNumber",
              type: "uint256",
            },
          ],
          name: "store",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        await contract.store(42);
      } catch (error) {
        console.error({ error });
      }
    } else {
      alert("Please install MetaMask");
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button style={{ backgroundColor: "green" }} onClick={connectWallet}>
          Connect Wallet
        </button>
        <h3>
          Wallet Address: <i>{walletAddress}</i>
        </h3>

        {walletAddress && (
          <>
            <button style={{ backgroundColor: "blue" }} onClick={checkBalance}>
              Check Balance
            </button>
            <h3>
              Balance: <i>{balance}</i>
            </h3>
          </>
        )}

        {isConnected ? <button onClick={execute}>Execute</button> : ""}
      </header>
      <br />
      <hr></hr>
      <SmartContracts />
      <br />
      <hr></hr>
      <SendEthPayment />
      <br />
      <hr></hr>
      <NetworkSwitch />
    </div>
  );
}

export default App;
