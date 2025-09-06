import Event from "../model/event.js";
import Registration from "../model/registration.js";
// import User from "../models/User.js"; // If needed for validation


export const ongoingEvents = async (req, res) => {
  try {
    const currentDate = new Date();
    const events = await Event.find({
      startDate: { $lte: currentDate }, // Registration has started
      endDate: { $gte: currentDate }, // Registration is still open
    }).populate('guide', 'name');

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
}

export const allEvents = async (req, res) => {
  try {
    const events = await Event.find({
    }).populate('guide', 'name');

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
}

export const registerEvent = async (req, res) => {
  try {
    const { eventId, formData, participants, teamName } = req.body;

    if (!eventId || !Array.isArray(participants)) {
      return res.status(400).json({ error: "Invalid event ID or participants." });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    const type = event.type;

    if (type === "solo" && participants.length > 1) {
      return res.status(400).json({ error: "Solo events cannot have multiple participants." });
    }

    if (type === "group" && (!teamName || teamName.trim() === "")) {
      return res.status(400).json({ error: "Team name is required for group events." });
    }

    // Validate participants (ensure rollNumber & mobileNumber are included)
    const validParticipants = participants.filter(
      (p) => p.name?.trim() && p.year?.trim() && p.branch?.trim() && p.division?.trim() && p.rollNumber?.trim() && p.mobileNumber?.trim()
    );

    if (type === "group" && validParticipants.length === 0) {
      return res.status(400).json({ error: "At least one valid participant is required." });
    }

    const isCricketSolo = type === "solo" && event.name?.toLowerCase() === "cricket";

    const registrationData = {
      event: eventId,
      type,
      formData: {
        ...formData,
        ...(isCricketSolo && formData.specialization
          ? { specialization: formData.specialization }
          : {}),
      },
      teamName: type === "group" ? teamName : undefined,
      participants: validParticipants,
    };


    const newRegistration = new Registration(registrationData);
    await newRegistration.save();

    return res.status(201).json({
      message: "Registration successful!",
      registration: newRegistration,
    });

  } catch (error) {
    console.error("Error in registerEvent:", error);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
};
