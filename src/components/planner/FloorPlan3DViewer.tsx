import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { BlueprintData, RoomSpec } from '../../types';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Footprints, 
  Palette, 
  Grid, 
  Eye, 
  EyeOff, 
  Sun, 
  Moon, 
  Sunset, 
  RefreshCw, 
  Compass, 
  Check, 
  Info, 
  Maximize2, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  Home,
  Layers
} from 'lucide-react';

interface FloorPlan3DViewerProps {
  blueprint: BlueprintData;
  projectTitle?: string;
  onClose?: () => void;
}

// Preset Wall Colors
const WALL_COLORS = [
  { name: 'Pure White', hex: '#f8fafc', border: '#e2e8f0' },
  { name: 'Modern Charcoal', hex: '#334155', border: '#1e293b' },
  { name: 'Warm Beige', hex: '#f5f5dc', border: '#e6e6c8' },
  { name: 'Architectural Slate', hex: '#64748b', border: '#475569' },
  { name: 'Sage Green', hex: '#84a98c', border: '#52796f' },
  { name: 'Terracotta', hex: '#c86d51', border: '#9d4a32' },
  { name: 'Muted Ocean Blue', hex: '#4a7c59', border: '#2f5233' },
];

// Preset Floor Tile / Texture Styles
const FLOOR_TILES = [
  { id: 'hardwood', name: 'Hardwood Oak', color: '#c49a6c', roughness: 0.4, metalness: 0.1 },
  { id: 'dark_oak', name: 'Dark Walnut', color: '#5c4033', roughness: 0.3, metalness: 0.1 },
  { id: 'marble', name: 'White Carrara Marble', color: '#f1f5f9', roughness: 0.1, metalness: 0.2 },
  { id: 'slate', name: 'Dark Slate Tile', color: '#1e293b', roughness: 0.7, metalness: 0.1 },
  { id: 'terracotta', name: 'Terracotta Tile', color: '#d97706', roughness: 0.6, metalness: 0.05 },
  { id: 'concrete', name: 'Polished Concrete', color: '#94a3b8', roughness: 0.2, metalness: 0.1 },
  { id: 'carpet', name: 'Soft Beige Carpet', color: '#e2e8f0', roughness: 0.9, metalness: 0.0 },
];

// Lighting Presets
const LIGHTING_PRESETS = [
  { id: 'daylight', name: 'Daylight Sun', bg: '#0f172a', sunIntensity: 1.8, ambientIntensity: 0.8, sunColor: '#fffbeb', skyColor: '#38bdf8' },
  { id: 'sunset', name: 'Golden Hour Sunset', bg: '#1a0b2e', sunIntensity: 2.2, ambientIntensity: 0.6, sunColor: '#fdba74', skyColor: '#f43f5e' },
  { id: 'night', name: 'Night Cozy Warm', bg: '#020617', sunIntensity: 0.3, ambientIntensity: 0.4, sunColor: '#60a5fa', skyColor: '#1e1b4b' },
  { id: 'blueprint', name: 'Studio Neon CAD', bg: '#001a33', sunIntensity: 1.2, ambientIntensity: 1.0, sunColor: '#38bdf8', skyColor: '#0066cc' },
];

