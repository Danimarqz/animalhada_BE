import { StatusCode } from "hono/utils/http-status";

export type ApiResponse<T> = {
	data: T;
	status: StatusCode;
  };
