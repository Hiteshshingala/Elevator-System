import { useContext } from 'react';
import { ElevatorSystemContext, IElevatorSystemContext } from '../contexts';

export function useGetElevatorContext(): IElevatorSystemContext {
  const context = useContext(ElevatorSystemContext);
  if (context === null) throw new ReferenceError('ElevatorSystemContext not initialised!');
  return context;
}
