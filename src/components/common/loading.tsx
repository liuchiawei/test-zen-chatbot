"use client"

import { motion, Variants } from "motion/react"

function LoadingThreeDotsJumping() {
  const dotVariants: Variants = {
    jump: {
      y: -30,
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    },
  }
  return (
    <motion.div
      animate="jump"
      transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
      className="flex justify-center items-center gap-2 w-full max-w-40"
    >
      <motion.div className="rounded-full size-2 bg-foreground" variants={dotVariants} />
      <motion.div className="rounded-full size-2 bg-foreground" variants={dotVariants} />
      <motion.div className="rounded-full size-2 bg-foreground" variants={dotVariants} />
    </motion.div>
  )
}

export default LoadingThreeDotsJumping
