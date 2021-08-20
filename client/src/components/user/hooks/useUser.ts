import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../../user-storage';

interface AxiosResponseWithCancel<T> extends AxiosResponse<T> {
  cancel: () => void;
}

async function getUser(
  user: User | null,
): Promise<AxiosResponseWithCancel<{ user: User } | null>> {
  if (!user) return null;

  // Create a new CancelToken source for this request
  const source = axios.CancelToken.source();

  const axiosResponse: AxiosResponseWithCancel<{
    user: User;
  }> = await axiosInstance.get(`/user/${user.id}`, {
    headers: getJWTHeader(user),
    cancelToken: source.token,
  });

  axiosResponse.cancel = () => {
    source.cancel();
  };

  return axiosResponse;
}

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export function useUser(): UseUser {
  const queryClient = useQueryClient();

  // Need to maintain a react state because can't run user useQuery without knowing userId
  const [user, setUser] = useState<User | null>(getStoredUser());

  // Make sure user state is consistent with the server
  useQuery(queryKeys.user, () => getUser(user), {
    enabled: !!user, // Dependent query, only run when we have a logged in user
    onSuccess(data: User) {
      setUser(data);
    },
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // set user in state
    setUser(newUser);

    // update user in localstorage
    setStoredUser(newUser);

    // pre-populate user profile in React Query client
    queryClient.setQueryData(queryKeys.user, newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    // update state
    setUser(null);

    // remove from localstorage
    clearStoredUser();

    // reset user to null in query client
    // can't use removeQueries here because it doesn't cancel the query in progress to server. (race condition)
    // setQueryData overwrites and cancels existing queries in progress.
    queryClient.setQueryData(queryKeys.user, null);

    // remove userAppointments query from cache
    queryClient.removeQueries([queryKeys.appointments, queryKeys.user]);
  }

  return { user, updateUser, clearUser };
}
