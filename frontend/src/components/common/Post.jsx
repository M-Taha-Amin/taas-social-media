import { FaBookmark, FaRegComment } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';
import { FaRegBookmark } from 'react-icons/fa6';
import { FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import LoadinSpinner from '../common/LoadingSpinner';
import { formatPostDate } from '../../utils/date';
import { useDeleteSavedPost, useSavePost } from '../../hooks/SavePostHooks';

const Post = ({ post }) => {
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();
  const { savePost } = useSavePost();
  const { deleteSavedPost } = useDeleteSavedPost();

  const { data: user } = useQuery({ queryKey: ['getAuthUser'] });
  const postOwner = post.user;
  const isLiked = post.likes.includes(user._id);
  const isMySavedPost = user.savedPosts.includes(post._id);

  const isMyPost = post.user._id === user._id;
  const formattedDate = formatPostDate(post.createdAt);
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationKey: ['deletePost'],
    mutationFn: async () => {
      try {
        const response = await fetch(`/api/posts/delete/${post._id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to delete Post');
        }
        queryClient.invalidateQueries({ queryKey: ['getPosts'] });
      } catch (error) {
        throw new Error(error);
      }
    },
  });
  const { mutate: likeUnlikePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch(`/api/posts/like/${post._id}`, {
          method: 'POST',
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: updatedLikes => {
      queryClient.setQueryData(['getPosts'], oldPosts => {
        return oldPosts.map(p => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
      queryClient.invalidateQueries({ queryKey: ['notificationsCount'] });
    },
  });

  const { mutate: commentOnPost, isPending: isCommenting } = useMutation({
    mutationFn: async comment => {
      try {
        const response = await fetch(`/api/posts/comment/${post._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: comment }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: updatedComments => {
      queryClient.setQueryData(['getPosts'], prevPosts => {
        return prevPosts.map(p => {
          if (p._id === post._id) {
            return { ...p, comments: updatedComments };
          }
          return p;
        });
      });
      setComment('');
    },
  });

  const handleDeletePost = () => {
    if (isLiking) return;
    deletePost();
  };

  const handlePostComment = e => {
    e.preventDefault();
    if (isCommenting) return;
    commentOnPost(comment);
  };

  const handleLikePost = () => {
    likeUnlikePost();
  };

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-8 rounded-full overflow-hidden">
            <img src={postOwner.profileImage || '/avatar-placeholder.png'} />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner.username}`} className="font-bold">
              {postOwner.fullName}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner.username}`}>
                @{postOwner.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyPost && (
              <span className="flex justify-end flex-1">
                {!isDeleting && (
                  <FaTrash
                    className="cursor-pointer hover:text-red-500"
                    onClick={handleDeletePost}
                  />
                )}
                {isDeleting && <LoadinSpinner />}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.text}</span>
            {post.image && (
              <img
                src={post.image}
                className="h-80 object-contain rounded-lg border border-gray-700"
                alt=""
              />
            )}
          </div>
          <div className="flex justify-around mt-3">
            <div
              className="flex gap-1 items-center cursor-pointer group"
              onClick={() =>
                document.getElementById('comments_modal' + post._id).showModal()
              }>
              <FaRegComment className="w-4 h-4  text-slate-500 group-hover:text-sky-400" />
              <span className="text-sm text-slate-500 group-hover:text-sky-400">
                {post.comments.length}
              </span>
            </div>
            {/* We're using Modal Component from DaisyUI */}
            <dialog
              id={`comments_modal${post._id}`}
              className="modal border-none outline-none">
              <div className="modal-box rounded border border-gray-600">
                <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                  {post.comments.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No comments yet 🤔 Be the first one 😉
                    </p>
                  )}
                  {post.comments.map(comment => (
                    <div key={comment._id} className="flex gap-2 items-start">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={
                              comment.user.profileImage ||
                              '/avatar-placeholder.png'
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-bold">
                            {comment.user.fullName}
                          </span>
                          <span className="text-gray-700 text-sm">
                            @{comment.user.username}
                          </span>
                        </div>
                        <div className="text-sm">{comment.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                  onSubmit={handlePostComment}>
                  <textarea
                    className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                  />
                  <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                    {isCommenting ? <LoadinSpinner size="md" /> : 'Post'}
                  </button>
                </form>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button className="outline-none">close</button>
              </form>
            </dialog>
            <div
              className="flex gap-1 items-center group cursor-pointer"
              onClick={handleLikePost}>
              {isLiking && <LoadinSpinner size="sm" />}
              {!isLiked && !isLiking && (
                <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-red-500" />
              )}
              {isLiked && !isLiking && (
                <FaRegHeart className="w-4 h-4 cursor-pointer text-red-500 " />
              )}

              <span
                className={`text-sm group-hover:text-red-500 ${
                  isLiked ? 'text-red-500' : ' text-slate-500'
                }`}>
                {post.likes.length}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              {isMySavedPost ? (
                <FaBookmark
                  fill="#fff"
                  onClick={() => deleteSavedPost(post._id)}
                  className="w-4 h-4 text-slate-500 cursor-pointer"
                />
              ) : (
                <FaRegBookmark
                  onClick={() => savePost(post._id)}
                  className="w-4 h-4 text-slate-500 cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
