import { MeetingChat } from '@/features/meeting-chat';
import { MeetingDetailsOrchestrator } from '@/features/meeting-details';

export default function MeetingDetailsPage() {
  return (
    <MeetingDetailsOrchestrator
      renderChat={(params) => <MeetingChat {...params} />}
    />
  );
}
