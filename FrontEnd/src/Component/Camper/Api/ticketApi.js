import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* Create Ticket */
export const createTicket = async (ticketData) => {
  const res = await API.post("/tickets", ticketData);
  return res.data;
};

/* Get Tickets */
export const getTickets = async () => {
  const res = await API.get("/tickets");
  return res.data;
};