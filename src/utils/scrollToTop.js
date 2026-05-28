export function scrollToTop(smooth = true) {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: smooth ? 'smooth' : 'instant',
  })
}
