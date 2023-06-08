import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TICKET_ABI from "./contract/ticketABI.json";
import ERC20_ABI from "./contract/buy_ticketABI.json";

const BuyTicket = () => {
  const [ticketPrice, setTicketPrice] = useState("0");
  const [numTickets, setNumTickets] = useState(1);
  const [loading, setLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState("");
  const [userTicketCount, setUserTicketCount] = useState(0);
  const [soldTickets, setSoldTickets] = useState(0);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        const ticketContractAddress =
          "0x11f1ab000ec30341f59875539ee4f1366db2a677";
        const ticketContract = new web3.eth.Contract(
          TICKET_ABI,
          ticketContractAddress
        );

        const ticketPrice = await ticketContract.methods.ticketPrice().call();
        const formattedTicketPrice = web3.utils.fromWei(ticketPrice, "ether");
        setTicketPrice(formattedTicketPrice);

        const accounts = await web3.eth.getAccounts();
        const buyerAddress = accounts[0];

        const userTickets = await ticketContract.methods
          .ticketBalances(buyerAddress)
          .call();
        setUserTicketCount(userTickets);

        const soldTickets = await ticketContract.methods
          .ticketsSold()
          .call();
        setSoldTickets(soldTickets);
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
    };

    fetchTicketData();
  }, []);

  const handleBuyTicket = async () => {
    try {
      setLoading(true);
      setTransactionStatus("Initiating transaction...");

      const web3 = new Web3(window.ethereum);
      const ticketContractAddress =
        "0x11f1ab000ec30341f59875539ee4f1366db2a677";
      const tokenContractAddress = "0x03ed60188aaa5991a41360d8e1e6d546d2401b8c";

      const ticketContract = new web3.eth.Contract(
        TICKET_ABI,
        ticketContractAddress
      );
      const tokenContract = new web3.eth.Contract(
        ERC20_ABI,
        tokenContractAddress
      );

      const ticketPrice = await ticketContract.methods.ticketPrice().call();
      const formattedTicketPrice = web3.utils.fromWei(ticketPrice, "ether");
      setTicketPrice(formattedTicketPrice);

      const accounts = await web3.eth.getAccounts();
      const buyerAddress = accounts[0];

      const transaction = await ticketContract.methods
        .buyTickets(numTickets)
        .send({ from: buyerAddress });

      if (transaction.status) {
        setTransactionStatus(
          `Transaction successful. Transaction hash: ${transaction.transactionHash}`
        );

        const userTickets = await ticketContract.methods
          .ticketBalances(buyerAddress)
          .call();
          console.warn(userTickets , typeof(userTickets))
        setUserTicketCount(userTickets);

        const soldTickets = await ticketContract.methods
          .ticketsSold()
          .call();
          console.warn(soldTickets , typeof(soldTickets))
        setSoldTickets(soldTickets);
      } else {
        setTransactionStatus("Transaction failed.");
      }
    } catch (error) {
      console.error("Error buying tickets:", error);
      setTransactionStatus(`Transaction failed. Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleNumTicketsChange = (event) => {
    setNumTickets(parseInt(event.target.value, 10));
  };

  return (
    <div className="container">
      <h2>Buy Ticket</h2>
      <div className="mb-3">
        <label htmlFor="numTickets" className="form-label">
          Number of Tickets:
        </label>
        <input
          type="number"
          className="form-control"
          id="numTickets"
          value={numTickets}
          onChange={handleNumTicketsChange}
          min="1"
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={handleBuyTicket}
        disabled={loading}
      >
        Buy Tickets
      </button>
      <h5>Ticket Price: {ticketPrice} EH</h5>
      <p>{transactionStatus}</p>
      <p style={{ color: "black" }}>
        User Tickets: {userTicketCount.toString()}
      </p>
      <p style={{ color: "black" }}>Sold Tickets: {soldTickets.toString()}</p>
    </div>
  );
};

export default BuyTicket;
