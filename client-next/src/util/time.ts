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

const unitMapping = {
  long: {
    hour: ['hour', 'hours'],
    minute: ['minute', 'minutes'],
    second: ['second', 'seconds'],
  },
  short: {
    hour: ['hr', 'hr'],
    minute: ['min', 'min'],
    second: ['sec', 'sec'],
  },
};

export const secondsToHms = (d: number, type: keyof typeof unitMapping = 'long') => {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + ' ' + unitMapping[type].hour[m == 1 ? 0 : 1] + ' ' : '';
  var mDisplay = m > 0 ? ' ' + m + ' ' + unitMapping[type].minute[m == 1 ? 0 : 1] + ' ' : '';
  // var mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : '';
  var sDisplay = s > 0 ? ' ' + s + ' ' + unitMapping[type].second[m == 1 ? 0 : 1] + ' ' : '';
  return `${hDisplay}${mDisplay}${sDisplay}`;
};