// First-Person Walkthrough Controller Component
function FirstPersonWalkthroughController({ 
  active, 
  bounds, 
  keysPressed 
}: { 
  active: boolean; 
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  keysPressed: Record<string, boolean>;
}) {
  const { camera } = useThree();
  const moveSpeed = 0.25;

  useFrame(() => {
    if (!active) return;

    // Movement relative to camera angle
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();

    frontVector.set(0, 0, (keysPressed['KeyS'] || keysPressed['ArrowDown'] ? 1 : 0) - (keysPressed['KeyW'] || keysPressed['ArrowUp'] ? 1 : 0));
    sideVector.set((keysPressed['KeyD'] || keysPressed['ArrowRight'] ? 1 : 0) - (keysPressed['KeyA'] || keysPressed['ArrowLeft'] ? 1 : 0), 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(moveSpeed)
      .applyEuler(camera.rotation);

    // Lock Y to eye level height (5.5 ft above floor)
    camera.position.x += direction.x;
    camera.position.z += direction.z;
    camera.position.y = 5.5;

    // Constrain position inside building bounds + padding
    camera.position.x = Math.max(bounds.minX - 5, Math.min(bounds.maxX + 5, camera.position.x));
    camera.position.z = Math.max(bounds.minZ - 5, Math.min(bounds.maxZ + 5, camera.position.z));
  });

  return null;
}

// 3D Room Furniture Procedural Mesh
function RoomFurnishings({ room }: { room: RoomSpec }) {
  const { widthFt, lengthFt, type, x, y } = room;
  const centerX = x + widthFt / 2;
  const centerZ = y + lengthFt / 2;

  switch (type) {
    case 'bedroom':
      return (
        <group position={[centerX, 0, centerZ]}>
          {/* Bed Base */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[widthFt * 0.45, 1.4, lengthFt * 0.5]} />
            <meshStandardMaterial color="#ffffff" roughness={0.7} />
          </mesh>
          {/* Wooden Headboard */}
          <mesh position={[0, 2.5, -lengthFt * 0.23]} castShadow>
            <boxGeometry args={[widthFt * 0.5, 2.6, 0.4]} />
            <meshStandardMaterial color="#451a03" roughness={0.4} />
          </mesh>
          {/* Pillows */}
          <mesh position={[-widthFt * 0.12, 2.0, -lengthFt * 0.18]}>
            <boxGeometry args={[widthFt * 0.15, 0.4, 1.2]} />
            <meshStandardMaterial color="#e0f2fe" />
          </mesh>
          <mesh position={[widthFt * 0.12, 2.0, -lengthFt * 0.18]}>
            <boxGeometry args={[widthFt * 0.15, 0.4, 1.2]} />
            <meshStandardMaterial color="#e0f2fe" />
          </mesh>
        </group>
      );

    case 'living':
      return (
        <group position={[centerX, 0, centerZ]}>
          {/* L-Sofa */}
          <mesh position={[-widthFt * 0.1, 1.0, 0]} castShadow>
            <boxGeometry args={[widthFt * 0.5, 1.2, lengthFt * 0.35]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
          {/* Coffee Table */}
          <mesh position={[0, 0.7, lengthFt * 0.2]} castShadow>
            <boxGeometry args={[widthFt * 0.3, 0.8, lengthFt * 0.2]} />
            <meshStandardMaterial color="#92400e" roughness={0.3} />
          </mesh>
          {/* Rug */}
          <mesh position={[0, 0.02, 0]}>
            <planeGeometry args={[widthFt * 0.7, lengthFt * 0.7]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
          </mesh>
        </group>
      );

    case 'dining':
      return (
        <group position={[centerX, 0, centerZ]}>
          {/* Dining Table */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <boxGeometry args={[widthFt * 0.4, 0.2, lengthFt * 0.4]} />
            <meshStandardMaterial color="#78350f" roughness={0.3} />
          </mesh>
          {/* Table Legs */}
          <mesh position={[-widthFt * 0.18, 0.7, -lengthFt * 0.18]}>
            <cylinderGeometry args={[0.15, 0.15, 1.4]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[widthFt * 0.18, 0.7, -lengthFt * 0.18]}>
            <cylinderGeometry args={[0.15, 0.15, 1.4]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[-widthFt * 0.18, 0.7, lengthFt * 0.18]}>
            <cylinderGeometry args={[0.15, 0.15, 1.4]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[widthFt * 0.18, 0.7, lengthFt * 0.18]}>
            <cylinderGeometry args={[0.15, 0.15, 1.4]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      );

    case 'kitchen':
      return (
        <group position={[x + widthFt * 0.25, 0, y + lengthFt * 0.25]}>
          {/* Kitchen Island Counter */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[widthFt * 0.6, 1.6, lengthFt * 0.3]} />
            <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.2} />
          </mesh>
          {/* Marble Countertop */}
          <mesh position={[0, 2.35, 0]}>
            <boxGeometry args={[widthFt * 0.62, 0.1, lengthFt * 0.32]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.1} />
          </mesh>
        </group>
      );

    case 'bathroom':
      return (
        <group position={[centerX, 0, centerZ]}>
          {/* Bathtub / Shower */}
          <mesh position={[widthFt * 0.2, 0.9, 0]} castShadow>
            <boxGeometry args={[widthFt * 0.35, 1.2, lengthFt * 0.6]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </mesh>
          {/* Vanity Sink */}
          <mesh position={[-widthFt * 0.2, 1.2, 0]} castShadow>
            <boxGeometry args={[widthFt * 0.25, 1.4, lengthFt * 0.35]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>
        </group>
      );

    case 'office':
      return (
        <group position={[centerX, 0, centerZ]}>
          {/* Executive Desk */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[widthFt * 0.5, 1.4, lengthFt * 0.3]} />
            <meshStandardMaterial color="#334155" roughness={0.4} />
          </mesh>
          {/* Monitor */}
          <mesh position={[0, 2.2, -lengthFt * 0.05]}>
            <boxGeometry args={[widthFt * 0.25, 0.8, 0.1]} />
            <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.8} />
          </mesh>
        </group>
      );

    default:
      return null;
  }
}

// Main 3D Scene Component
function House3DScene({
  blueprint,
  wallColor,
  floorTile,
  showRoof,
  roofOpacity,
  selectedRoom,
  onSelectRoom,
  selectedFloor,
}: {
  blueprint: BlueprintData;
  wallColor: string;
  floorTile: typeof FLOOR_TILES[0];
  showRoof: boolean;
  roofOpacity: number;
  selectedRoom: RoomSpec | null;
  onSelectRoom: (room: RoomSpec) => void;
  selectedFloor: number | 'all';
}) {
  const wallHeight = 10;
  const wallThickness = 0.5;

  // Max Bounds
  const maxX = Math.max(...blueprint.rooms.map(r => r.x + r.widthFt), 50);
  const maxZ = Math.max(...blueprint.rooms.map(r => r.y + r.lengthFt), 40);

  // Filter rooms based on selected floor
  const roomsToRender = selectedFloor === 'all'
    ? blueprint.rooms
    : blueprint.rooms.filter(r => (r.floor || 1) === selectedFloor);

  const distinctFloors = Array.from(new Set(blueprint.rooms.map(r => r.floor || 1))).sort((a, b) => a - b);
  const maxFloorNum = Math.max(...distinctFloors, 1);

  return (
    <group position={[-maxX / 2, 0, -maxZ / 2]}>
      
      {/* GROUND / FOUNDATION BASE SLAB */}
      <mesh position={[maxX / 2, -0.4, maxZ / 2]} receiveShadow>
        <boxGeometry args={[maxX + 12, 0.8, maxZ + 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* OUTDOOR GRASS / LANDSCAPE SURROUND */}
      <mesh position={[maxX / 2, -0.8, maxZ / 2]} receiveShadow>
        <planeGeometry args={[maxX + 100, maxZ + 100]} />
        <meshStandardMaterial color="#166534" roughness={0.9} />
      </mesh>

      {/* INTER-STOREY SLABS (When Viewing All Stacked Floors) */}
      {selectedFloor === 'all' && distinctFloors.map((fl) => {
        if (fl === 1) return null;
        const slabY = (fl - 1) * wallHeight;
        return (
          <mesh key={`slab_${fl}`} position={[maxX / 2, slabY - 0.2, maxZ / 2]} receiveShadow castShadow>
            <boxGeometry args={[maxX, 0.4, maxZ]} />
            <meshStandardMaterial color="#334155" roughness={0.5} />
          </mesh>
        );
      })}

      {/* ROOM FLOORS & WALLS */}
      {roomsToRender.map((room) => {
        const isSelected = selectedRoom?.id === room.id;
        const { x, y, widthFt, lengthFt, name, id } = room;
        const roomFloor = room.floor || 1;
        
        // Calculate vertical elevation depending on whether viewing all floors stacked or single floor
        const baseY = selectedFloor === 'all' ? (roomFloor - 1) * wallHeight : 0;

        return (
          <group key={id}>
            
            {/* ROOM FLOOR SLAB */}
            <mesh
              position={[x + widthFt / 2, baseY + 0.05, y + lengthFt / 2]}
              receiveShadow
              onClick={(e) => {
                e.stopPropagation();
                onSelectRoom(room);
              }}
            >
              <boxGeometry args={[widthFt, 0.1, lengthFt]} />
              <meshStandardMaterial
                color={isSelected ? '#38bdf8' : floorTile.color}
                roughness={floorTile.roughness}
                metalness={floorTile.metalness}
              />
            </mesh>

            {/* 3D STAIRCASE TREADS IF ROOM TYPE IS STAIRCASE */}
            {room.type === 'staircase' && (
              <group position={[x + widthFt / 2, baseY, y + lengthFt / 2]}>
                {Array.from({ length: 8 }, (_, sIdx) => (
                  <mesh
                    key={sIdx}
                    position={[0, sIdx * (wallHeight / 8) + 0.2, (sIdx - 4) * (lengthFt / 10)]}
                    castShadow
                  >
                    <boxGeometry args={[widthFt * 0.8, 0.4, lengthFt / 8]} />
                    <meshStandardMaterial color="#f59e0b" roughness={0.4} />
                  </mesh>
                ))}
              </group>
            )}

            {/* ROOM TITLE 3D HTML BADGE */}
            <Html
              position={[x + widthFt / 2, baseY + 0.2, y + lengthFt / 2]}
              center
              distanceFactor={35}
              style={{ pointerEvents: 'none' }}
            >
              <div className={`px-2.5 py-1 rounded-xl text-[11px] font-bold shadow-lg border transition-all ${
                isSelected 
                  ? 'bg-blue-600 text-white border-blue-400 scale-110' 
                  : 'bg-slate-950/80 text-slate-200 border-slate-700/80'
              }`}>
                {name} <span className="opacity-75 font-mono">({room.areaSqFt} sq ft - Fl {roomFloor})</span>
              </div>
            </Html>

            {/* FURNISHINGS INSIDE ROOM */}
            <group position={[0, baseY, 0]}>
              <RoomFurnishings room={room} />
            </group>

            {/* NORTH WALL (TOP) */}
            <mesh position={[x + widthFt / 2, baseY + wallHeight / 2, y]} castShadow receiveShadow>
              <boxGeometry args={[widthFt, wallHeight, wallThickness]} />
              <meshStandardMaterial color={wallColor} roughness={0.5} />
            </mesh>

            {/* SOUTH WALL (BOTTOM - WITH DOOR GAPS) */}
            <mesh position={[x + widthFt * 0.25, baseY + wallHeight / 2, y + lengthFt]} castShadow receiveShadow>
              <boxGeometry args={[widthFt * 0.4, wallHeight, wallThickness]} />
              <meshStandardMaterial color={wallColor} roughness={0.5} />
            </mesh>
            <mesh position={[x + widthFt * 0.85, baseY + wallHeight / 2, y + lengthFt]} castShadow receiveShadow>
              <boxGeometry args={[widthFt * 0.3, wallHeight, wallThickness]} />
              <meshStandardMaterial color={wallColor} roughness={0.5} />
            </mesh>
            {/* Door Lintel Header */}
            <mesh position={[x + widthFt * 0.525, baseY + wallHeight - 1.25, y + lengthFt]} castShadow>
              <boxGeometry args={[widthFt * 0.25, 2.5, wallThickness]} />
              <meshStandardMaterial color={wallColor} roughness={0.5} />
            </mesh>

            {/* 3D DOOR PANEL */}
            <group position={[x + widthFt * 0.45, baseY, y + lengthFt]}>
              {/* Door Frame */}
              <mesh position={[0, 3.5, 0]}>
                <boxGeometry args={[2.8, 7.0, 0.2]} />
                <meshStandardMaterial color="#451a03" roughness={0.3} />
              </mesh>
              {/* Angled Door Blade */}
              <mesh position={[1.0, 3.5, 0.8]} rotation={[0, -Math.PI / 4, 0]} castShadow>
                <boxGeometry args={[2.5, 6.8, 0.15]} />
                <meshStandardMaterial color="#78350f" roughness={0.4} />
              </mesh>
              {/* Brass Door Handle */}
              <mesh position={[2.1, 3.5, 1.0]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>

            {/* WEST WALL (LEFT) */}
            <mesh position={[x, baseY + wallHeight / 2, y + lengthFt / 2]} castShadow receiveShadow>
              <boxGeometry args={[wallThickness, wallHeight, lengthFt]} />
              <meshStandardMaterial color={wallColor} roughness={0.5} />
            </mesh>

            {/* EAST WALL (RIGHT - WITH WINDOW GLASS) */}
            <mesh position={[x + widthFt, baseY + wallHeight / 2, y + lengthFt * 0.25]} castShadow receiveShadow>
              <boxGeometry args={[wallThickness, wallHeight, lengthFt * 0.35]} />
              <meshStandardMaterial color={wallColor} roughness={0.5} />
            </mesh>
            <mesh position={[x + widthFt, baseY + wallHeight / 2, y + lengthFt * 0.85]} castShadow receiveShadow>
              <boxGeometry args={[wallThickness, wallHeight, lengthFt * 0.25]} />
              <meshStandardMaterial color={wallColor} roughness={0.5} />
            </mesh>
            {/* Window Top & Bottom Wall Spandrels */}
            <mesh position={[x + widthFt, baseY + 1.5, y + lengthFt * 0.55]} castShadow>
              <boxGeometry args={[wallThickness, 3.0, lengthFt * 0.25]} />
              <meshStandardMaterial color={wallColor} roughness={0.5} />
            </mesh>
            <mesh position={[x + widthFt, baseY + 8.5, y + lengthFt * 0.55]} castShadow>
              <boxGeometry args={[wallThickness, 3.0, lengthFt * 0.25]} />
              <meshStandardMaterial color={wallColor} roughness={0.5} />
            </mesh>

            {/* 3D THERMAL GLASS WINDOW */}
            <mesh position={[x + widthFt, baseY + 5.0, y + lengthFt * 0.55]}>
              <boxGeometry args={[0.1, 4.0, lengthFt * 0.25]} />
              <meshStandardMaterial
                color="#38bdf8"
                transparent
                opacity={0.45}
                roughness={0.1}
                metalness={0.9}
              />
            </mesh>

          </group>
        );
      })}

      {/* OVERALL ROOF STRUCTURE ON TOP STOREY */}
      {showRoof && (
        <group position={[maxX / 2, (selectedFloor === 'all' ? maxFloorNum * wallHeight : wallHeight) + 0.5, maxZ / 2]}>
          {/* Main Flat/Parapet Roof Slab */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[maxX + 2, 0.8, maxZ + 2]} />
            <meshStandardMaterial
              color="#334155"
              transparent
              opacity={roofOpacity}
              roughness={0.6}
            />
          </mesh>
          {/* Solar Panel Array on Roof */}
          {blueprint.solarFeasibilityScore > 70 && (
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[maxX * 0.6, 0.1, maxZ * 0.5]} />
              <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
            </mesh>
          )}
        </group>
      )}

    </group>
  );
}

export const FloorPlan3DViewer: React.FC<FloorPlan3DViewerProps> = ({
  blueprint,
  projectTitle = '3D Architectural Model',
  onClose,
}) => {
  const [wallColor, setWallColor] = useState<string>(WALL_COLORS[0].hex);
  const [selectedFloorTile, setSelectedFloorTile] = useState(FLOOR_TILES[0]);
  const [lightingPreset, setLightingPreset] = useState(LIGHTING_PRESETS[0]);
  const [showRoof, setShowRoof] = useState<boolean>(true);
  const [roofOpacity, setRoofOpacity] = useState<number>(0.35); // semi-transparent by default
  const [isWalkthrough, setIsWalkthrough] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomSpec | null>(null);
  const [selected3DFloor, setSelected3DFloor] = useState<number | 'all'>('all');

  const total3DFloorsCount = Math.max(1, blueprint.floors || 1, ...blueprint.rooms.map(r => r.floor || 1));
  const distinct3DFloors = Array.from(new Set(blueprint.rooms.map(r => r.floor || 1))).sort((a, b) => a - b);

  const getFloorName = (flNum: number) => {
    if (flNum === 1) return 'Ground Floor';
    if (flNum === 2) return 'First Floor';
    if (flNum === 3) return 'Second Floor';
    if (flNum > (blueprint.floors || 1)) return 'Terrace / Roof';
    return `Floor ${flNum}`;
  };

  const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({});

  // Bounds
  const maxX = Math.max(...blueprint.rooms.map(r => r.x + r.widthFt), 50);
  const maxZ = Math.max(...blueprint.rooms.map(r => r.y + r.lengthFt), 40);

  const controlsRef = useRef<any>(null);

  // Keyboard Listeners for WASD Walkthrough
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed((prev) => ({ ...prev, [e.code]: true }));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed((prev) => ({ ...prev, [e.code]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Reset Camera Position
  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.object.position.set(maxX * 0.8, 35, maxZ * 1.1);
      controlsRef.current.update();
    }
  };

  // Move camera into room center
  const handleFocusRoom = (room: RoomSpec) => {
    setSelectedRoom(room);
    if (controlsRef.current) {
      const roomCenterX = room.x + room.widthFt / 2 - maxX / 2;
      const roomCenterZ = room.y + room.lengthFt / 2 - maxZ / 2;
      controlsRef.current.target.set(roomCenterX, 2, roomCenterZ);
      controlsRef.current.object.position.set(roomCenterX + 8, 12, roomCenterZ + 12);
      controlsRef.current.update();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col space-y-0 relative">
      
      {/* HEADER CONTROL BAR */}
      <div className="p-4 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs z-20">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" /> 3D Architectural Model & Walkthrough
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Rendered with Three.js & React Three Fiber. Rotate, zoom, walk through rooms, and customize colors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          
          {/* 3D Floor Level Selector Tabs */}
          {total3DFloorsCount > 1 && (
            <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setSelected3DFloor('all')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  selected3DFloor === 'all' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" /> Stacked 3D
              </button>
              {distinct3DFloors.map((fl) => (
                <button
                  key={fl}
                  onClick={() => setSelected3DFloor(fl)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selected3DFloor === fl ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {getFloorName(fl)}
                </button>
              ))}
            </div>
          )}

          {/* Walkthrough Mode Toggle */}
          <button
            onClick={() => {
              setIsWalkthrough(!isWalkthrough);
              if (!isWalkthrough) {
                setShowRoof(false); // Hide roof when entering first person walkthrough!
              }
            }}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              isWalkthrough
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            <Footprints className="w-4 h-4 text-emerald-300" />
            <span>{isWalkthrough ? 'Walkthrough Mode (Active)' : 'Enter First-Person Walkthrough'}</span>
          </button>

          {/* Reset Camera Button */}
          <button
            onClick={handleResetCamera}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold border border-slate-800 flex items-center gap-1.5 transition-all"
            title="Reset Camera View"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Camera
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
            >
              Close
            </button>
          )}

        </div>
      </div>

      {/* THREE.JS CANVAS CONTAINER */}
      <div className="relative w-full h-[620px] bg-slate-950 overflow-hidden">
        
        <Canvas shadows>
          <PerspectiveCamera
            makeDefault
            position={[maxX * 0.8, 35, maxZ * 1.1]}
            fov={50}
          />

          {/* Orbit Controls (Active when not in Walkthrough mode) */}
          <OrbitControls
            ref={controlsRef}
            enabled={!isWalkthrough}
            enableDamping
            dampingFactor={0.05}
            minDistance={8}
            maxDistance={120}
            maxPolarAngle={Math.PI / 2 - 0.05} // Keep camera above floor
          />

          {/* First Person Walkthrough Controller */}
          <FirstPersonWalkthroughController
            active={isWalkthrough}
            bounds={{ minX: -maxX / 2, maxX: maxX / 2, minZ: -maxZ / 2, maxZ: maxZ / 2 }}
            keysPressed={keysPressed}
          />

          {/* LIGHTING & ATMOSPHERE */}
          <color attach="background" args={[lightingPreset.bg]} />
          <ambientLight intensity={lightingPreset.ambientIntensity} />
          <directionalLight
            position={[30, 50, 30]}
            intensity={lightingPreset.sunIntensity}
            color={lightingPreset.sunColor}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <hemisphereLight
            args={[lightingPreset.skyColor, '#0f172a', 0.6]}
          />

          {/* HOUSE MODEL */}
          <House3DScene
            blueprint={blueprint}
            wallColor={wallColor}
            floorTile={selectedFloorTile}
            showRoof={showRoof}
            roofOpacity={roofOpacity}
            selectedRoom={selectedRoom}
            onSelectRoom={setSelectedRoom}
            selectedFloor={selected3DFloor}
          />
        </Canvas>

        {/* OVERLAY ON-SCREEN CONTROLS & CUSTOMIZATION PANELS */}
        
        {/* Left Side: Customization Drawer */}
        <div className="absolute top-4 left-4 z-10 w-72 bg-slate-950/85 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 shadow-2xl space-y-4 text-xs">
          
          {/* Wall Color Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-blue-400" /> Change Wall Color
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {WALL_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setWallColor(c.hex)}
                  title={c.name}
                  className={`h-7 rounded-lg border transition-all flex items-center justify-center ${
                    wallColor === c.hex ? 'ring-2 ring-blue-500 scale-105 border-white' : 'border-slate-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {wallColor === c.hex && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                </button>
              ))}
            </div>
          </div>

          {/* Floor Tile / Texture Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" /> Change Floor Tiles
            </label>
            <select
              value={selectedFloorTile.id}
              onChange={(e) => {
                const found = FLOOR_TILES.find(t => t.id === e.target.value);
                if (found) setSelectedFloorTile(found);
              }}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            >
              {FLOOR_TILES.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Roof Control */}
          <div className="space-y-2 pt-1 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-amber-400" /> Roof Structure
              </label>
              <button
                onClick={() => setShowRoof(!showRoof)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  showRoof ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {showRoof ? 'Roof Visible' : 'Roof Hidden'}
              </button>
            </div>

            {showRoof && (
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Roof Transparency</span>
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={roofOpacity}
                  onChange={(e) => setRoofOpacity(Number(e.target.value))}
                  className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            )}
          </div>

          {/* Atmosphere Lighting Selector */}
          <div className="pt-1 border-t border-slate-800/80">
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-yellow-400" /> Lighting Atmosphere
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {LIGHTING_PRESETS.map((lp) => (
                <button
                  key={lp.id}
                  onClick={() => setLightingPreset(lp)}
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all text-left truncate border ${
                    lightingPreset.id === lp.id 
                      ? 'bg-blue-600 text-white border-blue-400' 
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {lp.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Quick Room Jump Buttons */}
        <div className="absolute top-4 right-4 z-10 w-48 bg-slate-950/85 backdrop-blur-md border border-slate-800/80 rounded-2xl p-3 shadow-2xl text-xs space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jump Camera To Room</span>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {blueprint.rooms.map((r) => (
              <button
                key={r.id}
                onClick={() => handleFocusRoom(r)}
                className={`w-full px-2.5 py-1.5 rounded-xl text-left text-[11px] font-semibold transition-all flex items-center justify-between ${
                  selectedRoom?.id === r.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="truncate">{r.name}</span>
                <span className="text-[9px] font-mono opacity-80">{r.areaSqFt} sq ft</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Walkthrough Instructions & Virtual D-Pad */}
        {isWalkthrough && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-slate-950/90 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-3 px-6 shadow-2xl flex items-center gap-6 text-xs animate-fade-in">
            <div>
              <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Footprints className="w-4 h-4" /> First-Person Walkthrough Active
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Use <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-emerald-400 font-mono font-bold">W</kbd>{' '}
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-emerald-400 font-mono font-bold">A</kbd>{' '}
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-emerald-400 font-mono font-bold">S</kbd>{' '}
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-emerald-400 font-mono font-bold">D</kbd> or Arrow Keys to walk through rooms.
              </p>
            </div>

            {/* Virtual On-Screen Movement Buttons */}
            <div className="grid grid-cols-3 gap-1">
              <div />
              <button
                onMouseDown={() => setKeysPressed((p) => ({ ...p, KeyW: true }))}
                onMouseUp={() => setKeysPressed((p) => ({ ...p, KeyW: false }))}
                onTouchStart={() => setKeysPressed((p) => ({ ...p, KeyW: true }))}
                onTouchEnd={() => setKeysPressed((p) => ({ ...p, KeyW: false }))}
                className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white font-bold transition-colors"
                title="Walk Forward"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <div />

              <button
                onMouseDown={() => setKeysPressed((p) => ({ ...p, KeyA: true }))}
                onMouseUp={() => setKeysPressed((p) => ({ ...p, KeyA: false }))}
                onTouchStart={() => setKeysPressed((p) => ({ ...p, KeyA: true }))}
                onTouchEnd={() => setKeysPressed((p) => ({ ...p, KeyA: false }))}
                className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white font-bold transition-colors"
                title="Strafe Left"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>

              <button
                onMouseDown={() => setKeysPressed((p) => ({ ...p, KeyS: true }))}
                onMouseUp={() => setKeysPressed((p) => ({ ...p, KeyS: false }))}
                onTouchStart={() => setKeysPressed((p) => ({ ...p, KeyS: true }))}
                onTouchEnd={() => setKeysPressed((p) => ({ ...p, KeyS: false }))}
                className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white font-bold transition-colors"
                title="Walk Backward"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              <button
                onMouseDown={() => setKeysPressed((p) => ({ ...p, KeyD: true }))}
                onMouseUp={() => setKeysPressed((p) => ({ ...p, KeyD: false }))}
                onTouchStart={() => setKeysPressed((p) => ({ ...p, KeyD: true }))}
                onTouchEnd={() => setKeysPressed((p) => ({ ...p, KeyD: false }))}
                className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 text-white font-bold transition-colors"
                title="Strafe Right"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
