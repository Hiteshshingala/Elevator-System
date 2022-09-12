import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStop, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { ElevatorWorkingState, Floor } from '../models';

type ElevatorScreenProps = { elevatorState: ElevatorWorkingState; currentFloor: Floor };

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OuterContainer = styled(Wrapper)`
  position: absolute;
  top: 0.8em;

  font-size: 0.9em;
  background-color: black;
  padding: 0.4em 0;
  color: green;

  width: 7em;
  height: 1em;
  line-height: 1em;

  .icon {
    position: absolute;
    left: 0.4em;
  }
`;

const FloorNumber = styled.span`
  margin-left: 5px;
`;

export const ElevatorScreen = ({ elevatorState, currentFloor }: ElevatorScreenProps) => {
  const stateIcon =
    elevatorState === 'idle' ? faStop : elevatorState === 'up' ? faChevronUp : faChevronDown;
  return (
    <OuterContainer>
      <FontAwesomeIcon icon={stateIcon} fixedWidth className="icon" />
      <FloorNumber> {currentFloor}</FloorNumber>
    </OuterContainer>
  );
};
