const formatDateTimestamp = (timestamp: number) => {
  const dateObj = new Date(timestamp * 1000); // Convert seconds to milliseconds
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  return dateObj.toLocaleString('en-US', options);
};

const checkExpiration = (timestamp: number) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const isExpired = currentTime > timestamp;
  return isExpired;
};

const formatTableDate = (value: string) => {
  return new Date(value).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export { formatTableDate, formatDateTimestamp, checkExpiration };
