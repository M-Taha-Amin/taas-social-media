import LoadingSpinner from '../../components/common/LoadingSpinner';
import LoadingBar from 'react-top-loading-bar';

import { IoSettingsOutline } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import Post from '../../components/common/Post';
import { useDeleteAllSavedPosts } from '../../hooks/SavePostHooks';

const SavedPostsPage = () => {
  const loadingBarRef = useRef();
  const { deleteAllSavedPosts } = useDeleteAllSavedPosts();
  const { data: savedPosts, isLoading } = useQuery({
    queryKey: ['getSavedPosts'],
    queryFn: async () => {
      try {
        loadingBarRef.current.continuousStart(0);
        const response = await fetch('/api/posts/saved');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong!');
        }
        loadingBarRef.current.complete();
        return data.savedPosts;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  return (
    <>
      <LoadingBar color="rgb(29, 155, 240)" ref={loadingBarRef} />
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Saved Posts</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a onClick={deleteAllSavedPosts}>Delete all Saved Posts</a>
              </li>
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {savedPosts?.length === 0 && (
          <div className="text-center p-4 font-bold">No Saved Posts 🤔</div>
        )}
        {savedPosts?.map(post => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </>
  );
};
export default SavedPostsPage;
