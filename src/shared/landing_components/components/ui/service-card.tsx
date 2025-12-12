"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "./button"
import {  CardContent, CardFooter, CardHeader } from "./card"
import { motion } from "framer-motion";
import { ArrowRight2 } from "iconsax-reactjs";

interface ServiceCardProps {
  id: string
  title: string
  description: string
  image?: string
  primaryAction?: {
    label: string
    onClick?: () => void
  }
  secondaryAction?: {
    label: string
    onClick?: () => void
  }
  className?: string
  gradient?: string
}

export function ServiceCard({
  id,
  title,
  description,
  image,
  primaryAction,
  secondaryAction,
  className,
  gradient,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-card text-card-foreground overflow-hidden ${className}`}
    >
      <div className="flex flex-row h-full relative">
        <div className="flex flex-col justify-between p-6 flex-1">
          <CardHeader className="p-0">
            <div className="text-sm text-muted-foreground mb-2">{id}</div>
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          </CardHeader>
          
          <CardContent className="p-0 py-4">
            <p className="text-sm text-muted-foreground">{description}</p>
          </CardContent>
          
          <CardFooter className="p-0 flex gap-2">
            {primaryAction && (
              <Button 
                variant="default" 
                className="relative overflow-hidden rounded-full group bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary group-hover:scale-105 transition-all duration-300"
              >
                <span className="absolute -inset-px bg-gradient-to-r from-primary-light to-primary rounded-full animate-gradient-x opacity-50 group-hover:opacity-70 blur-sm transition-opacity duration-500"></span>
                <span className="relative flex items-center justify-center">
                  {primaryAction.label}
                  <ArrowRight2 size="18" className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            )}
            {secondaryAction && (
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
          </CardFooter>
        </div>
        
        {image && (
          <div className="w-1/3 relative hidden md:block">
            <Image 
              src={image} 
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        {gradient && (
          <div className={`absolute -top-20 -right-20 w-40 h-40 ${gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
        )}
        
        {/* Vertical text on sides */}
        <div className="absolute left-0 top-0 h-full flex items-center">
          <div className="transform -rotate-90 translate-y-12 origin-bottom-left text-xs text-muted-foreground tracking-widest uppercase">
            Service SMS
          </div>
        </div>
        
        <div className="absolute right-0 top-0 h-full flex items-center">
          <div className="transform rotate-90 translate-y-12 origin-bottom-right text-xs text-muted-foreground tracking-widest uppercase">
            Service SMS
          </div>
        </div>
      </div>
    </motion.div>
  )
}
