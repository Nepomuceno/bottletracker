import { useState, useEffect, useMemo } from 'react'

interface ForestVisualizationProps {
  bottleCount: number
}

// Tree component with falling animation
function Tree({ 
  isCut, 
  position 
}: { 
  isCut: boolean
  position: { x: number; y: number; scale: number }
}) {
  const [fallen, setFallen] = useState(isCut)

  useEffect(() => {
    if (isCut && !fallen) {
      // Small delay then mark as fallen
      const timer = setTimeout(() => {
        setFallen(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isCut, fallen])

  if (fallen || isCut) {
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

export default function ForestVisualization({ 
  bottleCount 
}: ForestVisualizationProps) {
  // Dynamic tree count - always have more trees than bottles
  // Minimum 100 trees, grows as bottles increase
  const totalTrees = useMemo(() => {
    const baseForest = 100
    const buffer = 50 // Always show at least 50 more trees than bottles
    return Math.max(baseForest, bottleCount + buffer)
  }, [bottleCount])

  // Calculate grid dimensions based on total trees
  const gridConfig = useMemo(() => {
    const cols = Math.ceil(Math.sqrt(totalTrees * 1.5)) // Wider than tall
    const rows = Math.ceil(totalTrees / cols)
    const treeWidth = 24
    const treeHeight = 32
    const viewWidth = cols * treeWidth + 40
    const viewHeight = rows * treeHeight + 60
    return { cols, rows, treeWidth, treeHeight, viewWidth, viewHeight }
  }, [totalTrees])

  // Generate tree positions (deterministic based on index)
  const treePositions = useMemo(() => {
    const { cols, treeWidth, treeHeight } = gridConfig
    const positions: { x: number; y: number; scale: number; originalIndex: number }[] = []
    
    for (let i = 0; i < totalTrees; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      
      // Add some randomness but keep it deterministic
      const seed = i * 13.37
      const randomX = (Math.sin(seed) * 0.5 + 0.5) * 10 - 5
      const randomY = (Math.cos(seed) * 0.5 + 0.5) * 6 - 3
      
      positions.push({
        x: col * treeWidth + randomX + 15,
        y: row * treeHeight + randomY + 10,
        scale: 0.7 + (Math.sin(seed * 2) * 0.5 + 0.5) * 0.3,
        originalIndex: i,
      })
    }
    
    // Sort by y position for proper layering (back to front)
    return positions.sort((a, b) => a.y - b.y)
  }, [totalTrees, gridConfig])

  const treesRemaining = totalTrees - bottleCount
  const treesPercentage = (treesRemaining / totalTrees) * 100
  const healthStatus = treesPercentage > 70 ? 'healthy' : treesPercentage > 40 ? 'stressed' : treesPercentage > 10 ? 'critical' : 'devastated'

  return (
    <div className="w-full">
      {/* Forest stats */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-semibold">{treesRemaining.toLocaleString()}</span>
          <span className="text-gray-400 text-sm">trees remaining</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${
            healthStatus === 'healthy' ? 'text-emerald-400' :
            healthStatus === 'stressed' ? 'text-yellow-400' :
            healthStatus === 'critical' ? 'text-orange-400' : 'text-red-400'
          }`}>
            {healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1)}
          </span>
          <span className="text-gray-400 text-sm">forest status</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-400 font-semibold">{bottleCount.toLocaleString()}</span>
          <span className="text-gray-400 text-sm">trees lost</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-700 rounded-full mb-4 overflow-hidden">
        <div 
          className={`h-full transition-all duration-700 ease-out ${
            healthStatus === 'healthy' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
            healthStatus === 'stressed' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
            healthStatus === 'critical' ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
            'bg-gradient-to-r from-red-500 to-red-400'
          }`}
          style={{ width: `${treesPercentage}%` }}
        />
      </div>

      {/* Forest SVG */}
      <div className="relative bg-gradient-to-b from-sky-900/30 via-slate-800/50 to-emerald-900/30 rounded-xl overflow-hidden border border-slate-700/50">
        {/* Sky background */}
        <div className={`absolute inset-0 transition-colors duration-1000 ${
          healthStatus === 'healthy' ? 'bg-gradient-to-b from-slate-800 to-slate-900' :
          healthStatus === 'stressed' ? 'bg-gradient-to-b from-slate-800 to-amber-950/30' :
          healthStatus === 'critical' ? 'bg-gradient-to-b from-orange-950/30 to-slate-900' :
          'bg-gradient-to-b from-red-950/40 to-slate-900'
        }`} />
        
        <svg 
          viewBox={`0 0 ${gridConfig.viewWidth} ${gridConfig.viewHeight}`}
          className="w-full h-auto relative z-10"
          style={{ minHeight: '200px', maxHeight: '400px' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Keyframe animations */}
          <defs>
            <style>{`
              @keyframes sway {
                0%, 100% { transform: rotate(-0.5deg); }
                50% { transform: rotate(0.5deg); }
              }
            `}</style>
            
            {/* Ground gradient */}
            <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={healthStatus === 'devastated' ? '#4a3728' : '#2d5a27'} />
              <stop offset="100%" stopColor={healthStatus === 'devastated' ? '#2d1f14' : '#1a3d16'} />
            </linearGradient>
          </defs>

          {/* Ground */}
          <ellipse 
            cx={gridConfig.viewWidth / 2} 
            cy={gridConfig.viewHeight - 5} 
            rx={gridConfig.viewWidth / 2 + 20} 
            ry="25" 
            fill="url(#groundGradient)" 
          />
          
          {/* Trees */}
          {treePositions.map((pos) => {
            const isCut = pos.originalIndex < bottleCount
            
            return (
              <Tree
                key={pos.originalIndex}
                isCut={isCut}
                position={pos}
              />
            )
          })}

          {/* Sun/Moon - changes based on health */}
          <circle 
            cx={gridConfig.viewWidth - 40} 
            cy="30" 
            r="20" 
            fill={healthStatus === 'healthy' ? '#fef3c7' : healthStatus === 'stressed' ? '#fde68a' : '#f97316'}
            opacity={healthStatus === 'devastated' ? 0.5 : 0.8} 
          />
          
          {/* Birds (when forest is healthy) */}
          {healthStatus === 'healthy' && (
            <g className="animate-pulse" style={{ animationDuration: '3s' }}>
              <path d="M40 25 Q45 20 50 25" stroke="#374151" strokeWidth="1.5" fill="none" />
              <path d="M70 35 Q75 30 80 35" stroke="#374151" strokeWidth="1.5" fill="none" />
              <path d="M100 20 Q105 15 110 20" stroke="#374151" strokeWidth="1.5" fill="none" />
            </g>
          )}

          {/* Smoke/haze when stressed or worse */}
          {(healthStatus === 'critical' || healthStatus === 'devastated') && (
            <g opacity="0.4">
              {[...Array(5)].map((_, i) => (
                <circle
                  key={i}
                  cx={30 + i * (gridConfig.viewWidth / 5)}
                  cy={gridConfig.viewHeight - 50}
                  r={12 + i * 3}
                  fill="#9ca3af"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s`, animationDuration: '2s' }}
                />
              ))}
            </g>
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
          : `${bottleCount.toLocaleString()} bottle${bottleCount !== 1 ? 's' : ''} shipped = ${bottleCount.toLocaleString()} tree${bottleCount !== 1 ? 's' : ''} worth of carbon absorption lost`
        }
      </p>
      
      {/* Scale indicator */}
      <p className="text-center text-gray-600 text-xs mt-1">
        Forest grows to show impact at scale
      </p>
    </div>
  )
}
