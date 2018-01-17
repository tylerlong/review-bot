const compareReviews = (old, now) => {
  const delta = []
  for (let i = 0; i < now.length; i++) {
    const id = now[i].review_id
    if (
      old.find(review => {
        return review.review_id === id
      })
    ) {
      break
    }
    delta.push(i + 1)
  }
  return delta
}

const mergeReviews = (old, now) => {
  const merged = []
  for (let i = 0; i < now.length; i++) {
    const id = now[i].review_id
    if (
      !merged.find(review => {
        return review.review_id === id
      })
    ) {
      merged.push(now[i])
    }
  }
  for (let i = 0; i < old.length; i++) {
    const id = old[i].review_id
    if (
      !merged.find(review => {
        return review.review_id === id
      })
    ) {
      merged.push(old[i])
    }
  }
  return merged
}

module.exports = { compareReviews, mergeReviews }
