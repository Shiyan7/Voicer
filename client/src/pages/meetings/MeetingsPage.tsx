import { For, Show } from 'solid-js';

import { MeetingStatus } from '@/entities/meeting';
import { i18n } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';
import { Icon } from '@/shared/ui/icon';
import { PageFade } from '@/shared/ui/page-fade';
import { StatusBadge } from '@/shared/ui/status-badge';
import { useViewModel } from '@/shared/view-model';

import { meetingsPageStyles } from './MeetingsPage.styles';
import { MeetingsPageViewModel } from './model/MeetingsPageViewModel';

const styles = meetingsPageStyles();

export default function MeetingsPage() {
  const vm = useViewModel(MeetingsPageViewModel);

  return (
    <PageFade>
      <div class={styles.root()}>
        <header class={styles.header()}>
          <h1 class={styles.title()}>{i18n.t('meetings.title')}</h1>
          <Show when={vm.canRecord}>
            <Button variant="primary" onClick={vm.startRecording}>
              {i18n.t('meetings.record_now')}
            </Button>
          </Show>
          <Show when={vm.canUpload}>
            <Button
              class={vm.isUploading ? 'pointer-events-none opacity-60' : ''}
              as="label"
              variant="secondary"
            >
              <Show
                when={vm.isUploading}
                fallback={i18n.t('meetings.upload_audio')}
              >
                {i18n.t('meetings.uploading_file')}
              </Show>
              <input
                class={styles.uploadInput()}
                accept="audio/*"
                disabled={vm.isUploading}
                type="file"
                onChange={vm.onFileSelected}
              />
            </Button>
          </Show>
        </header>

        <Show when={!vm.isLoading} fallback={<MeetingsSkeleton />}>
          <Show
            when={!vm.isEmpty}
            fallback={
              <div class={styles.empty()}>
                <span class={styles.emptyTitle()}>
                  {i18n.t('meetings.empty')}
                </span>
              </div>
            }
          >
            <div class={styles.list()}>
              <For each={vm.cards}>
                {(card) => (
                  <MeetingCard
                    id={card.id}
                    meta={card.meta}
                    status={card.status}
                    title={card.title}
                    onOpen={vm.openMeeting}
                  />
                )}
              </For>
            </div>
          </Show>
        </Show>
      </div>
    </PageFade>
  );
}

interface MeetingCardProps {
  id: string;
  title: string;
  meta: string;
  status: MeetingStatus;
  onOpen: (id: string) => void;
}

function MeetingCard(props: MeetingCardProps) {
  return (
    <button
      class={styles.card()}
      type="button"
      onClick={() => props.onOpen(props.id)}
    >
      <span class={styles.cardBody()}>
        <span class={styles.cardTitle()}>{props.title}</span>
        <span class={styles.cardMeta()}>{props.meta}</span>
      </span>
      <StatusBadge status={props.status} />
      <Icon class={styles.chevron()} size={14} name="common:chevron-right" />
    </button>
  );
}

function MeetingsSkeleton() {
  return (
    <div class={styles.list()}>
      <div class={styles.skeleton()} />
      <div class={styles.skeleton()} />
      <div class={styles.skeleton()} />
    </div>
  );
}
