import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Elevator } from '.';
import { useGetElevatorContext } from '../customHooks';


const ElevatorsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  gap: 20px;

  box-sizing: border-box;
  width: 50vw;
  height: 100vh;
  overflow: scroll;
  padding: 20px;
`;

export const ElevatorContainer = () => {
  const { noOfFloor, elevators } = useGetElevatorContext();

  const elevator = useMemo(() => {
    const Elevators = elevators.map(elevator => (
      <Elevator
        key={elevator.id}
        model={elevator}
        noOfFloor={noOfFloor}
      />
    ));

    return Elevators;
  }, [elevators, noOfFloor]);

  return <ElevatorsContainer>{elevator}</ElevatorsContainer>;
};
