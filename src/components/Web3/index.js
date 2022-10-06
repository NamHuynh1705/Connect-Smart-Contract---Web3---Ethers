// eslint-disable-next-line no-underscore-dangle
import { useEffect, useState } from "react";
import Web3 from "web3";
import { PROVIDERS } from "../../constants";
import { ABI } from "../../constants";

export default function ConnectWeb3() {
  const [walletAddress, setWalletAddress] = useState(null);
  const getWeb3Instance = (networkVersion) => {
    try {
      if (window.ethereum) {
        return new Web3(PROVIDERS[networkVersion]);
      }
    } catch (error) {
      return error;
    }
  };

  // Khởi tạo Web3
  const web3 = new Web3(getWeb3Instance(1));

  const getInfoAccount = async () => {
    try {
      if (window.ethereum) {
        const account = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(account?.[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWeb3 = async (walletAddress) => {
    try {
      // 1 - Thêm khoá riêng của mình để có thể gửi các giao dịch
      // web3.eth.accounts.wallet.add(walletAddress);

      // 2 - Lấy số dư hiện tại của ví
      web3.eth
        .getBalance(walletAddress)
        .then((balance) => console.log("Your Balance:", balance));

      // 3 - Tương tác với Smart Contract
      const contract = new web3.eth.Contract(ABI, walletAddress);
      // await contract.methods
      //   .read() 
      //   .call()
      //   .then((result) => console.log("contract:", result));

      // 4 - Gửi giao dịch 
      web3.eth.sendTransaction({ from: walletAddress, value: 100 });
      // or
      contract.methods
        .write()
        .sendTransaction({ from: walletAddress, value: 100 });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getInfoAccount();
  }, []);

  useEffect(() => {
    if (walletAddress) {
      connectWeb3(walletAddress);
    }
  }, [walletAddress]);

  return <div>Connect Web3</div>;
}
