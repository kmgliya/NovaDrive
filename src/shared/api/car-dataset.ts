export type CarDatasetRow = {
  make: string;
  model: string;
  year: number;
  msrp: number;
  bodyStyle: string;
};

const parseCsv = (text: string) => {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  const row: string[] = [];

  const pushCell = () => {
    row.push(current);
    current = "";
  };

  const pushRow = () => {
    rows.push([...row]);
    row.length = 0;
  };

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      pushCell();
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (current.length > 0 || row.length > 0) {
        pushCell();
        pushRow();
      }
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    pushCell();
    pushRow();
  }

  return rows;
};

export const fetchCarDataset = async (): Promise<CarDatasetRow[]> => {
  try {
    const response = await fetch("/data/car_dataset.csv");
    if (!response.ok) return [];
    const text = await response.text();
    const rows = parseCsv(text);
    if (rows.length < 2) return [];

    const header = rows[0];
    const getIndex = (name: string) => header.findIndex((col) => col.trim() === name);

    const makeIndex = getIndex("Make");
    const modelIndex = getIndex("Model");
    const yearIndex = getIndex("Year");
    const msrpIndex = getIndex("MSRP");
    const styleIndex = getIndex("Vehicle Style");

    if (makeIndex === -1 || modelIndex === -1 || yearIndex === -1 || msrpIndex === -1) return [];

    return rows.slice(1).map((row) => ({
      make: row[makeIndex] ?? "",
      model: row[modelIndex] ?? "",
      year: Number(row[yearIndex] ?? 0),
      msrp: Number(row[msrpIndex] ?? 0),
      bodyStyle: row[styleIndex] ?? "",
    }));
  } catch {
    return [];
  }
};
