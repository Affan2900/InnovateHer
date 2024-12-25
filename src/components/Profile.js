// components/Profile.js
const Profile = ({ username, onClick }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
 
  return (
    <div 
      onClick={onClick}
      className="w-12 h-12 rounded-full bg-white text-purple-700 flex items-center justify-center text-xl font-bold cursor-pointer hover:bg-purple-100"
    >
      {getInitials(username)}
    </div>
  );
 };
 
 export default Profile;