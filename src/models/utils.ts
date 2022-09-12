import { Elevator } from './Elevator';
export type Floor = number;

export type ElevatorDirection = 'up' | 'down';
export type ElevatorOperation = 'opening' | 'closing';
export type ElevatorWorkingState = ElevatorOperation | ElevatorDirection | 'idle';

export interface ElevatorStatus {
  id: number;
  currentFloor: Floor;
  nextStop: Floor;
  state: ElevatorWorkingState;
  stops: Floor[];
}

export interface FindNearestElevator{
  status: Boolean;
  elevator: Elevator | undefined | null; 
}