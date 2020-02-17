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
        name: 'greeting',
        type: 'string',
        const: false,
        initialValue: 'Hello, world!',
      },
      11: {
        scope: 0,
        name: 'answer',
        type: 'integer',
        const: true,
        initialValue: 42,
      },
      12: {
        scope: 0,
        name: 'π',
        type: 'real',
        const: true,
        initialValue: 3.14,
      },
    },
  },
});

export default store;
