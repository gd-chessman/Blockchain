import React, { useEffect, useState } from 'react'

interface IframeChartPageProps {
  token: any;
}

export default function IframeChartPage({ token }: IframeChartPageProps) {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const htmlElement = document.documentElement
    const isLightTheme = htmlElement.classList.contains('light')
    setTheme(isLightTheme ? 'light' : 'dark')

    // Create a MutationObserver to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const isLightTheme = htmlElement.classList.contains('light')
          setTheme(isLightTheme ? 'light' : 'dark')
        }
      })
    })

    // Start observing the HTML element for class changes
    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    // Cleanup observer on component unmount
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      height: '470px',
      overflow: 'hidden'
    }}>
      <iframe
        src={`https://www.gmgn.cc/kline/sol/${token}?theme=${theme}&interval=5`}
        style={{ 
          width: '100%', 
          height: '500px', // Slightly larger to ensure no gap
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
    </div>
  )
}
