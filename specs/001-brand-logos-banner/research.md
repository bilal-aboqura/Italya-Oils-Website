# Research: Brand Logos Banner

## Infinite Scroll Marquee Animation

**Decision**: Implement the infinite scroll using CSS keyframes and Tailwind CSS utility classes.
**Rationale**: Native CSS animations run on the GPU, avoiding main thread blockage, providing the smoothest and most performant 60fps scrolling. It avoids pulling in heavier libraries like `framer-motion` for a simple continuous translation effect, keeping the bundle size small.
**Alternatives considered**: 
- `framer-motion` (Overkill for a continuous loop, adds JS overhead)
- React Marquee libraries (Often unmaintained or add unnecessary dependencies)

## Image Optimization

**Decision**: Use Next.js `<Image>` component coupled with Cloudinary for storage.
**Rationale**: Cloudinary automatically optimizes images based on device requests. The Next.js `<Image>` component ensures images are lazy-loaded and suitably sized for the viewport, satisfying our <100KB constraint.
**Alternatives considered**:
- Storing images in MongoDB as Base64 (Antipattern for large images, bloated DB)
- Local filesystem storage (Does not work well in serverless deployments like Vercel)
