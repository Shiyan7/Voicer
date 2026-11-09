import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';
import { Input } from '@/shared/ui/input';

import { useTranscriptSearchPanel } from '../model/useTranscriptSearchPanel';
import { TranscriptSearchPanelDeps } from '../types/TranscriptSearchPanelDeps';
import { transcriptSearchPanelStyles } from './TranscriptSearchPanel.styles';

const styles = transcriptSearchPanelStyles();

export function TranscriptSearchPanel(deps: TranscriptSearchPanelDeps) {
  const vm = useTranscriptSearchPanel(deps);

  return (
    <div class={styles.anchor()}>
      <div class={styles.panel()}>
        <div class={styles.header()}>
          <span class={styles.title()}>{i18n.t('meetings.find.title')}</span>
          <button
            class={styles.close()}
            type="button"
            title={i18n.t('meetings.find.close')}
            onClick={deps.search.close}
          >
            <Icon size={16} name="common:cross" />
          </button>
        </div>
        <div class={styles.fields()}>
          <div class={styles.field()}>
            <Input
              class={styles.input({ class: styles.queryInput() })}
              ref={vm.setQueryInputRef}
              value={deps.search.query()}
              placeholder={i18n.t('meetings.find.find')}
              onInput={vm.onQueryInput}
              onKeyDown={vm.onQueryKeyDown}
            />
            <Icon class={styles.fieldIcon()} size={16} name="common:search" />
            <Show when={vm.hasQuery()}>
              <div class={styles.suffix()}>
                <span class={styles.results()}>{vm.resultsLabel()}</span>
                <button
                  class={styles.navButton()}
                  type="button"
                  title={i18n.t('meetings.find.prev')}
                  disabled={!vm.hasMatches()}
                  onClick={deps.search.prevMatch}
                >
                  <Icon
                    class={styles.chevronUp()}
                    size={12}
                    name="common:chevron-left"
                  />
                </button>
                <button
                  class={styles.navButton()}
                  type="button"
                  title={i18n.t('meetings.find.next')}
                  disabled={!vm.hasMatches()}
                  onClick={deps.search.nextMatch}
                >
                  <Icon
                    class={styles.chevronDown()}
                    size={12}
                    name="common:chevron-left"
                  />
                </button>
              </div>
            </Show>
          </div>
          <div class={styles.field()}>
            <Input
              class={styles.input()}
              value={vm.replacement()}
              placeholder={i18n.t('meetings.find.replace_with')}
              onInput={vm.onReplacementInput}
              onKeyDown={vm.onReplacementKeyDown}
            />
            <Icon
              class={styles.fieldIcon({ class: styles.arrowRight() })}
              size={16}
              name="common:arrow-up"
            />
          </div>
        </div>
        <div class={styles.options()}>
          <label class={styles.option()}>
            <input
              class={styles.checkbox()}
              type="checkbox"
              checked={deps.search.matchCase()}
              onChange={deps.search.toggleMatchCase}
            />
            {i18n.t('meetings.find.match_case')}
          </label>
          <label class={styles.option()}>
            <input
              class={styles.checkbox()}
              type="checkbox"
              checked={deps.search.wholeWord()}
              onChange={deps.search.toggleWholeWord}
            />
            {i18n.t('meetings.find.whole_word')}
          </label>
        </div>
        <div class={styles.actions()}>
          <button
            class={styles.action()}
            type="button"
            disabled={!vm.canReplace()}
            onClick={vm.replaceCurrent}
          >
            {i18n.t('meetings.find.replace')}
          </button>
          <button
            class={styles.action()}
            type="button"
            disabled={!vm.canReplace()}
            onClick={vm.replaceAll}
          >
            {i18n.t('meetings.find.replace_all')}
          </button>
        </div>
      </div>
    </div>
  );
}
