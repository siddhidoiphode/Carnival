import Event from "../model/event.js"
import nodemailer from "nodemailer";
import User from "../model/user.js"
import Registration from "../model/registration.js"; 

export const createEventController = async (req, res) => {
    const { name, type, category, guide, startDate, endDate, registrationFields, groupLimit } = req.body;

    try {
        // Fetch the guide's email using the guide ID
        const guideData = await User.findById(guide);
        if (!guideData) {
            return res.status(404).json({ message: "Guide not found!" });
        }

        const newEvent = new Event({
            name,
            type,
            category,
            guide,
            startDate,
            endDate,
            registrationFields,
            groupLimit, // Store the group limit for group events
        });

        // Save event to database
        await newEvent.save();

        // Send email notification to the guide
        await sendGuideEmail(guideData.email, newEvent);

        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating event", error: error.message });
    }
};

// Function to send email
const sendGuideEmail = async (guideEmail, event) => {
    // Create a transporter (Same as your previous project)
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS  // App password (not your email password)
        }
    });

    // Email content
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: guideEmail,
        subject: "You have been assigned to a new event!",
        text: `Dear Event Coordinator,

You have been assigned as the Event Coordinator for the event: ${event.name}.

Event Details:
- Type: ${event.type}
- Category: ${event.category}
- Registration Start Date: ${new Date(event.startDate).toDateString()}
- Registration End Date: ${new Date(event.endDate).toDateString()}

Your Credentials
- Email: ${guideEmail}
- Password: Use Your email's non-domain part if you dont upadated your password before (eg: email - Sknscoe123@gmail.com password - Sknscoe123)

Please log in to your account to view more details.
http://localhost:5173/

Best Regards,
Event Management Team`
    };

    // Send email
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};


export const getAllEventsController = async (req, res) => {
    try {
        const events = await Event.find().populate("guide", "name email");
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching events", error: error.message });
    }
};


export const deleteEventController = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete registrations for this event
        await Registration.deleteMany({ event: id });

        // Delete the event itself
        await Event.findByIdAndDelete(id);

        res.status(200).json({ message: "Event and related registrations deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting event", error: error.message });
    }
};


export const updateEventController = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Get updated fields from request body

    try {
        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
            new: true, // Return the updated event
            runValidators: true, // Ensure validation rules are applied
        });

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
};

export const getEventByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id).populate("guide"); // Populate guide details

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ success: true, event });
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ success: false, message: "Error fetching event", error: error.message });
    }
};


