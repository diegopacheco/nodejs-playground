import { useSpring, animated } from '@react-spring/web'
import { useState } from 'react'

function SpringAnimation() {
  const [flip, setFlip] = useState(true)  // Start with true to make it visible initially
  
  const props = useSpring({
    to: { opacity: flip ? 1 : 0, transform: `translateY(${flip ? 0 : 20}px)` },
    from: { opacity: 1, transform: 'translateY(0px)' },  // Start visible
    config: { tension: 280, friction: 20 }
  })

  return (
    <div onClick={() => setFlip(!flip)} style={{ cursor: 'pointer', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
      <animated.div style={props}>
        <h2 style={{ color: '#333' }}>Click me to animate!</h2>
      </animated.div>
    </div>
  )
}

export default SpringAnimation