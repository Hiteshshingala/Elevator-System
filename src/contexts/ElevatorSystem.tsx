import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ElevatorDirection, ElevatorStatus, ElevatorSystem, Floor, FindNearestElevator } from '../models';
import { NO_OF_ELEVATORS, NO_OF_FLOOR, DELAY } from '../config';

type ElevatorSystemProviderProps = {
  children: ReactNode;
};

export interface IElevatorSystemContext {
  noOfFloor: number;
  elevators: ElevatorStatus[];
  delay: number;
  setNoOfFloor: (noOfFloor: number) => void;
  requestPickup: (sourceFloor: Floor, direction: ElevatorDirection) => FindNearestElevator;
  requestDropoff: (elevatorID: number, targetFloor: Floor) => void;
  step: () => void;
  reset: () => void;
  setDelay: (newvall: number) => void;
}

const initValues = {
  noOfFloor: NO_OF_FLOOR || 50,
  noOfElevators: NO_OF_ELEVATORS || 5,
  delay: DELAY,
};

export const ElevatorSystemContext = React.createContext<IElevatorSystemContext | null>(null);

export const ElevatorSystemProvider = ({ children }: ElevatorSystemProviderProps) => {
  const {
    elevatorSystem,
    elevators,
    update,
    requestPickup,
    requestDropoff,
    step,
    reset,
  } = useElevSystemProxy();

  const { noOfFloor, setNoOfFloor } = useFloorCount(elevatorSystem, update);
  const { delay, setDelay } = useInterval(
    elevatorSystem,
    noOfFloor,
    step
  );

  const data: IElevatorSystemContext = {
    elevators,
    noOfFloor,
    setNoOfFloor,
    requestPickup,
    requestDropoff,
    step,
    reset,
    setDelay,
    delay,
  };

  return (
    <ElevatorSystemContext.Provider value={data}>{children}</ElevatorSystemContext.Provider>
  );
};

function useElevSystemProxy() {
  const elevatorSystem = useMemo(() => new ElevatorSystem(initValues.noOfElevators), []);
  const [elevators, setElevators] = useState([...elevatorSystem.status()]);

  const update = useCallback(
    () => setElevators([...elevatorSystem.status()]),
    [elevatorSystem]
  );

  const requestPickup = useCallback(
    (sourceFloor: Floor, direction: ElevatorDirection) => {
      const pickupElevator = elevatorSystem.pickup(sourceFloor, direction);
      update();
      return pickupElevator;
    },
    [elevatorSystem, update]
  );

  const requestDropoff = useCallback(
    (elevatorID: number, targetFloor: Floor) => {
      elevatorSystem.dropoff(elevatorID, targetFloor);
      update();
    },
    [elevatorSystem, update]
  );

  const step = useCallback(() => {
    elevatorSystem.step();
    update();
  }, [elevatorSystem, update]);



  const reset = useCallback(() => {
    elevatorSystem.resetElevators();
    update();
  }, [elevatorSystem, update]);

  return useMemo(
    () => ({
      elevatorSystem,
      elevators,
      update,
      requestPickup,
      requestDropoff,
      step,
      reset,
    }),
    [
      elevatorSystem,
      elevators,
      update,
      requestPickup,
      requestDropoff,
      step,
      reset,
    ]
  );
}

function useInterval(
  elevatorSystem: ElevatorSystem,
  noOfFloor: number,
  step: () => void
) {
  const [delay, setDelay] = useState(initValues.delay);
  const intervalID = useRef(-1);

  const nextStep = useCallback(() => {
    step();
  }, [step, elevatorSystem, noOfFloor]);

  useEffect(() => {
    clearInterval(intervalID.current);
    intervalID.current = window.setInterval(nextStep, delay);
  }, [nextStep, delay]);


  return useMemo(
    () => ({ delay, setDelay }),
    [delay]
  );
}

function useFloorCount(elevatorSystem: ElevatorSystem, update: () => void) {
  const [noOfFloor, _setFloorCount] = useState(initValues.noOfFloor);

  const setNoOfFloor = useCallback(
    (newValue: number) => {
      if (newValue > 1 && window.confirm('Are you sure?\nThis will reset all elevators.')) {
        _setFloorCount(newValue);
        elevatorSystem.resetElevators();
        update();
      }
    },
    [elevatorSystem, _setFloorCount, update]
  );

  return useMemo(() => ({ noOfFloor, setNoOfFloor }), [noOfFloor, setNoOfFloor]);
}
