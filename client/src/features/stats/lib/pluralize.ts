import { i18n } from '@/shared/i18n';

type PluralSubject = 'stats.calls' | 'stats.days';
type PluralForm = 'one' | 'few' | 'many' | 'other';

const PLURAL_FORMS = new Set<string>(['one', 'few', 'many', 'other']);

const toPluralForm = (rule: string): PluralForm =>
  PLURAL_FORMS.has(rule) ? (rule as PluralForm) : 'other';

export const pluralize = (subject: PluralSubject, count: number) => {
  const form = toPluralForm(new Intl.PluralRules(i18n.locale()).select(count));
  return i18n.t(`${subject}_${form}`, { count: String(count) });
};
