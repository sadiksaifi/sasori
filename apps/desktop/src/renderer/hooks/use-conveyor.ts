type ConveyorDomains = keyof Window["conveyor"];

export function useConveyor<T extends ConveyorDomains>(domain: T): Window["conveyor"][T];
export function useConveyor(): Window["conveyor"];
export function useConveyor(domain?: ConveyorDomains) {
  if (domain) return window.conveyor[domain];
  return window.conveyor;
}
