import { Log } from "../logging/Log";
import { buildErrorLogContext } from "./http";

export function withErrorHandling<TArgs extends unknown[], TResult>(
  handler: (...args: TArgs) => Promise<TResult>,
  options: {
    logMessage: string;
    getRequest?: (...args: TArgs) => Request | undefined;
  },
): (...args: TArgs) => Promise<TResult> {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      const request = options.getRequest?.(...args);
      Log.error(options.logMessage, buildErrorLogContext(error, request));
      throw error;
    }
  };
}
