export function updateArrayItemById<T, A>(
  arr: Array<A>,
  id: string,
  newItem: T,
  idKey?: string
) {
  return arr.map(item => {
    if (idMatches(item, id, idKey)) return newItem;
    return item;
  });
}

function idMatches<IdKey extends string>(item: unknown, id: string, idKey?: IdKey): boolean {
  isRecord(item);
  if (idKey) {
    return id === item[idKey];
  } else {
    return id === item["id"];
  }
}

function isRecord(item: unknown): asserts item is Record<string, unknown> {
  if (item == null) throw new TypeError("Expecting object, received " + typeof item);
  if (typeof item !== "object")
    throw new TypeError("Expecting object, received " + typeof item);
  if (Array.isArray(item)) throw new TypeError("Expecting object, received array");
}
