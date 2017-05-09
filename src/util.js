const compareReviews = (old, now) => {
  const delta = []
  for (let i = 0; i < now.length; i++) {
    const id = now[i].id.label
    if (old.find((review) => { return review.id.label === id })) {
      break
    }
    delta.push(i + 1)
  }
  return delta
}

const mergeReviews = (old, now) => {
  const merged = []
  for (let i = 0; i < now.length; i++) {
    const id = now[i].id.label
    if (!merged.find((review) => { return review.id.label === id })) {
      merged.push(now[i])
    }
  }
  for (let i = 0; i < old.length; i++) {
    const id = old[i].id.label
    if (!merged.find((review) => { return review.id.label === id })) {
      merged.push(old[i])
    }
  }
  return merged
}

module.exports = { compareReviews, mergeReviews }
