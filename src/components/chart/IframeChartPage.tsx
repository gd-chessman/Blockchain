import React, { useEffect, useState } from 'react'

interface IframeChartPageProps {
  token: any;
}

export default function IframeChartPage({ token }: IframeChartPageProps) {
  const [theme, setTheme] = useState('dark')
  const [isLoading, setIsLoading] = useState(true)

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
          setIsLoading(true) // Set loading when theme changes
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
    <div 
    className='rounded'
    style={{ 
      position: 'relative',
      width: '100%',
      height: '470px',
      overflow: 'hidden',
      opacity: isLoading ? 0 : 1,
      transition: 'opacity 0.3s ease-in-out'
    }}>
      <iframe
        src={`https://www.gmgn.cc/kline/sol/${token}?theme=${theme}&interval=1D`}
        className='rounded'
        style={{ 
          width: '100%', 
          height: '500px',
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
        onLoad={() => setIsLoading(false)}
      />
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      )}
    </div>
  )
}
