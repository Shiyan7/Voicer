import '@abraham/reflection';

import { setWasmUrl } from '@lottiefiles/dotlottie-solid';
import wasmUrl from '@lottiefiles/dotlottie-web/dotlottie-player.wasm?url';
import { render } from 'solid-js/web';

import { Application } from './app';

setWasmUrl(wasmUrl);

render(() => <Application />, document.getElementById('root') as HTMLElement);
