export default async (event: any, context: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Test function works!", path: event.rawPath }),
  };
};
