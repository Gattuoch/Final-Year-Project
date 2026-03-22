import Ticket from "../models/Ticket.js";

/*
Create Ticket
*/
export const createTicket = async (req, res) => {
  try {
    const {
      ticketType,
      category,
      visitDate,
      visitTime,
      quantity,
      subtotal,
      serviceFee,
      total,
      specialRequest,
    } = req.body;

    const ticket = await Ticket.create({
      ticketType,
      category,
      visitDate,
      visitTime,
      quantity,
      subtotal,
      serviceFee,
      total,
      specialRequest,
    });

    res.status(201).json({
      success: true,
      message: "Ticket booked successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
Get All Tickets
*/

export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
Get Single Ticket
*/

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};