type ApiSuccessResponseType = {
  statusCode?: number;
  message?: string;
};
export const ApiSuccessResponse = (data?: ApiSuccessResponseType) => {
  return {
    statusCode: data?.statusCode ?? 200,
    message: data?.message ?? 'Success',
  };
};
