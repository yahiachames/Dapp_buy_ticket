import React, { useState } from "react";
import Web3 from "web3";
import TICKET_ABI from "./contract/ticketABI.json"
import ERC20_ABI from "./contract/buy_ticketABI.json"

const BuyTicket = () => {
  const [ticketPrice, setTicketPrice] = useState("0");
  const [numTickets, setNumTickets] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleBuyTicket = async () => {
    try {
      // Initialize Web3 with the provider
      const web3 = new Web3(window.ethereum);

      // Get the address of your deployed ticket contract
      const ticketContractAddress =
        "0x11f1ab000ec30341f59875539ee4f1366db2a677";

      // Get the address of your deployed ERC20 token contract
      const tokenContractAddress = "0x03ed60188aaa5991a41360d8e1e6d546d2401b8c";

      // Load the ticket contract
      const ticketContract = new web3.eth.Contract(
        TICKET_ABI,
        ticketContractAddress
      );

      // Load the ERC20 token contract
      const tokenContract = new web3.eth.Contract(
        ERC20_ABI,
        tokenContractAddress
      );

      // Get the ticket price from the ticket contract
      const ticketPrice = await ticketContract.methods.ticketPrice().call();

      // Convert the ticket price from the token's base unit (wei) to a human-readable format
      const formattedTicketPrice = web3.utils.fromWei(ticketPrice, "ether");

      // Update the state with the ticket price
      setTicketPrice(formattedTicketPrice);

      // Get the address of the account connected to the wallet
      const accounts = await web3.eth.getAccounts();
      const buyerAddress = accounts[0];

      // Call the buyTickets() function of the ticket contract with the specified number of tickets
      await ticketContract.methods
        .buyTickets(numTickets)
        .send({ from: buyerAddress });

      console.log(`Successfully purchased ${numTickets} ticket(s)`);
    } catch (error) {
      console.error("Error buying tickets:", error);
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
     
    </div>
  );
};

export default BuyTicket;
