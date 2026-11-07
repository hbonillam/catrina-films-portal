import './style.css'

document.querySelectorAll<HTMLImageElement>('.film-poster__image').forEach((image) => {
  const showFallback = () => {
    image.closest('.film-poster')?.classList.add('film-poster--fallback')
  }

  image.addEventListener('error', showFallback, { once: true })

  if (image.complete && image.naturalWidth === 0) {
    showFallback()
  }
})
