import dayjs from 'dayjs';
import { useQuery } from 'react-query';

import type { Appointment, User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useUser } from './useUser';

async function getUserAppointments(
  user: User | null,
): Promise<Appointment[] | null> {
  if (!user) return null;
  const { data } = await axiosInstance.get(`/user/${user.id}/appointments`, {
    headers: getJWTHeader(user),
  });
  return data.appointments;
}

export function useUserAppointments(): Appointment[] {
  const { user } = useUser();

  let userAppointments: Appointment[] = [];

  ({ data: userAppointments = [] } = useQuery(
    [queryKeys.appointments, queryKeys.user, user?.id], // Have the same prefix as useAppointments, so they can be invalidated at once
    () => getUserAppointments(user),
    { enabled: !!user },
  ));

  return userAppointments;
}
