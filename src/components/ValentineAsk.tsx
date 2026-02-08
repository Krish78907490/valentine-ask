'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'

type Pos = { x: number; y: number }

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export default function ValentineAsk() {
  const [noScale, setNoScale] = useState(1)
  const [yesScale, setYesScale] = useState(1)
  const [noPos, setNoPos] = useState<Pos>({ x: 60, y: 58 })
  const [noAttempts, setNoAttempts] = useState(0)
  const [accepted, setAccepted] = useState(false)

  const firedRef = useRef(false)

  const taunts = useMemo(
    () => [
      'psst… wrong button 😼',
      'nice try 😹',
      'nope! ✨',
      'the universe says YES 🌈',
      'you can’t escape love 💘',
      'ok but… yesss🥹 is right there',
      'are you sure your finger slipped? 🤭',
      'plot twist: NO is shy 🙈',
    ],
    []
  )

  const catGifs = useMemo(
    () => [
      'https://media.giphy.com/media/v6aOjy0Qo1fIA/giphy.gif',
      'https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif',
      'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
      'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif',
      'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif',
      'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif',
    ],
    []
  )

  function moveNoButton() {
    if (accepted) return

    setNoPos({ x: rand(8, 78), y: rand(18, 78) })
    setNoScale((s) => clamp(s * 0.85, 0.25, 1))
    setYesScale((s) => clamp(s * 1.12, 1, 2.6))
    setNoAttempts((n) => n + 1)
  }

  function partyPop() {
    const fire = (ratio: number, opts: confetti.Options) =>
      confetti({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * ratio),
      })

    fire(0.25, { spread: 26, startVelocity: 55 })
    fire(0.2, { spread: 60 })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 })
    fire(0.1, { spread: 120, startVelocity: 25 })
    fire(0.1, { spread: 120, startVelocity: 45 })
  }

  function onYes() {
    setAccepted(true)
    partyPop()
  }

  useEffect(() => {
    if (!accepted || firedRef.current) return
    firedRef.current = true

    const id = setInterval(() => {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { x: Math.random(), y: 0.6 },
      })
    }, 650)

    setTimeout(() => clearInterval(id), 4500)
    return () => clearInterval(id)
  }, [accepted])

  const taunt = taunts[noAttempts % taunts.length]

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-200 via-rose-100 to-red-200 flex items-center justify-center p-6 overflow-hidden">
      <div className="relative w-full max-w-xl">
        <div className="rounded-3xl bg-white/75 backdrop-blur shadow-xl p-8 text-center">
          <h1 className="text-3xl font-extrabold">
            Will you go out with me for Valentine’s Day?
          </h1>

          {!accepted && (
            <p className="mt-3 text-lg">
              {noAttempts === 0 ? 'choose wisely 😇' : taunt}
            </p>
          )}

          <div className="mt-8 flex justify-center gap-6">
            <motion.button
              onClick={onYes}
              animate={{ scale: yesScale }}
              className="rounded-2xl px-6 py-4 text-xl font-bold bg-rose-600 text-white shadow-lg"
            >
              yesss🥹
            </motion.button>
          </div>

          {accepted && (
            <div className="mt-8 grid grid-cols-2 gap-3">
              {catGifs.map((gif) => (
                <img key={gif} src={gif} className="rounded-xl" />
              ))}
              <button
                onClick={partyPop}
                className="col-span-2 mt-4 rounded-xl bg-white py-2 font-semibold shadow"
              >
                party poppers again!! 🥳
              </button>
            </div>
          )}
        </div>

        {!accepted && (
          <motion.button
            onPointerEnter={moveNoButton}
            onPointerDown={moveNoButton}
            animate={{
              left: `${noPos.x}%`,
              top: `${noPos.y}%`,
              scale: noScale,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl px-5 py-3 font-bold bg-white shadow-lg"
          >
            no😭😭
          </motion.button>
        )}
      </div>
    </main>
  )
}
