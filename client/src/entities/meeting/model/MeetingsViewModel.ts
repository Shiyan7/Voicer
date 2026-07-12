import { singleton } from '@/shared/di';
import { SingletonViewModel } from '@/shared/view-model';

import { CreateMeetingInput, MeetingListItem } from '../types';
import { MeetingsService } from './MeetingsService';

@singleton()
export class MeetingsViewModel extends SingletonViewModel {
  meetings: MeetingListItem[] = [];

  isLoading = false;

  constructor(private readonly meetingsService: MeetingsService) {
    super();
  }

  load = async () => {
    this.isLoading = true;

    try {
      this.meetings = await this.meetingsService.list();
    } finally {
      this.isLoading = false;
    }
  };

  create = async (input: CreateMeetingInput) => {
    const meeting = await this.meetingsService.create(input);
    this.meetings = [meeting, ...this.meetings];

    return meeting;
  };

  applyUpdate = (id: string, patch: Partial<MeetingListItem>) => {
    this.meetings = this.meetings.map((meeting) =>
      meeting.id === id ? { ...meeting, ...patch } : meeting,
    );
  };

  remove = async (id: string) => {
    const prev = this.meetings;
    this.meetings = this.meetings.filter((meeting) => meeting.id !== id);

    try {
      await this.meetingsService.remove(id);
    } catch (error) {
      this.meetings = prev;
      throw error;
    }
  };
}
