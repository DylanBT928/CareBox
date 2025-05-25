import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import ItemCard from "../components/ItemCard";
import BunnyLogo from "../assets/bunny_orange.png"; // Add these bunny images to your assets folder
import BunnyYellow from "../assets/bunny_yellow.png";
import BunnyHead from "../assets/bunny_head.png";
import "./Home.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchItems(currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchItems = async (userId) => {
    setLoading(true);
    try {
      const q = query(collection(db, "items"), where("userId", "==", userId));

      const querySnapshot = await getDocs(q);
      const itemData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Calculate days left
      itemData.forEach((item) => {
        if (item.quantity && item.usagePerDay) {
          item.daysLeft = Math.floor(item.quantity / item.usagePerDay);
        } else {
          item.daysLeft = 0;
        }
      });

      // Sort by days left, ascending
      itemData.sort((a, b) => a.daysLeft - b.daysLeft);

      setItems(itemData);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
    setLoading(false);
  };

  // Group items by low stock and in stock
  const lowStockItems = items.filter((item) => item.daysLeft <= 7);
  const inStockItems = items.filter((item) => item.daysLeft > 7);

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="welcome-text">
          Welcome, {user?.displayName || "test"}!
        </h1>
        <img src={BunnyHead} alt="Bunny" className="bunny-icon" />
      </div>

      {loading ? (
        <div className="loading">Loading your items...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <img src={BunnyLogo} alt="Bunny" className="bunny-mascot" />
          <p>You don't have any items yet.</p>
          <Link to="/add" className="add-btn">
            Add Your First Item
          </Link>
        </div>
      ) : (
        <>
          {lowStockItems.length > 0 && (
            <section className="items-section">
              <h2 className="section-title">Low stock</h2>
              <div className="items-divider"></div>
              <div className="items-list">
                {lowStockItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    quantity={item.quantity}
                    usagePerDay={item.usagePerDay}
                    daysLeft={item.daysLeft}
                    reorderLink={item.reorderUrl}
                    category={item.category}
                  />
                ))}
              </div>
            </section>
          )}

          {inStockItems.length > 0 && (
            <section className="items-section">
              <h2 className="section-title">In stock</h2>
              <div className="items-divider"></div>
              <div className="items-list">
                {inStockItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    quantity={item.quantity}
                    usagePerDay={item.usagePerDay}
                    daysLeft={item.daysLeft}
                    reorderLink={item.reorderUrl}
                    category={item.category}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
