
import { utils } from './utils/index.js';
import { components } from './components/index.js';

export function createApp() {
  const appElement = document.getElementById('app') || document.body;
  const app = document.createElement('div');
  app.innerHTML = components.header() + components.main();
  appElement.appendChild(app);
  utils.log('App created');
}
      