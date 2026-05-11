export const parseRSS = (xmlString) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlString, 'text/xml')

    if (doc.querySelector('parsererror')) {
      throw new Error('errors.noRss')
    }

    const feed = {
      title: doc.querySelector('channel > title')?.textContent ?? '',
      description: doc.querySelector('channel > description')?.textContent ?? '',
    }

    const posts = Array.from(doc.querySelectorAll('item')).map(item => ({
      id: Math.random().toString(36).substring(2),
      title: item.querySelector('title')?.textContent ?? '',
      description: item.querySelector('description')?.textContent ?? '',
      post: item.querySelector('link')?.textContent ?? '',
    }))

    return { feed, posts }
  }
