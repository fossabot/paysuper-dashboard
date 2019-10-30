import { set, get, forEach } from 'lodash-es';

export default function updateLangFields(target, langFields, langs) {
  langFields.forEach((keypath) => {
    const newFieldValue = {};
    forEach(langs, (lang) => {
      newFieldValue[lang] = get(target, `${keypath}.${lang}`) || '';
    });
    set(target, keypath, newFieldValue);
  });
}
