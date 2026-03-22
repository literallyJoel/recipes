import { Log } from "../logging/Log";
import { buildErrorLogContext, createErrorResponse } from "./http";

export function withErrorHandling<TArgs extends unknown[], TResult>(
  handler: (...args: TArgs) => Promise<TResult>,
  options: {
    logMessage: string;
    getRequest?: (...args: TArgs) => Request | undefined;
  },
): (...args: TArgs) => Promise<TResult | Response> {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      const request = options.getRequest?.(...args);
      Log.error(options.logMessage, buildErrorLogContext(error, request));
      return createErrorResponse(error);
    }
  };
}
