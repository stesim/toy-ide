import { createDataStore } from '../pwa-base/data_store.js';

const store = createDataStore('toy-ide', {
  data: {
    scopes: {
      0: {
        name: 'module-0',
        parent: null,
      },
    },
    variables: {
      10: {
        scope: 0,
        name: 'foo',
        type: 'string',
        const: true,
        initialValue: 'Hello, world!',
      },
      11: {
        scope: 0,
        name: 'bar',
        type: 'number',
        const: false,
        initialValue: 42,
      },
    },
  },
});

export default store;
