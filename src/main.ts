import { createApp } from "vue";
import App from "./App.vue";

import { ModuleRegistry } from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";
import { AllCommunityModule } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule, TreeDataModule]);

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

createApp(App).mount("#app");
