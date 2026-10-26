import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';

import { notesLoadingStyles } from './NotesLoading.styles';

const styles = notesLoadingStyles();

export function NotesLoading() {
  return (
    <section class={styles.root()}>
      <div class={styles.head()}>
        <span class={styles.badge()}>
          <Icon size={20} name="common:sparkles" />
        </span>
        <div class={styles.titleBox()}>
          <span class={styles.title()}>
            {i18n.t('meetings.notes_loading.title')}
          </span>
          <span class={styles.description()}>
            {i18n.t('meetings.notes_loading.description')}
          </span>
        </div>
      </div>
      <div class={styles.block()}>
        <span class={styles.heading()} />
        <span class={styles.row()}>
          <span class={styles.dot()} />
          <span class={styles.line({ width: 'long' })} />
        </span>
        <span class={styles.row()}>
          <span class={styles.dot()} />
          <span class={styles.line({ width: 'medium' })} />
        </span>
      </div>
      <div class={styles.block()}>
        <span class={styles.heading()} />
        <span class={styles.row()}>
          <span class={styles.bullet()} />
          <span class={styles.line({ width: 'full' })} />
        </span>
        <span class={styles.row()}>
          <span class={styles.bullet()} />
          <span class={styles.line({ width: 'long' })} />
        </span>
        <span class={styles.row()}>
          <span class={styles.bullet()} />
          <span class={styles.line({ width: 'short' })} />
        </span>
      </div>
    </section>
  );
}
