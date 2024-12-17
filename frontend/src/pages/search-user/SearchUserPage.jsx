import LoadingSpinner from '../../components/common/LoadingSpinner';
import LoadingBar from 'react-top-loading-bar';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import UserSearchCard from './UserSearchCard';

const SearchUserPage = () => {
  const loadingBarRef = useRef();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['getAllUsers'],
    queryFn: async () => {
      try {
        loadingBarRef.current.continuousStart(0);
        const response = await fetch('/api/users/all');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong!');
        }
        loadingBarRef.current.complete();
        setUsers(data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  useEffect(() => {
    setUsers(
      usersData?.filter(user => user.username.toLowerCase().includes(searchTerm))
    );
  }, [searchTerm, usersData]);

  return (
    <>
      <LoadingBar color="rgb(29, 155, 240)" ref={loadingBarRef} />
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="p-4 border-b border-gray-700">
          <p className="font-bold text-lg">Search User</p>
        </div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        <div className="m-4 mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Enter username..."
            onChange={e => setSearchTerm(e.target.value.toLowerCase())}
            className="input input-bordered rounded-full max-w-xl w-full"
          />
        </div>
        {users?.length === 0 && searchTerm.length > 0 && (
          <div className="text-center p-4 font-bold">No Users Found 🤔</div>
        )}
        <div className="space-y-4">
          {users?.map(user => (
            <UserSearchCard key={user._id} user={user} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchUserPage;
