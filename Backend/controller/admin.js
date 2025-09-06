import User from "../model/user.js";

export const pendingGuides =  async (req, res) => {
    try {
        const pendingGuides = await User.find({ role: "guide", status: "pending" }).select("-password");
        res.json({ success: true, pendingGuides });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const approveGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Get status from request body

        // ✅ Fetch guide from User collection
        const guide = await User.findById(id);

        if (!guide || guide.role !== "guide") {
            return res.status(404).json({ error: "Guide not found" });
        }

        // ✅ Ensure only valid statuses are allowed
        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        // ✅ If rejected, delete the guide
        if (status === "rejected") {
            await User.findByIdAndDelete(id);
            return res.json({ success: true, message: "Guide request rejected and deleted successfully" });
        }

        // ✅ If approved, update the status
        guide.status = "approved";
        await guide.save();

        res.json({ success: true, message: "Guide approved successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const listOfPendingguides = async(req,res) => {
    try{
        const approvedGuides = await User.find({role:"guide",status:"approved"})
    res.json({ success: true, approvedGuides });
    }catch(err){
        res.status(500).json({ success: false, message: "Error in Fetching Approved Guides" });
    }
}
