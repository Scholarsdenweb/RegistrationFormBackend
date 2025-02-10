
const getForm =  async (Model, req, res) => {
  try {
    const form = await Model.find({ student_id: req.user.id }).select("-__v -student_id -created_at -updated_at -_id ");
    console.log("form", form);
    if (!form) return res.status(404).json({ message: "Form not found" });
    return res.status(200).json(form);
  } catch (error) {
    return res.status(500).json({ message: "Error getting form", error });
  }
}

const addForm = async (Model, req, res) => {
    try {
      
      let form = await Model.findOne({ student_id: req.user.id });
      if(form) return res.status(400).json({ message: "Form already exists" });
       form = new Model({ student_id: req.user.id, ...req.body });
      console.log("form", form);
      const result = await form.save();
      console.log("result", result);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error adding form", error });
    }
  };
  
  const updateForm = async (Model, req, res) => {
    try {
      const form = await Model.findOne({ student_id: req.user.id });
      console.log("form updated form", form);
      if (!form) return res.status(404).json({ message: "Form not found" });
  
      Object.assign(form, req.body); // Dynamically update fields
      const result = await form.save();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error updating form", error });
    }
  };
  
  const deleteForm = async (Model, req, res) => {
    try {
      const form = await Model.findOneAndDelete({ student_id: req.user.id });
      if (!form) return res.status(404).json({ message: "Form not found" });
  
      return res.status(200).json({ message: "Form deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting form", error });
    }
  };
  
  module.exports = { getForm, addForm, updateForm, deleteForm };
  


