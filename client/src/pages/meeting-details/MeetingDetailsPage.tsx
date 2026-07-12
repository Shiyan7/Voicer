import { For, Match, Show, Switch } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { MarkdownBlock, MarkdownInline } from '@/shared/lib/markdown';
import { MODALS } from '@/shared/lib/modal';
import { AudioPlayer } from '@/shared/ui/audio-player';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { Modal } from '@/shared/ui/modal';
import { PageFade } from '@/shared/ui/page-fade';
import { StatusBadge } from '@/shared/ui/status-badge';
import { useViewModel } from '@/shared/view-model';

import { meetingDetailsStyles } from './MeetingDetailsPage.styles';
import { MeetingDetailsViewModel } from './model/MeetingDetailsViewModel';

const styles = meetingDetailsStyles();

export default function MeetingDetailsPage() {
  const vm = useViewModel(MeetingDetailsViewModel);

  return (
    <PageFade>
      <div class={styles.root()}>
        <a class={styles.backLink()} href={vm.backPath}>
          <Icon size={12} name="common:arrow-left" />
          {i18n.t('meetings.back')}
        </a>
        <Switch>
          <Match when={vm.isLoading}>
            <div class={styles.skeleton({ class: 'h-16' })} />
            <div class={styles.skeleton({ class: 'h-64' })} />
          </Match>
          <Match when={vm.loadFailed}>
            <div class={styles.notFound()}>
              <h1 class={styles.notFoundTitle()}>
                {i18n.t('meetings.not_found')}
              </h1>
              <Button as="a" href={vm.backPath} variant="secondary">
                {i18n.t('meetings.back')}
              </Button>
            </div>
          </Match>
          <Match when={vm.meeting}>
            <header class={styles.header()}>
              <div class={styles.titleRow()}>
                <Show
                  when={vm.isEditingTitle}
                  fallback={
                    <h1
                      class={styles.title()}
                      title={i18n.t('meetings.rename')}
                      onClick={vm.startTitleEdit}
                    >
                      {vm.title}
                    </h1>
                  }
                >
                  <input
                    class={styles.titleInput()}
                    ref={(el) => queueMicrotask(() => el.focus())}
                    value={vm.titleDraft}
                    onBlur={vm.commitTitle}
                    onInput={vm.onTitleInput}
                    onKeyDown={vm.onTitleKeyDown}
                  />
                </Show>
                <Button
                  class={styles.deleteBtn()}
                  variant="ghost"
                  onClick={vm.requestDelete}
                >
                  {i18n.t('meetings.delete')}
                </Button>
              </div>
              <div class={styles.metaRow()}>
                <span>{vm.metaLabel}</span>
                <StatusBadge status={vm.meeting!.status} />
              </div>
            </header>

            <Show when={vm.showPlayer}>
              <AudioPlayer
                ref={vm.setPlayerApi}
                src={vm.audioUrl}
                onTimeUpdate={vm.onPlayerTimeUpdate}
              />
            </Show>

            <Show when={vm.isProcessing}>
              <div class={styles.statePanel()}>
                <div class={styles.spinner()} />
                <StatusBadge status={vm.meeting!.status} />
                <p class={styles.stateHint()}>
                  {i18n.t('meetings.processing_hint')}
                </p>
              </div>
            </Show>

            <Show when={vm.isFailed}>
              <div class={styles.statePanel()}>
                <StatusBadge status="failed" />
                <p class={styles.stateHint()}>
                  {i18n.t('meetings.failed_hint')}
                </p>
              </div>
            </Show>

            <Show when={vm.isReady}>
              <Show when={vm.summaryBlocks.length > 0}>
                <section class={styles.card()}>
                  <h2 class={styles.sectionTitle()}>
                    {i18n.t('meetings.summary')}
                  </h2>
                  <MeetingSummary blocks={vm.summaryBlocks} />
                </section>
              </Show>

              <Show when={vm.actionItems.length > 0}>
                <section class={styles.card()}>
                  <h2 class={styles.sectionTitle()}>
                    {i18n.t('meetings.action_items')}
                  </h2>
                  <For each={vm.actionItems}>
                    {(item) => (
                      <div class={styles.actionRow()}>
                        <button
                          class={styles.checkbox({ done: item.isDone })}
                          aria-pressed={item.isDone}
                          type="button"
                          onClick={() => vm.toggleActionItem(item.id)}
                        >
                          <Show when={item.isDone}>
                            <Icon size={11} name="common:check" />
                          </Show>
                        </button>
                        <span class={styles.actionText({ done: item.isDone })}>
                          {item.text}
                        </span>
                      </div>
                    )}
                  </For>
                </section>
              </Show>

              <section class={styles.card()}>
                <h2 class={styles.sectionTitle()}>
                  {i18n.t('meetings.transcript')}
                </h2>
                <Show
                  when={vm.segments.length > 0}
                  fallback={
                    <p class={styles.stateHint()}>
                      {i18n.t('meetings.transcript_empty')}
                    </p>
                  }
                >
                  <div class={styles.transcript()}>
                    <For each={vm.segments}>
                      {(segment) => (
                        <button
                          class={styles.segment({ active: segment.isActive })}
                          type="button"
                          onClick={() => vm.seekToSegment(segment.startMs)}
                        >
                          <span class={styles.segmentHead()}>
                            <span
                              class={styles.segmentSpeaker({
                                speaker: segment.speaker,
                              })}
                            >
                              {segment.speakerLabel}
                            </span>
                            <span class={styles.segmentTime()}>
                              {segment.timeLabel}
                            </span>
                          </span>
                          <span class={styles.segmentText()}>
                            {segment.text}
                          </span>
                        </button>
                      )}
                    </For>
                  </div>
                </Show>
              </section>
            </Show>
          </Match>
        </Switch>
      </div>

      <Modal class="p-6 sm:max-w-sm" modalId={MODALS.DELETE_MEETING}>
        <h3 class={styles.modalTitle()}>{i18n.t('meetings.delete')}</h3>
        <p class={styles.modalText()}>{i18n.t('meetings.delete_confirm')}</p>
        <div class={styles.modalActions()}>
          <Button variant="secondary" onClick={vm.cancelDelete}>
            {i18n.t('meetings.cancel')}
          </Button>
          <Button disabled={vm.isDeleting} onClick={vm.confirmDelete}>
            {i18n.t('meetings.delete')}
          </Button>
        </div>
      </Modal>
    </PageFade>
  );
}

