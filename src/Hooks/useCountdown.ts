import { useEffect, useState } from 'react'

const useCountdown = ({
  targetTimeStamp,
  cycleTimestamp = 24 * 60 * 60 * 1000,
}) => {
  const countDownDate = new Date(targetTimeStamp).getTime()
  const cdTime = countDownDate - new Date().getTime()
  const [countDown, setCountDown] = useState(
    cdTime > 0 ? cdTime : cdTime + cycleTimestamp,
  )
  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(preCountdown =>
        preCountdown <= 0 ? preCountdown + cycleTimestamp : preCountdown - 1000,
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [countDownDate])

  return getReturnValues(countDown)
}

const getReturnValues = countDown => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  )
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000)

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}

export default useCountdown
