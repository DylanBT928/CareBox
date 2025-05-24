import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "items"),
          where("ownerId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Item, "id">),
        }));
        setItems(data);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  const calcDaysLeft = (item: Item) =>
    item.usagePerDay > 0
      ? Math.floor(item.quantityLeft / item.usagePerDay)
      : "∞";

  if (loading) {
    return (
      <div className="home">
        <h1>Loading your items...</h1>
      </div>
    );
  }

  if (!auth.currentUser) {
    return (
      <div className="home">
        <h1>Please sign in to view your CareBox</h1>
      </div>
    );
  }

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
