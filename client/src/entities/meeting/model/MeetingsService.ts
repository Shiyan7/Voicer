import { injectable } from '@/shared/di';

import { ApiService } from '@/shared/api';

import {
  CreateMeetingInput,
  Meeting,
  MeetingDetails,
  MeetingListItem,
  UpdateMeetingInput,
} from '../types';

@injectable()
export class MeetingsService {
  constructor(private readonly api: ApiService) {}

  list() {
    return this.api.get<MeetingListItem[]>('/meetings');
  }

  get(id: string) {
    return this.api.get<MeetingDetails>(`/meetings/${id}`);
  }

  create(input: CreateMeetingInput) {
    return this.api.post<Meeting>('/meetings', input);
  }

  update(id: string, input: UpdateMeetingInput) {
    return this.api.patch<Meeting>(`/meetings/${id}`, input);
  }

  remove(id: string) {
    return this.api.delete<void>(`/meetings/${id}`);
  }

  uploadAudio(id: string, file: File | Blob) {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.postFormData<Meeting>(`/meetings/${id}/audio`, formData);
  }

  getAudioUrl(id: string) {
    return this.api.getAudioUrl(id);
  }
}
