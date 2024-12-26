const resolveAppApiUrl = () => {
  return process.env.REACT_APP_API_URL;
}

export const HOST = resolveAppApiUrl()

export const IMAGE_HOST = HOST + 'upload/'
