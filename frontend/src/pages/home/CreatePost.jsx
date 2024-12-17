import { CiImageOn } from 'react-icons/ci';
import { BsEmojiSmileFill } from 'react-icons/bs';
import { useRef, useState, useEffect } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Picker from '@emoji-mart/react';
import emojiData from '@emoji-mart/data';

const CreatePost = () => {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiPickerRef = useRef(null);
  const imgRef = useRef(null);

  const { data: authUser } = useQuery({ queryKey: ['getAuthUser'] });
  const queryClient = useQueryClient();

  const { mutate: createPost, isPending } = useMutation({
    mutationKey: ['createPost'],
    mutationFn: async postData => {
      try {
        const res = await fetch('/api/posts/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to create post');
        }
        queryClient.invalidateQueries({ queryKey: ['getPosts'] });
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const handleSubmit = e => {
    e.preventDefault();
    setText('');
    setImg(null);
    setShowEmojiPicker(false);
    createPost({ text, image: img });
  };

  const handleImgChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiSelect = emoji => {
    setText(prevText => {
      if (prevText.endsWith(' ')) prevText + emoji.native;
      else prevText += ' ' + emoji.native;
      return prevText;
    });
    setShowEmojiPicker(false);
  };

  // Close the emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser.profileImage || '/avatar-placeholder.png'} />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center relative">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill
              className="fill-primary w-5 h-5 cursor-pointer"
              onClick={() => setShowEmojiPicker(prev => !prev)}
            />
            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="absolute top-8 left-8 z-10">
                <Picker data={emojiData} onEmojiSelect={handleEmojiSelect} />
              </div>
            )}
          </div>
          <input
            type="file"
            hidden
            ref={imgRef}
            accept="image/*"
            onChange={handleImgChange}
          />
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPending ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
