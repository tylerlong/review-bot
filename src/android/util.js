const compareReviews = (old, now) => {
  const delta = []
  for (let i = 0; i < now.length; i++) {
    const id = now[i].reviewId
    if (old.find((review) => { return review.reviewId === id })) {
      break
    }
    delta.push(i + 1)
  }
  return delta
}

module.exports = { compareReviews }
