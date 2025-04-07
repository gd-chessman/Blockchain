import React, { useEffect, useState } from 'react'

interface IframeChartPageProps {
  token: any;
}

export default function IframeChartPage({ token }: IframeChartPageProps) {
  const [isLightTheme, setIsLightTheme] = useState(() => {
    // Check theme immediately on component mount
    return document.documentElement.classList.contains('light')
  })

  useEffect(() => {
    const htmlElement = document.documentElement
    
    // Create a MutationObserver to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          setIsLightTheme(htmlElement.classList.contains('light'))
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
      height: '480px',
      overflow: 'hidden'
    }}>
      <div style={{ display: isLightTheme ? 'none' : 'block' }}>
        <iframe
          src={`https://www.gmgn.cc/kline/sol/${token}?theme=light&interval=5`}
          style={{ 
            width: '100%', 
            height: '520px',
            border: 'none',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
      </div>

      <div style={{ display: isLightTheme ? 'block' : 'none' }}>
        <iframe
          src={`https://www.gmgn.cc/kline/sol/${token}?interval=5`}
          style={{ 
            width: '100%', 
            height: '520px',
            border: 'none',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
      </div>
    </div>
  )
}
