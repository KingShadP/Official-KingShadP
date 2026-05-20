import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Official KingShadP',
    short_name: 'KingShadP',
    description: 'The Official Divine Archive of KingShadP',
    start_url: '/',
    display: 'standalone',
    background_color: '#050203',
    theme_color: '#B21F36',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
