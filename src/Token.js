import React, { useEffect, useState } from "react";
import Web3 from "web3";
import MyContractABI from "./contract/buy_ticketABI.json";
import { Spinner, Button } from "react-bootstrap";

function Token() {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(0);
  const [loading, setLoading] = useState(true);
  const [senderBalance, setSenderBalance] = useState("");
  const tokenAddress = "0x03ed60188aaa5991a41360d8e1e6d546d2401b8c";

  useEffect(() => {
    const loadTokenDetails = async () => {
      try {
        // Initialize Web3 with the provider
        const web3 = new Web3(window.ethereum);

        // Get the address of your deployed ERC20 token contract
        const tokenAddress = "0x03ed60188aaa5991a41360d8e1e6d546d2401b8c";

        // Load the ERC20 token contract
        const tokenContract = new web3.eth.Contract(
          MyContractABI,
          tokenAddress
        );

        // Call the ERC20 token contract's name() function
        const name = await tokenContract.methods.name().call();

        // Call the ERC20 token contract's symbol() function
        const symbol = await tokenContract.methods.symbol().call();

        // Call the ERC20 token contract's decimals() function
        const decimals = await tokenContract.methods.decimals().call();

        // Get the address of the connected account
        const accounts = await web3.eth.getAccounts();
        const senderAddress = accounts[0];

        // Call the ERC20 token contract's balanceOf() function to get the balance of the sender
        const balance = await tokenContract.methods
          .balanceOf(senderAddress)
          .call();

        // Convert the balance from the token's base unit to a human-readable format
        const formattedBalance = web3.utils.fromWei(balance, "ether");

        // Update the state with the token details and sender balance
        setTokenName(name);
        setTokenSymbol(symbol);
        setTokenDecimals(decimals);
        setSenderBalance(formattedBalance);
        setLoading(false);
      } catch (error) {
        console.error("Error loading token details:", error);
      }
    };

    loadTokenDetails();
  }, []);

  const approveSpender = async () => {
    try {
      // Initialize Web3 with the provider
      const web3 = new Web3(window.ethereum);

      // Get the address of your deployed ERC20 token contract
      const tokenAddress = "0x03ed60188aaa5991a41360d8e1e6d546d2401b8c";

      // Load the ERC20 token contract
      const tokenContract = new web3.eth.Contract(MyContractABI, tokenAddress);

      // Get the address of the contract you want to approve as the spender
      const spenderAddress = "0x11f1ab000ec30341f59875539ee4f1366db2a677";

      // Convert the desired amount of tokens to the token's base unit (wei)
      const amount = web3.utils.toWei("10000", "ether"); // Approve 100 tokens

      // Call the ERC20 token contract's approve() function
      await tokenContract.methods
        .approve(spenderAddress, amount)
        .send({ from: "0x467F26483CFf38235Cc6105a5dd74680dc04860b" });

      console.log("Approval successful");
    } catch (error) {
      console.error("Error approving spender:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Token Details</h2>
      <p>Token Address: {tokenAddress}</p>
      <p>Name: {tokenName}</p>
      <p>Symbol: {tokenSymbol}</p>
      <p>Decimals: {tokenDecimals}</p>
      <p>Sender Balance: {senderBalance} Tokens</p>
      <Button variant="primary" onClick={approveSpender}>
        Approve Spender
      </Button>
    </div>
  );
}

export default Token;
