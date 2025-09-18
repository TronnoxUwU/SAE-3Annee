import Gallery from 'react-photo-gallery'

const photos = [
  { src: '/images/photo1.jpg', width: 4, height: 3 },
  { src: '/images/photo2.jpg', width: 1, height: 1 },
]

export default function MaGalerie() {
  return <Gallery photos={photos} />
}