interface MeetingSummaryProps {
  blocks: MarkdownBlock[];
}

function MeetingSummary(props: MeetingSummaryProps) {
  return (
    <div class={styles.summary()}>
      <For each={props.blocks}>
        {(block) => (
          <Switch>
            <Match when={block.type === 'heading' && block}>
              {(heading) => (
                <h3 class={styles.summaryHeading()}>
                  <SummaryInlines inlines={heading().inlines} />
                </h3>
              )}
            </Match>
            <Match when={block.type === 'list' && block}>
              {(list) => (
                <ul class={styles.summaryList()}>
                  <For each={list().items}>
                    {(item) => (
                      <li>
                        <SummaryInlines inlines={item} />
                      </li>
                    )}
                  </For>
                </ul>
              )}
            </Match>
            <Match when={block.type === 'paragraph' && block}>
              {(paragraph) => (
                <p class={styles.summaryParagraph()}>
                  <SummaryInlines inlines={paragraph().inlines} />
                </p>
              )}
            </Match>
          </Switch>
        )}
      </For>
    </div>
  );
}

interface SummaryInlinesProps {
  inlines: MarkdownInline[];
}

function SummaryInlines(props: SummaryInlinesProps) {
  return (
    <For each={props.inlines}>
      {(inline) => (
        <Show when={inline.bold} fallback={inline.text}>
          <strong class="font-semibold text-gray-900">{inline.text}</strong>
        </Show>
      )}
    </For>
  );
}
