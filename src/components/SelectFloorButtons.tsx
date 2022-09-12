import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useActiveFloor, useGetElevatorContext } from '../customHooks';
import { ElevatorDirection, FindNearestElevator } from '../models';
import Select from "react-select";

type ButtonActiveState = { [key in ElevatorDirection]: boolean };

const ElevatorButtonsWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 50vw;

  background-color: darkgray;

  color: #3f4045;

  .active {
    color: red;
  }

  .pointer {
    cursor: pointer;
  }
  .row{
    display: block;
    background: white;
  }
  .col{
    padding: 2em;
  }
  .submit-btn{
    background-color: #008CBA;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
  }
`;

export const SelectFloorButtons = () => {
  const [active, setActive] = useState<ButtonActiveState>({ up: false, down: false });
  const { elevators, requestPickup, noOfFloor, requestDropoff } = useGetElevatorContext();
  const currentFloor = useActiveFloor();
  const [sourceFloor, setSourceFloor] = useState(0);
  const [targetFloor, setTargetFloor] = useState(0);
  const [sourceFloorVal, setSourceFloorVal] = useState(0);
  const [targetFloorVal, setTargetFloorVal] = useState(0);

  const activate = (key: ElevatorDirection) => {
    active[key] = true;
    setActive({ ...active });
  };

  useEffect(() => {
    // TODO: ugly solution, may not always work
    const arrived =
      elevators.find(elevator => elevator.currentFloor === currentFloor) ?? false;
    if (arrived) setActive({ up: false, down: false });
  }, [elevators, currentFloor]);


  const options = Array.from(Array(noOfFloor).keys()).map((key, index): any => ({
    label: index,
    value: index
  }));

  const onDropdownSelected = (option: any) => {
    setSourceFloor(option);
    setSourceFloorVal(option.value);
  }
  
  const onTargetFLoorDropdownSelected = (option: any) => {
    setTargetFloor(option);
    setTargetFloorVal(option.value);
  }

  const submit = () => {
    if(sourceFloorVal === targetFloorVal){
      window.confirm('Please select diffrent floor');
      return;
    }
    const distance = sourceFloorVal - targetFloorVal;
    const direction = distance < 0 ? 'down' : 'up';
    const pickupElevator: FindNearestElevator = requestPickup(sourceFloorVal, direction);
    if(pickupElevator.status && pickupElevator.elevator){
      requestDropoff(pickupElevator.elevator.id, targetFloorVal);
    }
    activate(direction);
    setTargetFloor(0);
    setSourceFloor(0);
  }
  return (
    <ElevatorButtonsWrapper>
      <div className='row'>
        <div className='col'> 
         <Select
          value={sourceFloor}
          options={options}
          isClearable={true}
          onChange={onDropdownSelected}
        />
        </div>
        <div className='col'>
         <Select
          value={targetFloor}
          options={options}
          isClearable={true}
          onChange={onTargetFLoorDropdownSelected}
        />
        </div>
      </div>


        <button type="button" className="submit-btn" onClick={() => submit()}>submit</button>
        </ElevatorButtonsWrapper>
  );
};
