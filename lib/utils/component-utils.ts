import type React from "react"
import { createElement, type ComponentType, lazy, Suspense } from "react"

/**
 * Lazy load a client component with suspense
 */
export function lazyLoadComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  fallback: React.ReactNode = null,
) {
  const LazyComponent = lazy(factory)

  function LazyLoaded(props: React.ComponentProps<T>) {
    return createElement(Suspense, { fallback }, createElement(LazyComponent, props))
  }
  LazyLoaded.displayName = "LazyLoadedComponent"
  return LazyLoaded
}

/**
 * Type guard to check if a component is a client component
 */
export function isClientComponent(component: any): boolean {
  return typeof component === "function" && component.toString().includes("use client")
}
