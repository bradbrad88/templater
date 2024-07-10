export function exhaustiveSwitchGuard(key: never): never {
  throw new Error(`Unhandled case: ${key}`);
}
