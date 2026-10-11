import { useEffect, useRef } from 'react';
/** One renderer, multiple clipped viewports; native text and controls stay accessible. */
export default function SpatialWorld() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    import('../scenes/world').then(({ mountWorld }) => {
      if (!disposed && host.current) cleanup = mountWorld(host.current);
    }).catch(() => { document.documentElement.dataset.spatial = 'unavailable'; });
    return () => { disposed = true; cleanup?.(); };
  }, []);
  return <><div className="spatial-world" ref={host} aria-hidden="true"/><div className="global-room" data-spatial="room" aria-hidden="true"/></>;
}
