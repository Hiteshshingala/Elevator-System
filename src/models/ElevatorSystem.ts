import { ElevatorDirection, Floor, ElevatorStatus } from './utils';
import { Elevator } from './Elevator';
import { inRange, sample, remove } from 'lodash-es';

interface PickUpRequest {
  sourceFloor: Floor;
  direction: ElevatorDirection;
  timeout: number;
}

interface FindNearestElevator{
  status: Boolean;
  elevator: Elevator | undefined | null; 
}

interface DispatchCandidate {
  elevator: Elevator;
  distance: number;
}

export class ElevatorSystem {
  private static readonly REQUEST_TIMEOUT = 10;

  private readonly pickupRequests: PickUpRequest[] = [];

  public readonly elevators: Elevator[] = [];

  private nextID = 0;

  constructor(startingElevators: number) {
    for (let i = 0; i < startingElevators; i++) this.addElevator();
  }

  pickup(sourceFloor: Floor, direction: ElevatorDirection): any {
    const pickupRequest: PickUpRequest = {
      sourceFloor,
      direction,
      timeout: ElevatorSystem.REQUEST_TIMEOUT,
    };

    const dispatchElevator = this.findNearestElevator(pickupRequest);
    if (!dispatchElevator.status) {
      this.pickupRequests.push(pickupRequest);
    }
    return dispatchElevator;
  }

  dropoff(elevatorID: number, targetFloor: Floor): void {
    this.elevators.find(elevator => elevator.id === elevatorID)?.addStop(targetFloor);
  }

  step(): void {
    this.elevators.forEach(elevator => elevator.step());
    remove(this.pickupRequests, request =>{
      const dispatchElevator = this.findNearestElevator(request);
      return dispatchElevator.status;
    });
  }

  status(): ElevatorStatus[] {
    return this.elevators.map(elevator => elevator.status);
  }

  addElevator(): void {
    this.elevators.push(new Elevator(this.nextID, 0));
    this.nextID++;
  }


  resetElevators(): void {
    this.elevators.forEach(elevator => elevator.reset());
    this.pickupRequests.splice(0, this.pickupRequests.length);
  }

  private findNearestElevator(pickupRequest: PickUpRequest): FindNearestElevator {
    const targetFloor: Floor = pickupRequest.sourceFloor;
    const dispatchCandidates: DispatchCandidate[] = [];
    this.elevators.forEach(elevator => {
      if (
        elevator.isIdle ||
        (inRange(targetFloor, elevator.currentFloor, elevator.nextStop) &&
          elevator.status.state === pickupRequest.direction)
      ) {
        const distance = elevator.getDistance(targetFloor);
        dispatchCandidates.push({ elevator, distance });
      }
    });

    if (dispatchCandidates.length === 0) {
      pickupRequest.timeout--;
      if (pickupRequest.timeout <= 0) {
        sample(this.elevators)?.addStop(pickupRequest.sourceFloor);
        return {
          status: true,
          elevator: sample(this.elevators)
        };
      }
      return {
        status: false,
        elevator: null
      };
    }

    dispatchCandidates.sort((a, b) => a.distance - b.distance);
    const chosenCandidate = dispatchCandidates[0];
    chosenCandidate?.elevator.addImmediateStop(targetFloor, chosenCandidate.distance);
    return {
      status: true,
      elevator: chosenCandidate?.elevator
    };
  }
}
