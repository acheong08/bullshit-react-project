import { AsyncLocalStorage } from "node:async_hooks";

// AsyncLocalStorage to store the current request context
const requestContext = new AsyncLocalStorage<Request>();

/**
 * Runs a callback with the given request stored in AsyncLocalStorage
 * This allows server actions to access the request without it being passed as a parameter
 */
export async function runWithRequest<T>(
	request: Request,
	callback: () => T | Promise<T>,
): Promise<T> {
	return requestContext.run(request, callback);
}

/**
 * Gets the current request from AsyncLocalStorage
 * This should be called from within server actions that need access to the request
 * @throws Error if called outside of a request context
 */
export function getRequest(): Request {
	const request = requestContext.getStore();
	if (!request) {
		throw new Error(
			"getRequest() called outside of request context. Make sure server actions are wrapped with runWithRequest().",
		);
	}
	return request;
}
