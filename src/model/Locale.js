import {post} from "./Model";

let strings = {};

export function loadLocale(locale) {
  post('/api/locale?locale=' + locale, (json) => strings = json);
}

export {strings}