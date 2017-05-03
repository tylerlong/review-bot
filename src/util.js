const compareReviews = (old, now) => {
  const delta = []
  for (let i = 0; i < now.length; i++) {
    const id = now[i].id.label
    if (old.find((review) => { return review.id.label === id })) {
      break
    }
    delta.push(id + 1)
  }
  return delta
}

module.exports = { compareReviews }
