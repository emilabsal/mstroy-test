<template>
  <ag-grid-vue
    class="ag-theme-alpine"
    style="width: 500px"
    :columnDefs="columnDefs"
    :rowData="rowData"
    :treeData="true"
    :getDataPath="getDataPath"
    :groupDefaultExpanded="-1"
    domLayout="autoHeight"
    :autoGroupColumnDef="autoGroupColumnDef"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import type {
  ColDef,
  Column,
  GetDataPath,
  GridReadyEvent,
  ICellRendererParams,
  ValueGetterParams,
} from "ag-grid-community";
import { TreeStore } from "@/store/TreeStore.store";
import type { TreeItem } from "@/types/TreeStore.types";
import { items } from "@/constants";

const store = new TreeStore<TreeItem>(items);
const gridApi = ref<GridReadyEvent["api"] | null>(null);

const rowData = computed(() => store.getAll());

const autoGroupColumnDef = {
  headerName: "Категория",
  field: "category",
  width: 200,
  cellRenderer: "agGroupCellRenderer",
  cellRendererParams: {
    suppressCount: true,
  },
  valueGetter: (params: ValueGetterParams) => {
    if (!params.data) return "";
    const hasChildren = store.getChildren(params.data.id).length > 0;
    return hasChildren ? "Группа" : "Элемент";
  },
  showRowGroup: true,
};

const getDataPath = (data: TreeItem): string[] => {
  const parents = store.getAllParents(data.id);
  return parents.map((p) => p.id).reverse() as string[];
};

const columnDefs: ColDef<TreeItem>[] = [
  {
    headerName: "№ п/п",
    valueGetter: "node.rowIndex + 1",
    width: 80,
    pinned: "left",
    sortable: false,
    cellStyle: { "text-align": "center" },
  },
  {
    headerName: "Наименование",
    field: "label",
    flex: 1,
    minWidth: 100,
    cellRenderer: "agGroupCellRenderer",
    cellRendererParams: {
      suppressCount: true,
      innerRenderer: (params: ICellRendererParams) => {
        return params.value;
      },
    },
  },
];

const onGridReady = (params: GridReadyEvent) => {
  gridApi.value = params.api;
  setTimeout(() => {
    params.api.expandAll();
  }, 100);
};
</script>

<style>
.ag-theme-alpine .ag-root-wrapper {
  border-bottom: none;
  border-right: none;
  border-left: none;
}

.ag-theme-alpine .ag-pinned-left-cols-container .ag-row {
  border-left: 1px solid rgba(0, 0, 0, 0.25);
  border-right: none;
}

.ag-theme-alpine .ag-column-last.ag-cell-value {
  border-right: 1px solid rgba(0, 0, 0, 0.25);
}

.ag-theme-alpine .ag-header-cell {
  border-right: 1px solid rgba(0, 0, 0, 0.25);
}

.ag-theme-alpine .ag-header-cell:first-child {
  border-left: 1px solid rgba(0, 0, 0, 0.25);
}

.ag-theme-alpine .ag-pinned-left-header {
  border-right: none;
}

.ag-theme-alpine .ag-column-first {
  border-right: none;
}
</style>
