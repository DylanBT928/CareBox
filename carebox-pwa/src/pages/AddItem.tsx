import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./AddItem.css"; // optional styling

type ItemForm = {
  name: string;
  usagePerDay: number;
  quantityLeft: number;
  reorderLink: string;
};

export default function AddItem() {
  const [formData, setFormData] = useState<ItemForm>({
    name: "",
    usagePerDay: 1,
    quantityLeft: 0,
    reorderLink: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "usagePerDay" || name === "quantityLeft"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("You must be signed in to add an item.");
      return;
    }

    try {
      await addDoc(collection(db, "items"), {
        ...formData,
        ownerId: auth.currentUser.uid,
      });
      // alert("Item added!");
      navigate("/home");
    } catch (error: any) {
      alert("Error adding item: " + error.message);
    }
  };

  return (
    <div className="add-item-container">
      <h1>Add Item</h1>
      <form onSubmit={handleSubmit} className="add-item-form">
        <label>Name</label>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Usage per day</label>
        <input
          name="usagePerDay"
          type="number"
          min="0"
          value={formData.usagePerDay}
          onChange={handleChange}
          required
        />

        <label>Quantity left</label>
        <input
          name="quantityLeft"
          type="number"
          min="0"
          value={formData.quantityLeft}
          onChange={handleChange}
          required
        />

        <label>Reorder link</label>
        <input
          name="reorderLink"
          type="url"
          value={formData.reorderLink}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}
