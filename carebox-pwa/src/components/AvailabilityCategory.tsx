import ItemCard from "./ItemCard";
import type { Item } from "./ItemCard";
import "./AvailabilityCategory.css";

interface Props {
  items: Item[];
  categoryTitle: string;
  categoryColor: string;
}

export default function AvailabilityCategory({
  items,
  categoryTitle,
  categoryColor,
}: Props) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="category-section">
      <h2 className="section-title">{categoryTitle}</h2>
      <div className="items-divider"></div>
      <div className="items-list">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} categoryColor={categoryColor} />
        ))}
      </div>
    </section>
  );
}
