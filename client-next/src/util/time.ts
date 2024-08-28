
export const timeSinceShort = (seconds: number) => {
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + ' yr';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' mth';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' day';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + ' hr';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' min';
    }
    return Math.floor(seconds) + ' sec';
  };