import type Item from "../../types/Item";

import "./ItemCard.css";

interface Props {
    item: Item;
    categoryColor: string;
}

export default function ItemCard(props: Props) {       
    return (
        <div className="card">
            <div className="card-header">
                <div>
                    <div className="name">{props.item.name}</div>
                    <div className="subtext">{props.item.usagePerDay}/day</div>
                    <div className="subtext">{props.item.quantityLeft} left</div>
                </div>
                <div className="badge" style={{background: `#${props.categoryColor}`}}>
                    {props.item.daysLeft} {props.item.daysLeft === 1 ? "day" : "days"}{" "}
                    left
                </div>
            </div>
            <div className="card-actions">
                <a
                    href={props.item.reorderLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                >
                Reorder Now
                </a>
                <a href={`/item/${props.item.id}`} className="btn">
                    View
                </a>
            </div>
        </div>
    )
}