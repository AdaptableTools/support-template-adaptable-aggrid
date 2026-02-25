import { useEffect } from 'react';
import {
  Adaptable,
  AdaptableOptions,
  AdaptableStateFunctionConfig,
  AgGridConfig,
} from '@adaptabletools/adaptable';
import { GridOptions, themeQuartz } from 'ag-grid-enterprise';

import '@adaptabletools/adaptable/index.css';
import '@adaptabletools/adaptable/themes/dark.css';

import { columnDefs, defaultColDef } from './columnDefs';
import { rowData } from './rowData';
import { agGridModules } from './agGridModules';

const licenseKey = process.env.REACT_APP_ADAPTABLE_LICENSE_KEY;

const adaptableOptions: AdaptableOptions = {
  primaryKey: 'id',
  licenseKey,
  userName: 'support user',
  adaptableId: 'AdapTable Vanilla Support Template',

  stateOptions: {
    persistState: (state, adaptableStateFunctionConfig) => {
      console.log('state key', adaptableStateFunctionConfig.adaptableStateKey);
      localStorage.setItem(
        adaptableStateFunctionConfig.adaptableStateKey,
        JSON.stringify(state)
      );
      return Promise.resolve(true);
    },
    loadState: (config: AdaptableStateFunctionConfig) => {
      return new Promise((resolve) => {
        let state = {};
        try {
          console.log('load state from key', config.adaptableStateKey);
          state =
            JSON.parse(
              localStorage.getItem(config.adaptableStateKey) as string
            ) || {};
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

const gridOptions: GridOptions = {
  defaultColDef,
  columnDefs,
  rowData,
  theme: themeQuartz,
};

const agGridConfig: AgGridConfig = {
  modules: agGridModules,
  gridOptions: gridOptions,
};

function App() {
  useEffect(() => {
    Adaptable.init(adaptableOptions, agGridConfig).then((api) => {
      console.log('AdapTable ready!');
    });
  }, []);

  return (
    <div className="content">
      <div id="adaptable"></div>
      <div id="grid"></div>
    </div>
  );
}

export default App;
