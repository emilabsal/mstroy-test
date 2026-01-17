import type { TreeItem } from "@/types/TreeStore.types";

export class TreeStore<T extends TreeItem> {
  private items: T[] = [];
  private byId = new Map<T["id"], T>();
  private children = new Map<T["id"] | null, T[]>();

  constructor(items: T[]) {
    this.items = [...items];
    this.rebuild();
  }

  private rebuild() {
    this.byId.clear();
    this.children.clear();

    for (const item of this.items) {
      this.byId.set(item.id, item);
      if (!this.children.has(item.parent)) {
        this.children.set(item.parent, []);
      }
      this.children.get(item.parent)!.push(item);
    }
  }

  getAll(): T[] {
    return this.items;
  }

  getItem(id: T["id"]): T | undefined {
    return this.byId.get(id);
  }

  getChildren(id: T["id"]): T[] {
    return this.children.get(id) ?? [];
  }

  getAllChildren(id: T["id"]): T[] {
    const result: T[] = [];
    const stack = [...this.getChildren(id)];

    while (stack.length) {
      const current = stack.pop()!;
      result.push(current);
      const kids = this.getChildren(current.id);
      if (kids.length) stack.push(...kids);
    }

    return result;
  }

  getAllParents(id: T["id"]): T[] {
    const result: T[] = [];
    let current = this.getItem(id);

    while (current) {
      result.push(current);
      if (current.parent == null) break;
      current = this.getItem(current.parent);
    }

    return result;
  }

  addItem(item: T): void {
    this.items.push(item);
    this.byId.set(item.id, item);

    if (!this.children.has(item.parent)) {
      this.children.set(item.parent, []);
    }
    this.children.get(item.parent)!.push(item);
  }

  updateItem(item: T): void {
    const old = this.byId.get(item.id);
    if (!old) return;

    if (old.parent !== item.parent) {
      const oldChildren = this.children.get(old.parent);
      if (oldChildren) {
        this.children.set(
          old.parent,
          oldChildren.filter((i) => i.id !== item.id)
        );
      }

      if (!this.children.has(item.parent)) {
        this.children.set(item.parent, []);
      }
      this.children.get(item.parent)!.push(item);
    }

    Object.assign(old, item);
  }

  removeItem(id: T["id"]): void {
    const toRemove = [id, ...this.getAllChildren(id).map((i) => i.id)];

    this.items = this.items.filter((i) => !toRemove.includes(i.id));

    for (const rid of toRemove) {
      const item = this.byId.get(rid);
      if (!item) continue;

      const siblings = this.children.get(item.parent);
      if (siblings) {
        this.children.set(
          item.parent,
          siblings.filter((i) => i.id !== rid)
        );
      }

      this.byId.delete(rid);
      this.children.delete(rid);
    }
  }
}
