import '@abraham/reflection';

import { render } from 'solid-js/web';

import { Application } from './app';

render(() => <Application />, document.getElementById('root') as HTMLElement);
