import Event from "../model/event.js";
import Registration from "../model/registration.js";

export const getAssignedEvents = async (req, res) => {
    try {
        const guideId = req.user._id; // Comes from JWT (middleware)

        const events = await Event.find({ guide: guideId });

        res.status(200).send({
            success: true,
            message: "Assigned events fetched successfully",
            events,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error fetching assigned events",
            error,
        });
    }
};

export const getEventRegistrations = async (req, res) => {
    try {
        const { eventId } = req.params;

        if (!eventId) {
            return res
                .status(400)
                .json({ success: false, message: "Event ID is required" });
        }

        const registrations = await Registration.find({ event: eventId });

        res.status(200).json({ success: true, registrations });
    } catch (error) {
        console.error("Error fetching registrations:", error); // log full error
        res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};


