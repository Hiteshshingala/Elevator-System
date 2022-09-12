import { useParams } from 'react-router-dom';

export function useActiveFloor(): number {
  const currentFloor = useParams().floor;
  if (currentFloor === undefined) throw new ReferenceError('Invalid route param!');
  return Number(currentFloor);
}
