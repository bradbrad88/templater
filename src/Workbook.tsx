import { WorkBook as WorkbookType } from "xlsx";

type Props = {
  workbook: WorkbookType;
};

type CardType = {
  title: string;
  description: string;
  tags: string[];
};

function Workbook({ workbook }: Props) {
  const cards = useTransformWorkbookToCards(workbook);
  return (
    <div className="flex flex-wrap gap-[0.2mm]">
      {cards.map((card, idx) => (
        <Card key={`${card.title}-${idx}`} card={card} />
      ))}
    </div>
  );
}

function Card({ card }: { card: CardType }) {
  return (
    <div className="w-[91mm] h-[55mm] border-[2px] border-black p-4 py-3">
      <h2 className="font-bold text-3xl">{card.title}</h2>
      {card.tags
        .filter(tag => tag)
        .map(tag => (
          <li key={tag} className="text-2xl">
            {tag}
          </li>
        ))}
    </div>
  );
}

export default Workbook;

function useTransformWorkbookToCards(workbook: WorkbookType) {
  const cardSheet = (workbook.Sheets[workbook.SheetNames[0]] || []) as { h: string }[][];
  const tagSheet = (workbook.Sheets[workbook.SheetNames[1]] || []) as { h: string }[][];
  const tagsMap = tagSheet
    .filter((_, idx) => idx !== 0)
    .reduce((map, tagRow) => {
      const key = tagRow[0]?.h;
      const value = tagRow[1]?.h;
      if (!key || !value) return map;
      map.set(key, value);
      return map;
    }, new Map<string, string>());
  const cards: CardType[] = cardSheet
    .filter((_, idx) => idx !== 0)
    .map(row => {
      return {
        title: row[0]?.h,
        description: row[1]?.h || "",
        tags: row.slice(2, 5).map(val => (val ? tagsMap.get(val.h) || val.h : "")),
      };
    });
  return cards;
}
