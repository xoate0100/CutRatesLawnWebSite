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

  return (props: React.ComponentProps<T>) =>
    createElement(Suspense, { fallback }, createElement(LazyComponent, props))
}

/**
 * Type guard to check if a component is a client component
 */
export function isClientComponent(component: any): boolean {
  return typeof component === "function" && component.toString().includes("use client")
}
