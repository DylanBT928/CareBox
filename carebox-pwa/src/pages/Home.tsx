import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./Home.css";

import type Item from "../../types/Item";
import AvailabilityCategory from "../components/AvailabilityCategory";

export default function Home() {
  const [noneLeft, setNoneLeft] = useState<Item[]>([]);
  const [littleLeft, setLittleLeft] = useState<Item[]>([]);
  const [manyLeft, setManyLeft] = useState<Item[]>([]);
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

        const noneLeftItems: Item[] = [];
        const littleLeftItems: Item[] = [];
        const manyLeftItems: Item[] = [];

        querySnapshot.docs.forEach((doc) => {
          const item = {
            id: doc.id,
            ...(doc.data() as Omit<Item, "id">),
          }

          const daysLeft = calcDaysLeft(item);

          item.daysLeft = daysLeft;

          if (daysLeft == 0) {
            noneLeftItems.push(item);
          } else if (daysLeft != '∞' && daysLeft <= 7) {
            littleLeftItems.push(item);
          } else {
            manyLeftItems.push(item);
          }
        });

        noneLeftItems.sort(sortByName);
        littleLeftItems.sort(sortByName);
        manyLeftItems.sort(sortByName);
        
        setNoneLeft(noneLeftItems);
        setLittleLeft(littleLeftItems);
        setManyLeft(manyLeftItems);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  const sortByName = (item1: Item, item2: Item) => item1.name.localeCompare(item2.name);

  const getFriendlyName = () => {
    const user = auth.currentUser;
    if (!user) return "friend";

    if (user.displayName) return user.displayName;

    if (user.email) return user.email.split("@")[0];

    return "friend";
  };

  const calcDaysLeft = (item: Item) =>
        item.usagePerDay > 0
        ? Math.floor(item.quantityLeft / item.usagePerDay)
        : "∞";

  return (
    <div className="home">
      {loading ? <h1>Loading your items...</h1> :
      !auth.currentUser ? <h1>Please sign in</h1> :
      <div className="items">
        <h1>Welcome, {getFriendlyName()}!</h1>
        <AvailabilityCategory items={noneLeft} categoryTitle="Out of stock" categoryColor="ffb6c1"/>
        <AvailabilityCategory items={littleLeft} categoryTitle="Low stock" categoryColor="fff0c1"/>
        <AvailabilityCategory items={manyLeft} categoryTitle="In stock" categoryColor="c8ffc1"/>
      </div>}
    </div>
  );
}
