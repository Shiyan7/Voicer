import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';

import { notesEmptyStyles } from './NotesEmpty.styles';

const styles = notesEmptyStyles();

export function NotesEmpty() {
  return (
    <section class={styles.root()}>
      <div class={styles.glow()} />
      <div class={styles.stack()}>
        <div class={styles.sheet({ layer: 'back' })}>
          <span class={styles.line()} />
          <span class={styles.line()} />
        </div>
        <div class={styles.sheet({ layer: 'middle' })}>
          <span class={styles.line()} />
          <span class={styles.line()} />
        </div>
        <div class={styles.sheet({ layer: 'front' })}>
          <span class={styles.accentLine()} />
          <span class={styles.check()}>
            <span class={styles.checkBox()} />
            <span class={styles.line({ width: 'long' })} />
          </span>
          <span class={styles.check()}>
            <span class={styles.checkBox()} />
            <span class={styles.line({ width: 'medium' })} />
          </span>
          <span class={styles.line({ width: 'full' })} />
        </div>
        <span class={styles.badge()}>
          <Icon size={22} name="common:sparkles" />
        </span>
      </div>
      <h2 class={styles.title()}>{i18n.t('meetings.notes_empty.title')}</h2>
      <p class={styles.description()}>
        {i18n.t('meetings.notes_empty.description')}
      </p>
      <span class={styles.hint()}>
        <Icon size={14} name="common:sparkles" />
        {i18n.t('meetings.notes_empty.hint')}
      </span>
    </section>
  );
}
