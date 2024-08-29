import * as dayjs from 'dayjs';
import { formatTime } from '../../util/formatTime';

export function LegTime({
  aimedTime,
  expectedTime,
  hasRealtime,
}: {
  aimedTime: string;
  expectedTime: string;
  hasRealtime: boolean;
}) {
  return aimedTime !== expectedTime ? (
    <>
      <span style={{ color: 'red' }}>{formatTime(expectedTime)}</span>
      <span style={{ textDecoration: 'line-through' }}>{formatTime(aimedTime)}</span>
    </>
  ) : (
    <span>
      {dayjs(expectedTime).format('HH:mm:ss')}
      {hasRealtime && <span> (on time)</span>}
    </span>
  );
}
