export interface TreeItem {
  id: string | number;
  parent: string | number | null;
  [key: string]: unknown;
}
