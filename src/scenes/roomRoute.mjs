export const ROOM_POSES = {
  home: [0,1.2,12,0], about: [-1.3,1.3,13,.07], journey: [-2,1.6,12,.2],
  ecosystem: [1.2,.9,11.7,-.17], archive: [1.6,.65,13,-.09], lab: [.1,1.7,14,.11],
  people: [-.7,1.3,13,.05], universe: [1.1,.8,12.7,-.12], ethos: [0,1.2,14,0],
  rating: [-.8,1,13,.1], contact: [0,1.25,12.8,0]
};

/** Native section positions define a reversible camera path with no chapter-boundary jump. */
export function roomRoute(anchors, sampleY) {
  const route = anchors.filter(anchor => ROOM_POSES[anchor.id] && Number.isFinite(anchor.top));
  if (!route.length) return { pose: [...ROOM_POSES.home], travel: 0 };
  let index = 0;
  while (index < route.length - 1 && sampleY >= route[index + 1].top) index++;
  const from = route[index], to = route[Math.min(index + 1, route.length - 1)];
  const progress = index === route.length - 1 ? 0 : Math.max(0, Math.min(1, (sampleY - from.top) / Math.max(1, to.top - from.top)));
  // Quintic interpolation keeps velocity and acceleration continuous at every section anchor.
  const blend = progress ** 3 * (progress * (progress * 6 - 15) + 10);
  return {
    pose: ROOM_POSES[from.id].map((value, i) => value + (ROOM_POSES[to.id][i] - value) * blend),
    travel: index + blend
  };
}
