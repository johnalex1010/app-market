export function serviceNotImplemented(serviceName: string): never {
  throw new Error(`${serviceName} está pendiente de implementación según la SPEC funcional correspondiente.`);
}
