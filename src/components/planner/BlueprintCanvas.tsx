import React, { useState, useRef } from 'react';
import { BlueprintData, RoomSpec } from '../../types';
import { FloorPlan3DViewer } from './FloorPlan3DViewer';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Download, 
  Ruler, 
  Box, 
  Grid, 
  Printer, 
  Sun, 
  Moon, 
  Compass,
  CheckCircle2,
  Save,
  FileText,
  DoorOpen,
  AppWindow,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';

interface BlueprintCanvasProps {
  blueprint: BlueprintData;
  projectTitle: string;
  location?: string;
  onSavePlan?: () => void;
  onUpdateRoom?: (updatedRoom: RoomSpec) => void;
}

export const BlueprintCanvas: React.FC<BlueprintCanvasProps> = ({
  blueprint,
  projectTitle,
  location = 'Site Plot #1',
  onSavePlan,
  onUpdateRoom,
}) => {
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const [blueprintStyle, setBlueprintStyle] = useState<'cad_dark' | 'classic_blue' | 'paper_light'>('cad_dark');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showDoorsWindows, setShowDoorsWindows] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<RoomSpec | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Grid & Scale
  const baseScale = 14 * zoomLevel; // pixels per foot
  const paddingOffset = 80; // offset inside SVG for exterior dimension lines

  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>(1);

  // Compute total floors available
  const totalFloorsCount = Math.max(1, blueprint.floors || 1, ...blueprint.rooms.map(r => r.floor || 1));

  // Get list of distinct floors present in rooms
  const distinctFloors = Array.from(new Set(blueprint.rooms.map(r => r.floor || 1))).sort((a, b) => a - b);

  // Helper for floor display names
  const getFloorName = (flNum: number) => {
    const roomsOnFloor = blueprint.rooms.filter(r => (r.floor || 1) === flNum);
    const isTerraceFloor = roomsOnFloor.some(r => r.type === 'terrace' || r.name.toLowerCase().includes('terrace') || r.name.toLowerCase().includes('roof'));
    if (isTerraceFloor) return 'Terrace / Roof';
    if (flNum === 1) return 'Ground Floor';
    if (flNum === 2) return 'First Floor';
    if (flNum === 3) return 'Second Floor';
    return `Floor ${flNum}`;
  };

  // Filter rooms according to floor selection
  const visibleRooms = selectedFloor === 'all'
    ? blueprint.rooms
    : blueprint.rooms.filter(r => (r.floor || 1) === (typeof selectedFloor === 'number' ? selectedFloor : 1));

  // Compute bounding box of visible rooms or entire site
  const maxX = Math.max(...visibleRooms.map(r => r.x + r.widthFt), (blueprint.gridColumns || 8) * 10);
  const maxY = Math.max(...visibleRooms.map(r => r.y + r.lengthFt), (blueprint.gridRows || 6) * 10);

  const svgWidth = maxX * baseScale + paddingOffset * 2;
  const svgHeight = maxY * baseScale + paddingOffset * 2;

  // Theme Styles mapping
  const getThemeColors = () => {
    switch (blueprintStyle) {
      case 'classic_blue':
        return {
          bg: 'bg-[#002b5c]',
          textPrimary: '#ffffff',
          textSecondary: '#94a3b8',
          gridLine: 'rgba(255, 255, 255, 0.12)',
          outerWall: '#ffffff',
          innerWall: '#e2e8f0',
          wallFill: '#1e3a8a',
          dimensionLine: '#38bdf8',
          doorColor: '#f59e0b',
          windowColor: '#38bdf8',
          labelBg: 'rgba(0, 30, 70, 0.85)',
          pillarFill: '#38bdf8',
        };
      case 'paper_light':
        return {
          bg: 'bg-slate-50',
          textPrimary: '#0f172a',
          textSecondary: '#64748b',
          gridLine: 'rgba(0, 0, 0, 0.06)',
          outerWall: '#0f172a',
          innerWall: '#334155',
          wallFill: '#1e293b',
          dimensionLine: '#2563eb',
          doorColor: '#d97706',
          windowColor: '#0284c7',
          labelBg: 'rgba(255, 255, 255, 0.9)',
          pillarFill: '#0f172a',
        };
      case 'cad_dark':
      default:
        return {
          bg: 'bg-slate-950',
          textPrimary: '#f8fafc',
          textSecondary: '#94a3b8',
          gridLine: 'rgba(255, 255, 255, 0.08)',
          outerWall: '#38bdf8',
          innerWall: '#0284c7',
          wallFill: '#0f172a',
          dimensionLine: '#f59e0b',
          doorColor: '#fbbf24',
          windowColor: '#38bdf8',
          labelBg: 'rgba(15, 23, 42, 0.88)',
          pillarFill: '#38bdf8',
        };
    }
  };

  const colors = getThemeColors();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    if (onSavePlan) {
      onSavePlan();
    } else {
      const saved = JSON.parse(localStorage.getItem('saved_blueprints') || '[]');
      saved.push({
        id: `plan_${Date.now()}`,
        projectTitle,
        blueprint,
        savedAt: new Date().toISOString(),
      });
      localStorage.setItem('saved_blueprints', JSON.stringify(saved));
    }
    showToast('Floor plan saved successfully to workspace!');
  };

  // Download PNG
  const handleDownloadPNG = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        backgroundColor: blueprintStyle === 'paper_light' ? '#f8fafc' : blueprintStyle === 'classic_blue' ? '#002b5c' : '#020617',
        logging: false,
        useCORS: true,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${projectTitle.toLowerCase().replace(/\s+/g, '_')}_2D_Floor_Plan.png`;
      link.click();
      showToast('PNG Floor Plan downloaded successfully!');
    } catch (err) {
      console.error('PNG export failed:', err);
      showToast('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Header Title Block
      pdf.setFillColor(15, 23, 42); // slate-900
      pdf.rect(0, 0, pdfWidth, 18, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text(`${projectTitle} - Architectural 2D Floor Plan`, 10, 12);

      pdf.setFontSize(8);
      pdf.setFont('Helvetica', 'normal');
      pdf.text(`Total Area: ${blueprint.totalAreaSqFt} sq ft  |  Scale: 1:100  |  Date: ${new Date().toLocaleDateString()}`, pdfWidth - 100, 12);

      // Main Canvas Image
      const imgProps = pdf.getImageProperties(imgData);
      const margin = 10;
      const availableWidth = pdfWidth - margin * 2;
      const availableHeight = pdfHeight - 25 - margin;

      let imgWidth = availableWidth;
      let imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      if (imgHeight > availableHeight) {
        imgHeight = availableHeight;
        imgWidth = (imgProps.width * imgHeight) / imgProps.height;
      }

      const xPos = (pdfWidth - imgWidth) / 2;
      pdf.addImage(imgData, 'JPEG', xPos, 22, imgWidth, imgHeight);

      // Save PDF
      pdf.save(`${projectTitle.toLowerCase().replace(/\s+/g, '_')}_2D_Floor_Plan.pdf`);
      showToast('PDF Architectural Plan downloaded successfully!');
    } catch (err) {
      console.error('PDF export error:', err);
      showToast('PDF Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-all ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : ''
    }`}>

      {/* Toast Banner */}
      {toastMessage && (
        <div className="bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2.5 flex items-center justify-between shadow-lg animate-fade-in z-50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-950 hover:opacity-75 font-mono">✕</button>
        </div>
      )}

      {/* Header Controls Toolbar */}
      <div className="p-4 bg-slate-950/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
        
        {/* Left: View Mode & Themes */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode switch */}
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewMode('2D')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewMode === '2D' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" /> 2D CAD Floor Plan
            </button>
            <button
              onClick={() => setViewMode('3D')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewMode === '3D' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" /> Isometric 3D View
            </button>
          </div>

          {/* Floor Selection Tabs */}
          {totalFloorsCount > 1 && (
            <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              {distinctFloors.map((fl) => (
                <button
                  key={fl}
                  onClick={() => setSelectedFloor(fl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    selectedFloor === fl ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  {getFloorName(fl)}
                </button>
              ))}
              <button
                onClick={() => setSelectedFloor('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedFloor === 'all' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Floors (Comparison)
              </button>
            </div>
          )}

          {/* Theme Palette */}
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setBlueprintStyle('cad_dark')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                blueprintStyle === 'cad_dark' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" /> Dark CAD
            </button>
            <button
              onClick={() => setBlueprintStyle('classic_blue')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                blueprintStyle === 'classic_blue' ? 'bg-blue-900 text-blue-200 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Blueprint Blue
            </button>
            <button
              onClick={() => setBlueprintStyle('paper_light')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                blueprintStyle === 'paper_light' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> Paper White
            </button>
          </div>
        </div>

        {/* Right: Toggles & Export Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Toggle Grid */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-all ${
              showGrid ? 'bg-blue-500/10 border-blue-500/40 text-blue-400 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title="Toggle Structural Grid"
          >
            <Grid className="w-3.5 h-3.5" /> Grid
          </button>

          {/* Toggle Dimensions */}
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-all ${
              showDimensions ? 'bg-blue-500/10 border-blue-500/40 text-blue-400 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title="Toggle Wall & Room Dimensions"
          >
            <Ruler className="w-3.5 h-3.5" /> Dimensions
          </button>

          {/* Toggle Doors & Windows */}
          <button
            onClick={() => setShowDoorsWindows(!showDoorsWindows)}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-all ${
              showDoorsWindows ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title="Toggle Doors & Windows Symbols"
          >
            <DoorOpen className="w-3.5 h-3.5" /> Doors & Windows
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 gap-1">
            <button
              onClick={() => setZoomLevel(Math.max(0.6, zoomLevel - 0.15))}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-bold text-slate-300 w-9 text-center">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(2.0, zoomLevel + 0.15))}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-800 my-auto" />

          {/* ACTION BUTTONS: SAVE, PNG, PDF, PRINT */}

          {/* Save Plan */}
          <button
            onClick={handleSave}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
          >
            <Save className="w-3.5 h-3.5" /> Save Plan
          </button>

          {/* Download PNG */}
          <button
            onClick={handleDownloadPNG}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" /> Download PNG
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5" /> Download PDF
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
            title="Print Blueprint"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>

        </div>

      </div>

      {/* Main Canvas Viewport Area */}
      <div
        ref={canvasRef}
        className={`relative w-full ${isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[580px]'} overflow-auto p-8 transition-colors ${colors.bg}`}
      >
        
        {/* Title Block Box (Top Left) */}
        <div className="absolute top-6 left-6 z-10 p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 shadow-xl font-mono text-[11px] text-slate-300 space-y-1 print:border-black print:text-black print:bg-white">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse print:hidden" />
            <h3 className="font-bold text-white uppercase text-xs tracking-wider print:text-black">{projectTitle}</h3>
          </div>
          <p className="text-[10px] text-slate-400 print:text-black">
            Total Footprint: <span className="text-cyan-400 font-bold print:text-black">{blueprint.totalAreaSqFt} sq ft</span> ({blueprint.floors} Floors)
          </p>
          <p className="text-[10px] text-slate-400 print:text-black">Site Context: {location}</p>
          <div className="text-[9px] text-slate-500 pt-1 border-t border-slate-800/80 flex items-center gap-2 print:border-black print:text-black">
            <span>SCALE 1:100</span> • <span>CAD REVISION v2.4</span>
          </div>
        </div>

        {/* Compass Rose (Top Right) */}
        <div className="absolute top-6 right-6 z-10 opacity-80 flex flex-col items-center text-[10px] font-mono text-slate-400 print:text-black">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500/50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md shadow-lg print:border-black">
            <Compass className="w-6 h-6 text-blue-400 print:text-black" />
          </div>
          <span className="font-bold text-white text-[9px] mt-1 tracking-widest print:text-black">NORTH</span>
        </div>

        {/* 2D CAD VECTOR RENDERING ENGINE */}
        {viewMode === '2D' && (() => {
          const renderFloorSVG = (roomsToDraw: RoomSpec[], floorTitle?: string, floorKey?: string) => {
            const fMaxX = Math.max(...roomsToDraw.map(r => r.x + r.widthFt), (blueprint.gridColumns || 8) * 10);
            const fMaxY = Math.max(...roomsToDraw.map(r => r.y + r.lengthFt), (blueprint.gridRows || 6) * 10);
            const fSvgW = fMaxX * baseScale + paddingOffset * 2;
            const fSvgH = fMaxY * baseScale + paddingOffset * 2;

            return (
              <div key={floorKey} className="flex flex-col items-center bg-slate-950/40 p-6 rounded-3xl border border-slate-800/80 shadow-2xl">
                {floorTitle && (
                  <div className="mb-4 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-cyan-300 font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-md">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>{floorTitle} Architectural CAD Plan</span>
                  </div>
                )}
                <svg
                  width={fSvgW}
                  height={fSvgH}
                  viewBox={`0 0 ${fSvgW} ${fSvgH}`}
                  className="transition-all duration-200"
                >
                  <defs>
                    {/* Structural Grid Pattern */}
                    <pattern id={`cadGrid_${floorKey || 'main'}`} width={20 * zoomLevel} height={20 * zoomLevel} patternUnits="userSpaceOnUse">
                      <path d={`M ${20 * zoomLevel} 0 L 0 0 0 ${20 * zoomLevel}`} fill="none" stroke={colors.gridLine} strokeWidth="1" />
                    </pattern>

                    {/* Wood Floor Pattern */}
                    <pattern id="woodPlank" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 0 10 L 20 10 M 10 0 L 10 20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    </pattern>

                    {/* Tile Pattern */}
                    <pattern id="tilePattern" width="12" height="12" patternUnits="userSpaceOnUse">
                      <path d="M 0 0 H 12 V 12 H 0 Z" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
                    </pattern>

                    {/* Grass / Courtyard Pattern */}
                    <pattern id="grassPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1.5" fill="rgba(34,197,94,0.3)" />
                      <circle cx="7" cy="7" r="1.5" fill="rgba(34,197,94,0.3)" />
                    </pattern>

                    {/* Corridor Tile Pattern */}
                    <pattern id="corridorPattern" width="16" height="16" patternUnits="userSpaceOnUse">
                      <rect width="16" height="16" fill="none" stroke="rgba(2,132,199,0.2)" strokeWidth="1" />
                      <line x1="0" y1="8" x2="16" y2="8" stroke="rgba(2,132,199,0.2)" strokeWidth="1" />
                    </pattern>
                  </defs>

                  {/* Background Grid */}
                  {showGrid && (
                    <rect width={fSvgW} height={fSvgH} fill={`url(#cadGrid_${floorKey || 'main'})`} />
                  )}

                  {/* SITE OUTER PLOT BOUNDARY / EXTENSION LINES */}
                  <rect
                    x={paddingOffset - 15}
                    y={paddingOffset - 15}
                    width={fMaxX * baseScale + 30}
                    height={fMaxY * baseScale + 30}
                    fill="none"
                    stroke={colors.dimensionLine}
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                    opacity="0.5"
                  />

                  {/* OVERALL BUILDING EXTERIOR DIMENSION LINES */}
                  {showDimensions && (
                    <g className="overall-dimensions font-mono text-[10px]">
                      {/* Top Total Width Dimension */}
                      <line
                        x1={paddingOffset}
                        y1={paddingOffset - 35}
                        x2={paddingOffset + fMaxX * baseScale}
                        y2={paddingOffset - 35}
                        stroke={colors.dimensionLine}
                        strokeWidth="1.5"
                      />
                      {/* Ticks */}
                      <line x1={paddingOffset} y1={paddingOffset - 42} x2={paddingOffset} y2={paddingOffset - 28} stroke={colors.dimensionLine} strokeWidth="1.5" />
                      <line x1={paddingOffset + fMaxX * baseScale} y1={paddingOffset - 42} x2={paddingOffset + fMaxX * baseScale} y2={paddingOffset - 28} stroke={colors.dimensionLine} strokeWidth="1.5" />
                      <rect x={paddingOffset + (fMaxX * baseScale) / 2 - 40} y={paddingOffset - 46} width="80" height="18" fill={colors.labelBg} rx="4" />
                      <text
                        x={paddingOffset + (fMaxX * baseScale) / 2}
                        y={paddingOffset - 33}
                        fill={colors.textPrimary}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {fMaxX}' - 0" OVERALL
                      </text>

                      {/* Left Total Height Dimension */}
                      <line
                        x1={paddingOffset - 35}
                        y1={paddingOffset}
                        x2={paddingOffset - 35}
                        y2={paddingOffset + fMaxY * baseScale}
                        stroke={colors.dimensionLine}
                        strokeWidth="1.5"
                      />
                      {/* Ticks */}
                      <line x1={paddingOffset - 42} y1={paddingOffset} x2={paddingOffset - 28} y2={paddingOffset} stroke={colors.dimensionLine} strokeWidth="1.5" />
                      <line x1={paddingOffset - 42} y1={paddingOffset + fMaxY * baseScale} x2={paddingOffset - 28} y2={paddingOffset + fMaxY * baseScale} stroke={colors.dimensionLine} strokeWidth="1.5" />
                      <rect x={paddingOffset - 72} y={paddingOffset + (fMaxY * baseScale) / 2 - 10} width="65" height="18" fill={colors.labelBg} rx="4" />
                      <text
                        x={paddingOffset - 40}
                        y={paddingOffset + (fMaxY * baseScale) / 2 + 3}
                        fill={colors.textPrimary}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {fMaxY}' - 0"
                      </text>
                    </g>
                  )}

                  {/* RENDER EACH ROOM WITH THICK WALLS, PATTERNS & LABELS */}
                  {roomsToDraw.map((room) => {
                    const rx = paddingOffset + room.x * baseScale;
                    const ry = paddingOffset + room.y * baseScale;
                    const rw = room.widthFt * baseScale;
                    const rh = room.lengthFt * baseScale;

                    const isSelected = selectedRoom?.id === room.id;

                    // Pattern selector by room type
                    let roomPattern = 'none';
                    if (room.type === 'living' || room.type === 'bedroom') roomPattern = 'url(#woodPlank)';
                    if (room.type === 'kitchen' || room.type === 'bathroom') roomPattern = 'url(#tilePattern)';
                    if (room.type === 'garden' || room.type === 'courtyard') roomPattern = 'url(#grassPattern)';
                    if (room.type === 'hallway') roomPattern = 'url(#corridorPattern)';

                    return (
                      <g key={room.id} onClick={() => setSelectedRoom(room)} className="cursor-pointer group">
                        
                        {/* Room Floor Fill & Color Overlay */}
                        <rect
                          x={rx}
                          y={ry}
                          width={rw}
                          height={rh}
                          fill={room.color || '#3b82f6'}
                          fillOpacity={isSelected ? '0.55' : '0.35'}
                          stroke="none"
                          rx="2"
                        />

                        {/* Room Floor Texture Pattern */}
                        <rect
                          x={rx}
                          y={ry}
                          width={rw}
                          height={rh}
                          fill={roomPattern}
                          opacity="0.6"
                          rx="2"
                        />

                        {/* THICK OUTER STRUCTURAL WALLS (10px thickness visual) */}
                        <rect
                          x={rx}
                          y={ry}
                          width={rw}
                          height={rh}
                          fill="none"
                          stroke={colors.outerWall}
                          strokeWidth="8"
                          strokeLinejoin="miter"
                          className="transition-colors"
                        />

                        {/* INTERIOR DOUBLE WALL OUTLINE */}
                        <rect
                          x={rx + 4}
                          y={ry + 4}
                          width={Math.max(0, rw - 8)}
                          height={Math.max(0, rh - 8)}
                          fill="none"
                          stroke={colors.innerWall}
                          strokeWidth="2"
                          opacity="0.8"
                        />

                        {/* CORNER STRUCTURAL COLUMNS / LOAD PILLARS */}
                        <rect x={rx - 5} y={ry - 5} width="10" height="10" fill={colors.pillarFill} stroke="#000" strokeWidth="1" />
                        <rect x={rx + rw - 5} y={ry - 5} width="10" height="10" fill={colors.pillarFill} stroke="#000" strokeWidth="1" />
                        <rect x={rx - 5} y={ry + rh - 5} width="10" height="10" fill={colors.pillarFill} stroke="#000" strokeWidth="1" />
                        <rect x={rx + rw - 5} y={ry + rh - 5} width="10" height="10" fill={colors.pillarFill} stroke="#000" strokeWidth="1" />

                        {/* DOORS & WINDOWS SYMBOLS */}
                        {showDoorsWindows && (
                          <g className="architectural-openings">
                            {/* Door Opening Symbol at Bottom Wall */}
                            <g transform={`translate(${rx + rw / 2 - 12}, ${ry + rh - 4})`}>
                              {/* Wall gap break */}
                              <rect x="-2" y="-4" width="28" height="8" fill={blueprintStyle === 'paper_light' ? '#f8fafc' : '#020617'} />
                              {/* Door panel line angled */}
                              <line x1="0" y1="0" x2="18" y2="-18" stroke={colors.doorColor} strokeWidth="2.5" />
                              {/* Door 90 deg swing arc */}
                              <path d="M 0 0 A 18 18 0 0 1 18 -18" fill="none" stroke={colors.doorColor} strokeWidth="1.5" strokeDasharray="3 2" />
                            </g>

                            {/* Window Symbol at Top Wall */}
                            <g transform={`translate(${rx + rw / 3}, ${ry - 4})`}>
                              {/* Wall gap break */}
                              <rect x="0" y="0" width="30" height="8" fill={blueprintStyle === 'paper_light' ? '#ffffff' : '#0f172a'} stroke={colors.outerWall} strokeWidth="1" />
                              {/* Double Glass Pane lines */}
                              <line x1="0" y1="2.5" x2="30" y2="2.5" stroke={colors.windowColor} strokeWidth="2" />
                              <line x1="0" y1="5.5" x2="30" y2="5.5" stroke={colors.windowColor} strokeWidth="2" />
                              <line x1="0" y1="0" x2="0" y2="8" stroke={colors.outerWall} strokeWidth="1.5" />
                              <line x1="30" y1="0" x2="30" y2="8" stroke={colors.outerWall} strokeWidth="1.5" />
                            </g>
                          </g>
                        )}

                        {/* PER-ROOM DIMENSION LINES & TICK MARKS */}
                        {showDimensions && (
                          <g className="room-dimensions font-mono text-[9px]">
                            {/* Horizontal Room Dimension Line */}
                            <line x1={rx + 8} y1={ry + rh - 12} x2={rx + rw - 8} y2={ry + rh - 12} stroke={colors.dimensionLine} strokeWidth="1" />
                            <line x1={rx + 8} y1={ry + rh - 16} x2={rx + 8} y2={ry + rh - 8} stroke={colors.dimensionLine} strokeWidth="1" />
                            <line x1={rx + rw - 8} y1={ry + rh - 16} x2={rx + rw - 8} y2={ry + rh - 8} stroke={colors.dimensionLine} strokeWidth="1" />
                            <text x={rx + rw / 2} y={ry + rh - 15} fill={colors.dimensionLine} textAnchor="middle" fontSize="9" fontWeight="bold">
                              {room.widthFt}' - 0"
                            </text>

                            {/* Vertical Room Dimension Line */}
                            <line x1={rx + 12} y1={ry + 8} x2={rx + 12} y2={ry + rh - 8} stroke={colors.dimensionLine} strokeWidth="1" />
                            <line x1={rx + 8} y1={ry + 8} x2={rx + 16} y2={ry + 8} stroke={colors.dimensionLine} strokeWidth="1" />
                            <line x1={rx + 8} y1={ry + rh - 8} x2={rx + 16} y2={ry + rh - 8} stroke={colors.dimensionLine} strokeWidth="1" />
                            <text x={rx + 16} y={ry + rh / 2} fill={colors.dimensionLine} textAnchor="start" fontSize="9" fontWeight="bold" transform={`rotate(-90 ${rx + 16} ${ry + rh / 2})`}>
                              {room.lengthFt}' - 0"
                            </text>
                          </g>
                        )}

                        {/* CENTER ROOM LABEL BADGE */}
                        <g transform={`translate(${rx + rw / 2}, ${ry + rh / 2})`}>
                          {/* Label Card Backdrop */}
                          <rect
                            x="-65"
                            y="-22"
                            width="130"
                            height="44"
                            fill={colors.labelBg}
                            stroke={isSelected ? colors.dimensionLine : 'rgba(255,255,255,0.2)'}
                            strokeWidth={isSelected ? '2' : '1'}
                            rx="8"
                          />

                          {/* Room Name */}
                          <text
                            x="0"
                            y="-6"
                            fill={colors.textPrimary}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="bold"
                            className="uppercase tracking-wide"
                          >
                            {room.name}
                          </text>

                          {/* Room Area & Dimensions */}
                          <text
                            x="0"
                            y="10"
                            fill={colors.textSecondary}
                            textAnchor="middle"
                            fontSize="9"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {room.areaSqFt} SQ FT ({room.widthFt}' × {room.lengthFt}')
                          </text>
                        </g>

                      </g>
                    );
                  })}

                </svg>
              </div>
            );
          };

          return (
            <div className="flex flex-col items-center justify-center min-w-max min-h-max py-10 px-10 gap-10">
              {selectedFloor === 'all' ? (
                distinctFloors.map((fl) => {
                  const flRooms = blueprint.rooms.filter(r => (r.floor || 1) === fl);
                  return renderFloorSVG(flRooms, getFloorName(fl), `floor_${fl}`);
                })
              ) : (
                renderFloorSVG(visibleRooms, getFloorName(selectedFloor as number), `floor_${selectedFloor}`)
              )}
            </div>
          );
        })()}

        {/* INTERACTIVE 3D MODEL & WALKTHROUGH */}
        {viewMode === '3D' && (
          <div className="p-4 bg-slate-950">
            <FloorPlan3DViewer blueprint={blueprint} projectTitle={projectTitle} />
          </div>
        )}

        {/* Legend Footer */}
        <div className="absolute bottom-4 left-6 right-6 z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-950/90 border border-slate-800 p-3 rounded-2xl text-[11px] backdrop-blur-md print:hidden">
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 bg-blue-500 rounded-xs inline-block" /> Living Space
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 bg-emerald-500 rounded-xs inline-block" /> Kitchen & Dining
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 bg-purple-500 rounded-xs inline-block" /> Bedrooms
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3.5 h-1.5 bg-amber-400 rounded-xs inline-block" /> Door Opening Arc
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3.5 h-1.5 bg-cyan-400 rounded-xs inline-block" /> Thermal Glass Window
            </span>
          </div>

          <div className="text-slate-400 font-mono text-[10px] flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-blue-400" /> Click any room box to inspect or highlight dimensions
          </div>
        </div>

      </div>

      {/* Selected Room Details Drawer */}
      {selectedRoom && (
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-lg border border-white shrink-0"
              style={{ backgroundColor: selectedRoom.color }}
            />
            <div>
              <p className="font-bold text-white text-sm">{selectedRoom.name}</p>
              <p className="text-slate-400 text-xs">
                Footprint: <span className="text-emerald-400 font-mono font-bold">{selectedRoom.areaSqFt} sq ft</span> ({selectedRoom.widthFt}ft length × {selectedRoom.lengthFt}ft width)
                {selectedRoom.features?.length ? ` • Features: ${selectedRoom.features.join(', ')}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedRoom(null)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold border border-slate-800"
          >
            Deselect Inspector
          </button>
        </div>
      )}

    </div>
  );
};
