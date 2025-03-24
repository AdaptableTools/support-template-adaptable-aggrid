import {
  AdaptableOptions,
  AdaptableStateFunctionConfig,
  AgGridConfig,
} from '@adaptabletools/adaptable/types';
import Adaptable from '@adaptabletools/adaptable/agGrid';
import { GridOptions } from 'ag-grid-enterprise';

import 'ag-grid-enterprise/styles/ag-grid.css';
import 'ag-grid-enterprise/styles/ag-theme-alpine.css';
import '@adaptabletools/adaptable/base.css';
import '@adaptabletools/adaptable/themes/light.css';
import '@adaptabletools/adaptable/themes/dark.css';

import { columnDefs, defaultColDef } from './columnDefs';
import { rowData } from './rowData';
import { agGridModules } from './agGridModules';

//@ts-ignore
const licenseKey = process.env.ADAPTABLE_LICENSE_KEY;

// Build the AdaptableOptions object and set primaryKey and adaptableId
// In this example we are NOT creating any Initial State, other than Layout, nor providing any Adaptable Options classes (e.g. filters, entitlements)
// However in the real world you will set up AdapTable Options to fit your requirements and configure your permissions and remote State
const adaptableOptions: AdaptableOptions = {
  primaryKey: 'id',
  licenseKey,
  userName: 'support user',
  adaptableId: 'AdapTable Vanilla Support Template',

  // Typically you will store State remotely; here we simply leverage local storage for convenience
  stateOptions: {
    persistState: (state, adaptableStateFunctionConfig) => {
      console.log('state key', adaptableStateFunctionConfig.adaptableStateKey);
      localStorage.setItem(adaptableStateFunctionConfig.adaptableStateKey, JSON.stringify(state));
      return Promise.resolve(true);
    },
    loadState: (config: AdaptableStateFunctionConfig) => {
      return new Promise((resolve) => {
        let state = {};
        try {
          console.log('load state from key', config.adaptableStateKey);
          state = JSON.parse(localStorage.getItem(config.adaptableStateKey) as string) || {};
          console.log('state', state);
        } catch (err) {
          console.log('Error loading state', err);
        }
        resolve(state);
      });
    },
  },
  initialState: {
    Dashboard: {
      Tabs: [
        {
          Name: 'Home',
          Toolbars: ['Layout'],
        },
      ],
    },
    Layout: {
      Revision: Date.now(),
      CurrentLayout: 'Basic',
      Layouts: [
        {
          Name: 'Basic',
          TableColumns: [
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
          PivotColumns: ['language'],
          PivotGroupedColumns: ['license', 'has_wiki'],
          PivotAggregationColumns: [
            {
              ColumnId: 'github_stars',
              AggFunc: 'sum',
            },
            {
              ColumnId: 'open_issues_count',
              AggFunc: 'sum',
            },
            {
              ColumnId: 'open_pr_count',
              AggFunc: 'sum',
            },
            {
              ColumnId: 'closed_pr_count',
              AggFunc: 'sum',
            },
          ],
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
  theme: 'legacy',
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
