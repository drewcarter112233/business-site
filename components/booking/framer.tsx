"use client"

import { HTMLMotionProps, motion, MotionProps } from "framer-motion"
import { ReactNode, ButtonHTMLAttributes } from "react"

// Base motion wrapper components
export function FadeInDiv({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
  ...props
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
} & MotionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function FadeInUp({
  children,
  delay = 0,
  className = "",
  ...props
}: {
  children: ReactNode
  delay?: number
  className?: string
} & MotionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function SlideInLeft({
  children,
  delay = 0,
  className = "",
  ...props
}: {
  children: ReactNode
  delay?: number
  className?: string
} & MotionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function SlideInRight({
  children,
  delay = 0,
  className = "",
  ...props
}: {
  children: ReactNode
  delay?: number
  className?: string
} & MotionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({
  children,
  delay = 0,
  className = "",
  ...props
}: {
  children: ReactNode
  delay?: number
  className?: string
} & MotionProps) {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function HoverCard({
  children,
  className = "",
  ...props
}: {
  children: ReactNode
  className?: string
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function HoverButton({
  children,
  className = "",
  onClick,
  ...props
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
} & ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps) {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function StaggeredList({
  children,
  className = "",
  ...props
}: {
  children: ReactNode
  className?: string
} & MotionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedIcon({
  children,
  className = "",
  hoverEffect = true,
  ...props
}: {
  children: ReactNode
  className?: string
  hoverEffect?: boolean
} & MotionProps) {
  return (
    <motion.div
      className={className}
      whileHover={hoverEffect ? { x: -4 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function FeatureCard({
  children,
  index = 0,
  className = "",
  ...props
}: {
  children: ReactNode
  index?: number
  className?: string
} & MotionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
