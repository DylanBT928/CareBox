import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import "./Home.css";

import AvailabilityCategory from "../components/AvailabilityCategory";
import type { Item } from "../components/ItemCard";
import bunnyOrangeImg from "../assets/bunny_orange.png";

export default function Home() {
  const [noneLeft, setNoneLeft] = useState<Item[]>([]);
  const [littleLeft, setLittleLeft] = useState<Item[]>([]);
  const [manyLeft, setManyLeft] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [noItems, setNoItems] = useState(false);

  useEffect(() => {
    async function fetchItems() {
      const auth = getAuth();

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const q = query(
              collection(db, "items"),
              where("ownerId", "==", user ? user.uid : "")
            );
            const querySnapshot = await getDocs(q);

            const noneLeftItems: Item[] = [];
            const littleLeftItems: Item[] = [];
            const manyLeftItems: Item[] = [];

            querySnapshot.docs.forEach((doc) => {
              const item = {
                id: doc.id,
                ...(doc.data() as Omit<Item, "id">),
              };

              const daysLeft = calcDaysLeft(item);

              item.daysLeft = daysLeft;

              if (daysLeft == 0) {
                noneLeftItems.push(item);
              } else if (daysLeft <= 7) {
                littleLeftItems.push(item);
              } else {
                manyLeftItems.push(item);
              }
            });

            if (
              noneLeftItems.length == 0 &&
              littleLeftItems.length == 0 &&
              manyLeftItems.length == 0
            ) {
              setNoItems(true);
            }

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
        } else {
          setLoading(false);
        }
      });
    }

    fetchItems();
  }, []);

  const sortByName = (item1: Item, item2: Item) => {
    if (item1.daysLeft == item2.daysLeft) {
      return item1.name.localeCompare(item2.name);
    } else {
      return item1.daysLeft - item2.daysLeft;
    }
  };

  const getFriendlyName = () => {
    const user = auth.currentUser;
    if (!user) return "friend";

    if (user.displayName) return user.displayName;

    if (user.email) return user.email.split("@")[0];

    return "friend";
  };

  const calcDaysLeft = (item: Item) =>
    Math.floor(item.quantityLeft / item.usagePerDay);

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="welcome-text">Welcome, {getFriendlyName()}!</h1>
      </div>

      {loading ? (
        <div className="loading">Loading your items...</div>
      ) : !auth.currentUser ? (
        <div className="signin-message">Please sign in</div>
      ) : noItems ? (
        <div className="empty-state">
          <img src={bunnyOrangeImg} alt="Bunny" className="bunny-mascot" />
          <p>No medications found</p>
          <Link to="/add" className="add-btn">
            Add new medication
          </Link>
        </div>
      ) : (
        <div className="items-container">
          <AvailabilityCategory
            items={noneLeft}
            categoryTitle="Out of stock"
            categoryColor="ffb6c1"
          />
          <AvailabilityCategory
            items={littleLeft}
            categoryTitle="Low stock"
            categoryColor="fff0c1"
          />
          <AvailabilityCategory
            items={manyLeft}
            categoryTitle="In stock"
            categoryColor="c8ffc1"
          />
        </div>
      )}
    </div>
  );
}
