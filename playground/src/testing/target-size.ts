const MINIMUM_TARGET_SIZE = 24
const SPACING_CIRCLE_RADIUS = MINIMUM_TARGET_SIZE / 2
const TARGET_SELECTOR = 'a[href], button, input, select, textarea, [role="button"]'

type Point = { x: number; y: number }

const centerOf = (box: DOMRect): Point => ({ x: box.left + box.width / 2, y: box.top + box.height / 2 })

const isUndersized = (box: DOMRect) => box.width < MINIMUM_TARGET_SIZE || box.height < MINIMUM_TARGET_SIZE

const distanceToBox = (point: Point, box: DOMRect) =>
  Math.hypot(Math.max(box.left - point.x, 0, point.x - box.right), Math.max(box.top - point.y, 0, point.y - box.bottom))

const distanceBetween = (first: Point, second: Point) => Math.hypot(first.x - second.x, first.y - second.y)

const spacingCircleClears = (target: DOMRect, other: DOMRect) =>
  distanceToBox(centerOf(target), other) >= SPACING_CIRCLE_RADIUS &&
  (!isUndersized(other) || distanceBetween(centerOf(target), centerOf(other)) >= MINIMUM_TARGET_SIZE)

const meetsTargetSize = (target: Element) => {
  const box = target.getBoundingClientRect()
  const others = Array.from(document.querySelectorAll(TARGET_SELECTOR)).filter((other) => other !== target)
  return !isUndersized(box) || others.every((other) => spacingCircleClears(box, other.getBoundingClientRect()))
}

export const undersizedTargets = (container: Element) =>
  Array.from(container.querySelectorAll(TARGET_SELECTOR)).filter((target) => !meetsTargetSize(target))
