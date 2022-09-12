import React from 'react';
import styled from 'styled-components';
import { ElevatorStatus } from '../models';
import { FloorButtons, ElevatorScreen } from '.';

type ElevatorProps = {
  model: ElevatorStatus;
  noOfFloor: number;
};

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ElevatorWrapper = styled(Wrapper)`
  width: 12em;
  height: 15em;

  position: relative;
  background-color: #262222;

  transition: all 0.5s;
`;

export const Elevator = ({ model, noOfFloor }: ElevatorProps) => {

  return (
    <ElevatorWrapper>
      <Wrapper>
        <ElevatorScreen elevatorState={model.state} currentFloor={model.currentFloor} />
        <FloorButtons
          clickedFloors={model.stops}
          noOfFloor={noOfFloor}
        />
      </Wrapper>
    </ElevatorWrapper>
  );
};
