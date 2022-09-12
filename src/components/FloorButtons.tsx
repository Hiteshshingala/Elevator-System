import classNames from 'classnames';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Floor } from '../models';

type FloorButtonsProps = {
  className?: string;
  noOfFloor: number;
  clickedFloors: Floor[];
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FloorButtonsWrapper = styled(Wrapper)`
  flex-flow: row wrap;

  width: 6em;
  height: 9em;
  overflow: hidden auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    width: 0px;
  }

`;

const Button = styled.span`
  display: block;
  box-sizing: border-box;
  margin: 0.1em;

  width: calc(2em - 0.2em);
  height: calc(2em - 0.2em);
  line-height: calc(2em - 0.2em);

  cursor: pointer;
  background-color: #3f4045;
  text-align: center;
  outline: 0.32em solid #747681;
  outline-offset: -0.32em;
  color: #f5efed;

  transition: outline-color 0.3s ease-in;

  &.active {
    outline-color: red;
  }
`;

export const FloorButtons = ({
  noOfFloor,
  clickedFloors,
  className,
}: FloorButtonsProps) => {

  const buttons = useMemo(() => {
    const highlightButton = new Array<boolean>(noOfFloor).fill(false);
    clickedFloors.forEach(floor => (highlightButton[floor] = true));

    return highlightButton.map((highlight, floorIndex) => {
      const className = classNames({
        active: highlight,
      });
      return (
        <Button
          key={floorIndex}
          className={className}
        >
          {floorIndex}
        </Button>
      );
    });
  }, [clickedFloors, noOfFloor]);

  return (
    <FloorButtonsWrapper className={`${className}`}>
      {buttons}
    </FloorButtonsWrapper>
  );
};
