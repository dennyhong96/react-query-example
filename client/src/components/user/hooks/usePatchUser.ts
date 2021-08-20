import jsonpatch from 'fast-json-patch';
import { UseMutateFunction, useMutation, useQueryClient } from 'react-query';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';
import { useUser } from './useUser';

async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
): Promise<User | null> {
  if (!newData || !originalData) return null;

  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    { headers: getJWTHeader(originalData) },
  );

  return data.user;
}

export function usePatchUser(): UseMutateFunction<
  User,
  unknown,
  User,
  unknown
> {
  const queryClient = useQueryClient();
  const { user, updateUser } = useUser();
  const toast = useCustomToast();

  const { mutate } = useMutation(
    (newUser: User) => patchUserOnServer(newUser, user),
    {
      onMutate(newUser: User) {
        // Cancel any outgoing user query in progress, so old server data don't overwrite optimistic update
        queryClient.cancelQueries(queryKeys.user);

        // take a snapshot of previous cache
        const prevUserData: User = queryClient.getQueryData(queryKeys.user);

        // optimistically update cache
        updateUser(newUser);

        // return context object with old snapshotted cache
        return { prevUserData };
      },
      onError(error, newData, context: { prevUserData: User }) {
        // Roll back to previous saved user, discard the optimistic update
        if (!context) return;
        updateUser(context.prevUserData);

        // tell user why it reverted back to old value
        toast({
          title: 'Update failed. Restoring to previous value.',
          status: 'warning',
        });
      },
      onSuccess(userData: User | null) {
        if (!userData) return;
        // user is already updated
        toast({
          title: 'Your profile is successfully updated.',
          status: 'success',
        });
      },
      onSettled() {
        // Invalidate user query to make sure we are in sync with server data
        queryClient.invalidateQueries(queryKeys.user);
      },
    },
  );

  return mutate;
}
