const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

const CITATION = new RegExp(
  `\\[\\[\\s*(${UUID})[\\s:@|,]+\\[?(\\d+(?::\\d{1,2}){0,2})\\]?\\s*\\]\\]`,
  'gi',
);

const MS_IN_SECOND = 1000;

const SECONDS_IN_UNIT = 60;

const toMs = (time: string): number =>
  time.includes(':')
    ? time
        .split(':')
        .reduce((total, part) => total * SECONDS_IN_UNIT + Number(part), 0) *
      MS_IN_SECOND
    : Number(time);

export const normalizeArchiveCitations = (content: string): string =>
  content.replace(
    CITATION,
    (_, meetingId: string, time: string) =>
      `[[${meetingId.toLowerCase()}:${toMs(time)}]]`,
  );
