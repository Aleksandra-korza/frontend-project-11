const proxyUrl = 'https://allorigins.hexlet.app/get?disableCache=true&url='

export const fetchRSS = async (url) => {
  const response = await fetch(`${proxyUrl}${encodeURIComponent(url)}`)

  if (!response.ok) {
    throw new Error('errors.network')
  }

  const data = await response.json()
  return data.contents
}
