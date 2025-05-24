import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.ts";
import "./Home.css";

type Item = {
  id: string;
  name: string;
  usagePerDay: number;
  quantityLeft: number;
  reorderLink: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    async function fetchItems() {
      const querySnapshot = await getDocs(collection(db, "items"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Item[];
      setItems(data);
    }

    fetchItems();
  }, []);

  const calcDaysLeft = (item: Item) =>
    item.usagePerDay > 0
      ? Math.floor(item.quantityLeft / item.usagePerDay)
      : "∞";

  return (
    <div className="home">
      <h1>Welcome, VenusHacks!</h1>
      {items.map((item) => (
        <div className="card" key={item.id}>
          <div className="card-header">
            <div>
              <div className="name">{item.name}</div>
              <div className="subtext">{item.usagePerDay}/day</div>
              <div className="subtext">{item.quantityLeft} left</div>
            </div>
            <div className="badge">
              {calcDaysLeft(item)} {calcDaysLeft(item) === 1 ? "day" : "days"}{" "}
              left
            </div>
          </div>
          <div className="card-actions">
            <a
              href={item.reorderLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Reorder Now
            </a>
            <a href={`/item/${item.id}`} className="btn">
              View
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
