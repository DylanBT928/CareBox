import type Item from "../../types/Item";
import "./AvailabilityCategory.css";
import ItemCard from "./ItemCard";

interface Props {
    items: Item[];
    categoryTitle: string;
    categoryColor: string;
}

export default function AvailabilityCategory(props: Props) {
    return (
        props.items.length != 0 &&
        <div>
            <h2>{props.categoryTitle}</h2>
            {props.items.map(item => <ItemCard item={item} categoryColor={props.categoryColor} key={item.id}/>)}
        </div>
    )
}