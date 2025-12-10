import { useState, useEffect, useMemo } from 'react'

interface ForestVisualizationProps {
  bottleCount: number
  maxTrees?: number
}

// Tree component with falling animation
function Tree({ 
  isCut, 
  delay,
  position 
}: { 
  isCut: boolean
  delay: number
  position: { x: number; y: number; scale: number }
}) {
  const [falling, setFalling] = useState(false)
  const [fallen, setFallen] = useState(false)

  useEffect(() => {
    if (isCut && !fallen) {
      // Start falling animation after delay
      const timer = setTimeout(() => {
        setFalling(true)
        // After fall animation, mark as fallen
        setTimeout(() => {
          setFallen(true)
        }, 800)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [isCut, delay, fallen])

  if (fallen) {
    // Show stump
    return (
      <g 
        transform={`translate(${position.x}, ${position.y}) scale(${position.scale})`}
        className="transition-opacity duration-500"
      >
        {/* Tree stump */}
        <ellipse cx="12" cy="28" rx="6" ry="2" fill="#5d4037" />
        <rect x="8" y="24" width="8" height="4" fill="#6d4c41" />
        {/* Stump rings */}
        <ellipse cx="12" cy="24" rx="4" ry="1.5" fill="#8d6e63" />
        <circle cx="12" cy="24" r="2" fill="#a1887f" stroke="#6d4c41" strokeWidth="0.5" />
      </g>
    )
  }

  return (
    <g 
      transform={`translate(${position.x}, ${position.y}) scale(${position.scale})`}
      className={`transition-all duration-700 origin-bottom ${
        falling ? 'animate-tree-fall' : ''
      }`}
      style={{
        transformOrigin: `${position.x + 12}px ${position.y + 30}px`,
        animation: falling ? 'treeFall 0.8s ease-in forwards' : undefined,
      }}
    >
      {/* Tree trunk */}
      <rect x="10" y="18" width="4" height="12" fill="#5d4037" />
      
      {/* Tree foliage layers */}
      <polygon 
        points="12,0 20,10 16,10 22,18 4,18 8,10 4,10" 
        fill="#2e7d32"
        className="drop-shadow-sm"
      />
      <polygon 
        points="12,4 18,12 14,12 20,20 4,20 10,12 6,12" 
        fill="#388e3c"
      />
      <polygon 
        points="12,8 16,14 14,14 18,22 6,22 10,14 8,14" 
        fill="#43a047"
      />
      
      {/* Snow/highlight on top */}
      <polygon 
        points="12,0 14,3 10,3" 
        fill="#66bb6a"
        opacity="0.7"
      />
    </g>
  )
}

// Axe animation for cutting
function FallingAxe({ show, position }: { show: boolean; position: { x: number; y: number } }) {
  if (!show) return null
  
  return (
    <g 
      className="animate-axe-swing"
      style={{
        animation: 'axeSwing 0.5s ease-out forwards',
        transformOrigin: `${position.x}px ${position.y - 20}px`,
      }}
    >
      {/* Axe handle */}
      <rect 
        x={position.x - 1} 
        y={position.y - 15} 
        width="3" 
        height="20" 
        fill="#8b4513"
        rx="1"
      />
      {/* Axe head */}
      <path 
        d={`M${position.x - 6} ${position.y - 15} 
            L${position.x + 2} ${position.y - 18} 
            L${position.x + 2} ${position.y - 8} 
            L${position.x - 6} ${position.y - 11} Z`}
        fill="#78909c"
      />
    </g>
  )
}

// Sawdust particles
function SawdustParticles({ active, position }: { active: boolean; position: { x: number; y: number } }) {
  if (!active) return null
  
  return (
    <g>
      {[...Array(8)].map((_, i) => (
        <circle
          key={i}
          cx={position.x + 12}
          cy={position.y + 20}
          r="1.5"
          fill="#d7ccc8"
          className="animate-sawdust"
          style={{
            animation: `sawdust 0.6s ease-out forwards`,
            animationDelay: `${i * 0.05}s`,
            '--dx': `${(Math.random() - 0.5) * 30}px`,
            '--dy': `${-Math.random() * 15 - 5}px`,
          } as React.CSSProperties}
        />
      ))}
    </g>
  )
}

export default function ForestVisualization({ 
  bottleCount, 
  maxTrees = 50 
}: ForestVisualizationProps) {
  const [prevBottleCount, setPrevBottleCount] = useState(bottleCount)
  const [cuttingTree, setCuttingTree] = useState<number | null>(null)

  // Generate tree positions (deterministic based on index)
  const treePositions = useMemo(() => {
    const positions: { x: number; y: number; scale: number }[] = []
    const rows = 5
    const cols = Math.ceil(maxTrees / rows)
    
    for (let i = 0; i < maxTrees; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      
      // Add some randomness but keep it deterministic
      const seed = i * 13.37
      const randomX = (Math.sin(seed) * 0.5 + 0.5) * 15 - 7.5
      const randomY = (Math.cos(seed) * 0.5 + 0.5) * 8 - 4
      
      positions.push({
        x: col * 28 + randomX + 10,
        y: row * 35 + randomY + 5,
        scale: 0.8 + (Math.sin(seed * 2) * 0.5 + 0.5) * 0.4,
      })
    }
    
    // Sort by y position for proper layering (back to front)
    return positions.map((pos, idx) => ({ ...pos, originalIndex: idx }))
      .sort((a, b) => a.y - b.y)
  }, [maxTrees])

  // Detect when bottles are added
  useEffect(() => {
    if (bottleCount > prevBottleCount) {
      // A new bottle was added - trigger cutting animation
      const treesToCut = bottleCount - prevBottleCount
      for (let i = 0; i < treesToCut; i++) {
        const treeIndex = prevBottleCount + i
        if (treeIndex < maxTrees) {
          setTimeout(() => {
            setCuttingTree(treeIndex)
            setTimeout(() => setCuttingTree(null), 600)
          }, i * 200)
        }
      }
    }
    setPrevBottleCount(bottleCount)
  }, [bottleCount, prevBottleCount, maxTrees])

  const treesRemaining = Math.max(0, maxTrees - bottleCount)
  const treesPercentage = (treesRemaining / maxTrees) * 100

  return (
    <div className="w-full">
      {/* Forest stats */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-semibold">{treesRemaining}</span>
          <span className="text-gray-400 text-sm">trees remaining</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-400 font-semibold">{Math.min(bottleCount, maxTrees)}</span>
          <span className="text-gray-400 text-sm">trees lost</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-700 rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700 ease-out"
          style={{ width: `${treesPercentage}%` }}
        />
      </div>

      {/* Forest SVG */}
      <div className="relative bg-gradient-to-b from-sky-900/30 via-slate-800/50 to-emerald-900/30 rounded-xl overflow-hidden border border-slate-700/50">
        {/* Sky background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900" />
        
        <svg 
          viewBox="0 0 300 180" 
          className="w-full h-auto relative z-10"
          style={{ minHeight: '180px' }}
        >
          {/* Keyframe animations */}
          <defs>
            <style>{`
              @keyframes treeFall {
                0% { transform: rotate(0deg); opacity: 1; }
                100% { transform: rotate(85deg); opacity: 0; }
              }
              @keyframes axeSwing {
                0% { transform: rotate(-45deg); }
                50% { transform: rotate(15deg); }
                100% { transform: rotate(-45deg); }
              }
              @keyframes sawdust {
                0% { 
                  opacity: 1; 
                  transform: translate(0, 0); 
                }
                100% { 
                  opacity: 0; 
                  transform: translate(var(--dx), var(--dy)); 
                }
              }
              @keyframes sway {
                0%, 100% { transform: rotate(-1deg); }
                50% { transform: rotate(1deg); }
              }
            `}</style>
            
            {/* Ground gradient */}
            <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2d5a27" />
              <stop offset="100%" stopColor="#1a3d16" />
            </linearGradient>
          </defs>

          {/* Ground */}
          <ellipse cx="150" cy="175" rx="160" ry="25" fill="url(#groundGradient)" />
          
          {/* Trees */}
          {treePositions.map((pos) => {
            const originalIndex = pos.originalIndex
            const isCut = originalIndex < bottleCount
            
            return (
              <g key={originalIndex}>
                <Tree
                  isCut={isCut}
                  delay={0}
                  position={pos}
                />
                <SawdustParticles 
                  active={cuttingTree === originalIndex} 
                  position={pos}
                />
              </g>
            )
          })}

          {/* Falling axe animation */}
          {cuttingTree !== null && cuttingTree < treePositions.length && (
            <FallingAxe 
              show={true} 
              position={treePositions.find(p => p.originalIndex === cuttingTree) || { x: 0, y: 0 }}
            />
          )}

          {/* Sun/Moon */}
          <circle cx="260" cy="30" r="15" fill="#fef3c7" opacity="0.8" />
          
          {/* Birds (when forest is healthy) */}
          {treesRemaining > maxTrees * 0.5 && (
            <g className="animate-pulse" style={{ animationDuration: '3s' }}>
              <path d="M40 25 Q45 20 50 25" stroke="#374151" strokeWidth="1.5" fill="none" />
              <path d="M60 35 Q65 30 70 35" stroke="#374151" strokeWidth="1.5" fill="none" />
              <path d="M80 20 Q85 15 90 20" stroke="#374151" strokeWidth="1.5" fill="none" />
            </g>
          )}

          {/* Smoke when deforesting */}
          {bottleCount > 0 && bottleCount < maxTrees && (
            <g opacity="0.3">
              {[...Array(3)].map((_, i) => (
                <circle
                  key={i}
                  cx={50 + i * 100}
                  cy={140}
                  r={8 + i * 2}
                  fill="#9ca3af"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.5}s`, animationDuration: '2s' }}
                />
              ))}
            </g>
          )}

          {/* Message when all trees are gone */}
          {bottleCount >= maxTrees && (
            <text 
              x="150" 
              y="90" 
              textAnchor="middle" 
              className="fill-red-400 text-sm font-semibold"
              fontSize="14"
            >
              Forest depleted
            </text>
          )}
        </svg>

        {/* Overlay message */}
        {bottleCount === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-emerald-400/70 text-sm font-medium bg-slate-900/50 px-4 py-2 rounded-lg">
              A healthy forest - add a bottle to see the impact
            </p>
          </div>
        )}
      </div>

      {/* Environmental impact message */}
      <p className="text-center text-gray-500 text-xs mt-3">
        {bottleCount === 0 
          ? "Each bottle's carbon footprint contributes to deforestation"
          : bottleCount < maxTrees
          ? `${bottleCount} bottle${bottleCount > 1 ? 's' : ''} = ${bottleCount} tree${bottleCount > 1 ? 's' : ''} worth of carbon absorption lost`
          : "The forest has been completely depleted by carbon emissions"
        }
      </p>
    </div>
  )
}
