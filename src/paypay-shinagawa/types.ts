export type PayPayStore = {
  id: string;
  title: string;
  iconUrl: string;
  category: {
    name: string;
  } | null;
  subCategoryLabel: string | null;
};

export type PayPayStoreResponse = {
  stores: PayPayStore[];
};
