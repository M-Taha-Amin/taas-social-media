import { useMutation, useQueryClient } from '@tanstack/react-query';

const useSavePost = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: savePost } = useMutation({
    mutationFn: async postId => {
      const response = await fetch(`/api/posts/save-post/${postId}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      return data;
    },
    onSuccess: async () => {
      await Promise.all[
        (queryClient.invalidateQueries({ queryKey: ['getSavedPosts'] }),
        queryClient.invalidateQueries({ queryKey: ['getPosts'] }))
      ];
    },
  });
  return { savePost };
};

const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteSavedPost } = useMutation({
    mutationFn: async postId => {
      const response = await fetch(`/api/posts/delete-saved-post/${postId}`, {
        method: 'POST',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      return data;
    },
    onSuccess: async () => {
      await Promise.all([
        (queryClient.invalidateQueries({ queryKey: ['getSavedPosts'] }),
        queryClient.invalidateQueries({ queryKey: ['getPosts'] })),
      ]);
    },
  });
  return { deleteSavedPost };
};

const useDeleteAllSavedPosts = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteAllSavedPosts } = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/posts/delete-all-saved-posts', {
        method: 'POST',
      });
      const data = await res.data;
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      return data;
    },
    onSuccess: async () => {
      await Promise.all([
        (queryClient.invalidateQueries({ queryKey: ['getSavedPosts'] }),
        queryClient.invalidateQueries({ queryKey: ['getPosts'] })),
      ]);
    },
  });
  return { deleteAllSavedPosts };
};

export { useSavePost, useDeleteSavedPost, useDeleteAllSavedPosts };
