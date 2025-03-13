import {
  AdaptableOptions,
  AdaptableStateFunctionConfig,
  AgGridConfig,
} from '@adaptabletools/adaptable/types';
import Adaptable from '@adaptabletools/adaptable/agGrid';
import { GridOptions } from '@ag-grid-community/core';

import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import '@adaptabletools/adaptable/base.css';
import '@adaptabletools/adaptable/themes/light.css';
import '@adaptabletools/adaptable/themes/dark.css';

import { columnDefs, defaultColDef } from './columnDefs';
import { rowData } from './rowData';
import { agGridModules } from './agGridModules';

// Build the AdaptableOptions object and set primaryKey and adaptableId
// In this example we are NOT creating any predefined config, other than Layout, nor providing any Adaptable Options classes (e.g. filters, entitlements)
// However in the real world you will set up AdapTable Options to fit your requirements and configure your permissions and remote State
// You will also provide Predefined Config so that AdapTable ships for first time use with your required objects
const adaptableOptions: AdaptableOptions = {
  primaryKey: 'id',
  userName: 'support user',
  adaptableId: 'AdapTable Vanilla Support Template',
  // @ts-ignore
  licenseKey: process.env.ADAPTABLE_LICENSE_KEY,
  // Typically you will store State remotely; here we simply leverage local storage for convenience
  stateOptions: {
    persistState: (state, adaptableStateFunctionConfig) => {
      localStorage.setItem(adaptableStateFunctionConfig.adaptableStateKey, JSON.stringify(state));
      return Promise.resolve(true);
    },
    loadState: (config: AdaptableStateFunctionConfig) => {
      return new Promise((resolve) => {
        let state = {};
        try {
          state = JSON.parse(localStorage.getItem(config.adaptableStateKey) as string) || {};
        } catch (err) {
          console.log('Error loading state', err);
        }
        resolve(state);
      });
    },
  },
  predefinedConfig: {
    Layout: {
      CurrentLayout: 'Pivot',
      Layouts: [
        {
          Name: 'Basic',
          Columns: [
            'name',
            'language',
            'github_stars',
            'license',
            'week_issue_change',
            'created_at',
            'has_wiki',
            'updated_at',
            'pushed_at',
            'github_watchers',
            'description',
            'open_issues_count',
            'closed_issues_count',
            'open_pr_count',
            'closed_pr_count',
          ],
        },
        {
          Name: 'Pivot',
          Columns: [],
          PivotColumns: ['language'],
          RowGroupedColumns: ['license', 'has_wiki'],
          EnablePivot: true,
          AggregationColumns: {
            github_stars: 'sum',
            open_issues_count: 'sum',
            closed_issues_count: 'sum',
            open_pr_count: 'sum',
            closed_pr_count: 'sum',
          },
        },
      ],
    },
  },
};

// Create an AG Grid GridOptions object with the Column Definitions and Row Data created above
const gridOptions: GridOptions = {
  defaultColDef,
  columnDefs,
  rowData,
};

// Create an AG Grid Config object which contains AG Grid Grid Options and Modules
const agGridConfig: AgGridConfig = {
  modules: agGridModules,
  gridOptions: gridOptions,
};

// Asynchronously instantiate AdapTable with Adaptable Options and AG Grid Config
Adaptable.init(adaptableOptions, agGridConfig).then((api) => {
  console.log('AdapTable ready!');
});
