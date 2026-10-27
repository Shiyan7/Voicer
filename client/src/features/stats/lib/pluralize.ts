import { i18n } from '@/shared/i18n';
import type { DictKey } from '@/shared/i18n/types';

type PluralForms = Record<'one' | 'few' | 'many' | 'other', DictKey>;

export const pluralize = (forms: PluralForms, count: number) => {
  const rule = new Intl.PluralRules(i18n.locale()).select(count);
  const key = forms[rule as keyof PluralForms] ?? forms.other;
  return i18n.t(key, { count: String(count) });
};
