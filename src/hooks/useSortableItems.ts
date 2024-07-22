//

import { useEffect, useState } from "react";

function useSortableItems<T extends object, K extends keyof T>(itemObjects: T[], key: K) {
  const initialItems = itemObjects.map(obj => obj[key]);
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    const items = itemObjects.map(obj => obj[key]);
    setItems(items);
  }, [itemObjects, key]);

  return [items, setItems] as const;
}

export default useSortableItems;
