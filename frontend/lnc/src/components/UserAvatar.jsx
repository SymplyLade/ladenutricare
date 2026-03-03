const UserAvatar = ({
  name,
  imageUrl,
  sizeClass = 'h-8 w-8',
  textClass = 'text-sm',
  className = '',
  onImageError,
  imageFailed = false,
}) => {
  const initial = (name?.trim()?.[0] || 'U').toUpperCase();

  if (imageUrl && !imageFailed) {
    return (
      <img
        className={`${sizeClass} rounded-full object-cover ${className}`}
        src={imageUrl}
        alt={`${name || 'User'} avatar`}
        onError={onImageError}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center font-semibold ${textClass} ${className}`}
      aria-label={`${name || 'User'} avatar`}
    >
      {initial}
    </div>
  );
};

export default UserAvatar;
