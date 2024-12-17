import { Link } from 'react-router-dom';

const UserSearchCard = ({ user }) => {
  return (
    <>
      <div className="flex justify-between max-w-xl mx-auto ring-2 ring-slate-800 items-center px-6 py-2 rounded-full ">
        <div className="flex items-center gap-4">
          <img
            src={user.profileImage || '/avatar-placeholder.png'}
            className="h-10 object-contain rounded-full"
          />
          <div>
            <h3 className="font-bold text-lg -mb-1">@{user.username}</h3>
            <h5 className="text-slate-400 font-medium">{user.fullName}</h5>
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            Go to Profile
          </button>
        </Link>
      </div>
    </>
  );
};
export default UserSearchCard;
