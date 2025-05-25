import { Link } from "react-router-dom";
import BunnyOrange from "../assets/bunny_orange.png";
import BunnyYellow from "../assets/bunny_yellow.png";
import type Item from "../../types/Item";

import "./ItemCard.css";

interface Props {
  item: Item;
  categoryColor: string;
}

export default function ItemCard(props: Props) {
  // Choose bunny based on category or days left
  const getBunnyImage = () => {
    if (props.item.category === "supplements" || props.item.daysLeft > 7) {
      return BunnyYellow;
    }
    return BunnyOrange;
  };

  return (
    <div className="card">
      <div className="bunny-container">
        <img src={getBunnyImage()} alt="" className="bunny-image" />
      </div>

      <div className="card-content">
        <h3 className="item-name">{props.item.name}</h3>
        <p className="item-usage">{props.item.usagePerDay}/day</p>
        <p className="item-quantity">{props.item.quantityLeft} left</p>

        <div className="card-actions">
          <a
            href={props.item.reorderLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            Reorder Now
          </a>
          <Link to={`/item/${props.item.id}`} className="view-button">
            View
          </Link>
        </div>
      </div>

      <div className="days-badge">
        {props.item.daysLeft == Infinity ? "∞" : props.item.daysLeft}{" "}
        {props.item.daysLeft === 1 ? "day" : "days"} left
      </div>
    </div>
  );
}
