import { Floor, ElevatorWorkingState, ElevatorStatus } from './utils';

interface ElevatorStopRequest {
  targetFloor: Floor;
}

export class Elevator {
  
  private readonly currentDirectionStops: ElevatorStopRequest[] = [];
  private readonly oppositeDirectionStops: ElevatorStopRequest[] = [];

  private state: ElevatorWorkingState = 'idle';

  constructor(public readonly id: number, private floor: Floor) {}

  get currentFloor(): Floor {
    return this.floor;
  }

  get nextStop(): Floor {
    return this.currentDirectionStops[0]?.targetFloor ?? this.currentFloor;
  }

  get isIdle(): boolean {
    return this.state === 'idle';
  }

  get status(): ElevatorStatus {
    const stops = [...this.currentDirectionStops, ...this.oppositeDirectionStops].map(
      stopReq => stopReq.targetFloor
    );
    return {
      id: this.id,
      currentFloor: this.currentFloor,
      nextStop: this.nextStop,
      state: this.state,
      stops,
    };
  }

  reset(): void {
    this.currentDirectionStops.splice(0, this.currentDirectionStops.length);
    this.oppositeDirectionStops.splice(0, this.oppositeDirectionStops.length);
    this.floor = 0;
    this.state = 'idle';
  }

  step(): void {
    if (this.state === 'idle') return;

    this.move();

    // request completed
    if (this.currentFloor === this.nextStop) {
      this.currentDirectionStops.shift();
    } 

    // all requests in current direction finished
    if (this.currentDirectionStops.length === 0) {
      // no requests in opposite direction - the elevator becomes idle
      if (this.oppositeDirectionStops.length === 0) {
        this.state = 'idle';
        return;
      }

      // there are requests in opposite direction - the elevator bounces back
      this.bounceBack();
    }
  }

  getDistance(floor: Floor): number {
    const res = floor - this.currentFloor;
    switch (this.state) {
      case 'up':
        return res;
      case 'down':
        return -res;
      default:
        return Math.abs(res);
    }
  }

  /**
   * Adds a new stop request to the queue, ensuring that the queue is optimally formed (sorted by distance).
   */
  addStop(targetFloor: Floor): void {
    const distance = this.getDistance(targetFloor);
    if (distance === 0) return;
    const newReq: ElevatorStopRequest = { targetFloor };
    const arrayToInsert =
      distance > 0 ? this.currentDirectionStops : this.oppositeDirectionStops;

    if (arrayToInsert.find(stop => stop.targetFloor === targetFloor) !== undefined) return;

    let i = 0;
    for (const request of arrayToInsert) {
      const requestDistance = this.getDistance(request.targetFloor);
      if (
        (distance > 0 && requestDistance <= distance) ||
        (distance < 0 && requestDistance >= distance)
      )
        i++;
    }
    arrayToInsert.splice(i, 0, newReq);
    if (this.state === 'idle') this.setState(this.nextStop);
  }

  addImmediateStop(targetFloor: Floor, distance?: number): void {
    this.setState(targetFloor);
    distance = distance ?? this.getDistance(targetFloor);
    const newReq: ElevatorStopRequest = { targetFloor };
    if (
      distance === 0 ||
      this.currentDirectionStops.find(stop => stop.targetFloor === targetFloor) !== undefined
    ) {
      this.setState(this.nextStop);
      return;
    }

    this.currentDirectionStops.unshift(newReq);
  }

  private move(): void {
    switch (this.state) {
      case 'up':
        this.floor++;
        break;
      case 'down':
        this.floor--;
        break;
      default:
        return;
    }
  }

  private bounceBack(): void {
    const reqCopy = [...this.currentDirectionStops];
    this.currentDirectionStops.splice(0, this.currentDirectionStops.length);

    this.oppositeDirectionStops.forEach(req => {
      this.currentDirectionStops.push(req);
    });

    this.oppositeDirectionStops.splice(0, this.oppositeDirectionStops.length);

    reqCopy.forEach(req => {
      this.oppositeDirectionStops.push(req);
    });

    this.setState(this.nextStop);
  }

  private setState(floorToFace: Floor): void {
    this.state =
      this.currentFloor === floorToFace
        ? 'idle'
        : this.currentFloor > floorToFace
        ? 'down'
        : 'up';
  }
}
