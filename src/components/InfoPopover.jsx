'use client'

import * as Popover from '@radix-ui/react-popover'
import { Info, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function InfoPopover({ content, link, linkText = 'Read more' }) {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showSheet, setShowSheet] = useState(false)

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close on scroll
  useEffect(() => {
    const closeOnScroll = () => setOpen(false)
    window.addEventListener('scroll', closeOnScroll)
    return () => window.removeEventListener('scroll', closeOnScroll)
  }, [])

  // Handle animation mount/unmount
  useEffect(() => {
    if (open) {
      setShowSheet(true)
    } else {
      const timeout = setTimeout(() => setShowSheet(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [open])

  return (
    <>
      {isMobile ? (
        <>
          <button
            onClick={() => setOpen(true)}
            className="text-gray-600 hover:text-black p-1"
            aria-label="More info"
          >
            <Info className="w-5 h-5" />
          </button>

          {showSheet && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
              <div
                className={`bg-white dark:bg-zinc-900 rounded-t-2xl w-full max-w-md p-6 shadow-xl transform transition-transform duration-300 ${
                  open ? 'translate-y-0' : 'translate-y-full'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="text-sm text-zinc-700 dark:text-zinc-200">{content}</p>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
                {link && (
                  <a
                    href={link}
                    className="text-blue-500 underline text-sm hover:text-blue-400"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {linkText}
                  </a>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-600 hover:text-black p-1"
              aria-label="More info"
            >
              <Info className="w-5 h-5" />
            </button>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              side="top"
              align="start"
              sideOffset={8}
              className="bg-gray-800 text-white text-sm p-4 rounded-lg shadow-lg w-72 z-50"
            >
              <p className="mb-2">{content}</p>
              {link && (
                <a
                  href={link}
                  className="underline text-blue-400 hover:text-blue-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {linkText}
                </a>
              )}
              <Popover.Arrow className="fill-gray-800" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )}
    </>
  )
}