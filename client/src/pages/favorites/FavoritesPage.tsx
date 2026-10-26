import { Navigate } from '@solidjs/router';

import { paths } from '@/shared/router';

export default function FavoritesPage() {
  return <Navigate href={`${paths.meetings}?favorites=1`} />;
}
