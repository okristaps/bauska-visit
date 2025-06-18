"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { puzzle1Config } from "@/config/puzzle1Config";
import { puzzle2Config } from "@/config/puzzle2Config";
import { puzzle3Config } from "@/config/puzzle3Config";
import { puzzle4Config } from "@/config/puzzle4Config";
import { PuzzleConfig, PieceState, Position, PieceDimensions, ConnectionPoint } from "@/types/index";

// Constants
const PADDING = 20;
const SNAP_DISTANCE = 30;

interface UsePuzzleOptions {
  puzzleId: number;
  onComplete?: () => void;
  onTimeUpdate?: (time: number) => void;
}

const puzzleConfigs: Record<number, PuzzleConfig> = {
  1: puzzle1Config,
  2: puzzle2Config,
  3: puzzle3Config,
  4: puzzle4Config,
};

export const usePuzzle = ({ puzzleId, onComplete, onTimeUpdate }: UsePuzzleOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [puzzleConfig, setPuzzleConfig] = useState<PuzzleConfig>(puzzleConfigs[puzzleId] || puzzle1Config);
  const [pieces, setPieces] = useState<PieceState[]>([]);
  const draggedPieceRef = useRef<number | null>(null);
  const groupDragOffsetsRef = useRef<{ [id: number]: Position }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const forceUpdate = useState({})[1];

  const getAbsoluteConnectionPoint = useCallback(
    (pieceState: PieceState, point: ConnectionPoint): Position => {
      const pieceData = puzzleConfig.dimensions.find((p) => p.id === pieceState.id)!;
      return {
        x: pieceState.x + (pieceData.width / 2 + point.x) * scaleFactor,
        y: pieceState.y + (pieceData.height / 2 + point.y) * scaleFactor,
      };
    },
    [puzzleConfig.dimensions, scaleFactor]
  );

  const clampGroupPosition = useCallback(
    (groupPieces: PieceState[], containerWidth: number, containerHeight: number) => {
      if (groupPieces.length === 0) return { dx: 0, dy: 0 };

      const scaledPieces = groupPieces.map((p) => {
        const pieceData = puzzleConfig.dimensions.find((pd) => pd.id === p.id)!;
        return { ...p, width: pieceData.width * scaleFactor, height: pieceData.height * scaleFactor };
      });

      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      scaledPieces.forEach((p) => {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x + p.width);
        maxY = Math.max(maxY, p.y + p.height);
      });

      let dx = 0,
        dy = 0;
      if (minX < 0) dx = -minX;
      else if (maxX > containerWidth) dx = containerWidth - maxX;
      if (minY < 0) dy = -minY;
      else if (maxY > containerHeight) dy = containerHeight - maxY;

      return { dx, dy };
    },
    [puzzleConfig.dimensions, scaleFactor]
  );

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (startTimeRef.current !== null) return;
    startTimeRef.current = Date.now();
    onTimeUpdate?.(0);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        onTimeUpdate?.(elapsed);
      }
    }, 1000);
  }, [onTimeUpdate]);

  const calculatePuzzleDimensions = useCallback(() => {
    let maxWidth = 0,
      totalHeight = 0,
      currentRowHeight = 0,
      currentRowWidth = 0;
    puzzleConfig.dimensions.forEach((piece, index) => {
      if (index > 0 && index % puzzleConfig.layout.cols === 0) {
        maxWidth = Math.max(maxWidth, currentRowWidth);
        totalHeight += currentRowHeight + PADDING;
        currentRowHeight = 0;
        currentRowWidth = 0;
      }
      currentRowWidth += piece.width + PADDING;
      currentRowHeight = Math.max(currentRowHeight, piece.height);
    });
    maxWidth = Math.max(maxWidth, currentRowWidth);
    totalHeight += currentRowHeight;
    return { width: maxWidth, height: totalHeight };
  }, [puzzleConfig]);

  const checkConnections = useCallback(
    (
      pieceId: number,
      currentPieces: PieceState[]
    ): {
      draggedGroupId: string;
      targetGroupId: string;
      offset: Position;
    } | null => {
      const draggedPieceData = puzzleConfig.dimensions.find((p) => p.id === pieceId);
      const draggedPieceState = currentPieces.find((p) => p.id === pieceId);
      if (!draggedPieceData || !draggedPieceState) return null;

      let bestMatch: {
        distance: number;
        dragPoint: ConnectionPoint;
        targetPiece: PieceDimensions;
        targetPieceState: PieceState;
        targetPoint: ConnectionPoint;
      } | null = null;

      for (const dragPoint of draggedPieceData.connections) {
        const targetPiece = puzzleConfig.dimensions.find((p) => p.id === dragPoint.connectsTo.pieceId);
        const targetPieceState = currentPieces.find((p) => p.id === dragPoint.connectsTo.pieceId);

        if (!targetPiece || !targetPieceState || targetPieceState.groupId === draggedPieceState.groupId) continue;

        const targetPoint = targetPiece.connections.find((p) => p.id === dragPoint.connectsTo.pointId);
        if (!targetPoint) continue;

        const dragPointPos = getAbsoluteConnectionPoint(draggedPieceState, dragPoint);
        const targetPointPos = getAbsoluteConnectionPoint(targetPieceState, targetPoint);
        const distance = Math.hypot(dragPointPos.x - targetPointPos.x, dragPointPos.y - targetPointPos.y);

        if (distance < SNAP_DISTANCE && (!bestMatch || distance < bestMatch.distance)) {
          bestMatch = { distance, dragPoint, targetPiece, targetPieceState, targetPoint };
        }
      }

      if (bestMatch) {
        const { dragPoint, targetPieceState, targetPoint } = bestMatch;
        const dragPointAbs = getAbsoluteConnectionPoint(draggedPieceState, dragPoint);
        const targetPointAbs = getAbsoluteConnectionPoint(targetPieceState, targetPoint);
        const offset = { x: targetPointAbs.x - dragPointAbs.x, y: targetPointAbs.y - dragPointAbs.y };
        return { draggedGroupId: draggedPieceState.groupId, targetGroupId: targetPieceState.groupId, offset };
      }
      return null;
    },
    [puzzleConfig.dimensions, getAbsoluteConnectionPoint]
  );

  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent, pieceId: number) => {
      if (isCompleted) return;
      startTimer();

      const { clientX, clientY } = "touches" in e ? e.touches[0] : e;

      draggedPieceRef.current = pieceId;
      const draggedPieceData = pieces.find((p) => p.id === pieceId);
      if (!draggedPieceData) return;

      const groupId = draggedPieceData.groupId;
      const offsets: { [id: number]: Position } = {};
      pieces.forEach((piece) => {
        if (piece.groupId === groupId) {
          offsets[piece.id] = { x: clientX - piece.x, y: clientY - piece.y };
        }
      });
      groupDragOffsetsRef.current = offsets;
      forceUpdate({});
    },
    [isCompleted, startTimer, pieces, forceUpdate]
  );

  const handleDrag = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!draggedPieceRef.current || !containerRef.current) return;
      const { clientX, clientY } = "touches" in e ? e.touches[0] : e;

      const draggedPieceData = pieces.find((p) => p.id === draggedPieceRef.current);
      if (!draggedPieceData) return;

      const groupId = draggedPieceData.groupId;
      const { clientWidth: containerWidth, clientHeight: containerHeight } = containerRef.current;

      const proposedGroupPieces = pieces
        .filter((p) => p.groupId === groupId && groupDragOffsetsRef.current[p.id])
        .map((p) => ({
          ...p,
          x: clientX - groupDragOffsetsRef.current[p.id].x,
          y: clientY - groupDragOffsetsRef.current[p.id].y,
        }));

      const { dx, dy } = clampGroupPosition(proposedGroupPieces, containerWidth, containerHeight);

      setPieces((currentPieces) =>
        currentPieces.map((piece) => {
          if (piece.groupId === groupId && groupDragOffsetsRef.current[piece.id]) {
            return {
              ...piece,
              x: clientX - groupDragOffsetsRef.current[piece.id].x + dx,
              y: clientY - groupDragOffsetsRef.current[piece.id].y + dy,
            };
          }
          return piece;
        })
      );
    },
    [pieces, clampGroupPosition]
  );

  const handleDragEnd = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const draggedPieceId = draggedPieceRef.current;
      if (!draggedPieceId || !containerRef.current) return;

      const { clientX, clientY } = "changedTouches" in e ? e.changedTouches[0] : e;
      const { clientWidth: containerWidth, clientHeight: containerHeight } = containerRef.current;

      const draggedPieceInfo = pieces.find((p) => p.id === draggedPieceId);
      if (!draggedPieceInfo) return;

      const draggedGroupId = draggedPieceInfo.groupId;
      let finalPieces = pieces.map((piece) => {
        if (piece.groupId === draggedGroupId && groupDragOffsetsRef.current[piece.id]) {
          return {
            ...piece,
            x: clientX - groupDragOffsetsRef.current[piece.id].x,
            y: clientY - groupDragOffsetsRef.current[piece.id].y,
          };
        }
        return piece;
      });

      const draggedGroupPieces = finalPieces.filter((p) => p.groupId === draggedGroupId);
      const { dx, dy } = clampGroupPosition(draggedGroupPieces, containerWidth, containerHeight);
      if (dx !== 0 || dy !== 0) {
        finalPieces = finalPieces.map((piece) =>
          piece.groupId === draggedGroupId ? { ...piece, x: piece.x + dx, y: piece.y + dy } : piece
        );
      }

      draggedPieceRef.current = null;
      groupDragOffsetsRef.current = {};
      forceUpdate({});

      const connectionResult = checkConnections(draggedPieceId, finalPieces);
      if (connectionResult) {
        const { targetGroupId, offset } = connectionResult;
        const newPieces = finalPieces.map((p) => {
          if (p.groupId === draggedGroupId) {
            return { ...p, x: p.x + offset.x, y: p.y + offset.y, groupId: targetGroupId };
          }
          return p;
        });
        setPieces(newPieces);
      } else {
        setPieces(finalPieces);
      }
    },
    [pieces, clampGroupPosition, forceUpdate, checkConnections]
  );

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (!containerRef.current) return;
      const { width: puzzleWidth, height: puzzleHeight } = calculatePuzzleDimensions();
      const widthScale = (containerRef.current.clientWidth * 0.9) / puzzleWidth;
      const heightScale = (containerRef.current.clientHeight * 0.9) / puzzleHeight;
      setScaleFactor(Math.min(widthScale, heightScale));
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [calculatePuzzleDimensions]);

  useEffect(() => {
    if (!containerRef.current || !scaleFactor) return;

    const { clientWidth: containerWidth, clientHeight: containerHeight } = containerRef.current;
    const MIDDLE_GAP_WIDTH = containerWidth * 0.1;

    const shuffledPiecesData = [...puzzleConfig.dimensions].sort(() => Math.random() - 0.5);
    const halfwayIndex = Math.ceil(shuffledPiecesData.length / 2);

    const newPieces = shuffledPiecesData.map((piece, index) => {
      const pieceWidth = piece.width * scaleFactor;
      const pieceHeight = piece.height * scaleFactor;
      const y = PADDING + Math.random() * (containerHeight - pieceHeight - 2 * PADDING);
      let x;
      if (index < halfwayIndex) {
        const leftAreaWidth = (containerWidth - MIDDLE_GAP_WIDTH) / 2;
        x = PADDING + Math.random() * (leftAreaWidth - pieceWidth - 2 * PADDING);
      } else {
        const rightAreaStart = (containerWidth + MIDDLE_GAP_WIDTH) / 2;
        const rightAreaWidth = (containerWidth - MIDDLE_GAP_WIDTH) / 2;
        x = rightAreaStart + PADDING + Math.random() * (rightAreaWidth - pieceWidth - 2 * PADDING);
      }
      return { id: piece.id, x, y, groupId: `group-${piece.id}` };
    });
    setPieces(newPieces);
  }, [puzzleConfig, scaleFactor]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const touchMoveHandler = (e: TouchEvent) => {
      if (draggedPieceRef.current) {
        e.preventDefault();
        handleDrag(e as any);
      }
    };

    const touchEndHandler = (e: TouchEvent) => {
      if (draggedPieceRef.current) handleDragEnd(e as any);
    };

    container.addEventListener("touchmove", touchMoveHandler, { passive: false });
    container.addEventListener("touchend", touchEndHandler, { passive: false });
    container.addEventListener("touchcancel", touchEndHandler, { passive: false });

    return () => {
      container.removeEventListener("touchmove", touchMoveHandler);
      container.removeEventListener("touchend", touchEndHandler);
      container.removeEventListener("touchcancel", touchEndHandler);
    };
  }, [handleDrag, handleDragEnd]);

  useEffect(() => {
    if (isCompleted || !containerRef.current) return;
    const allGroupIds = new Set(pieces.map((p) => p.groupId));
    if (pieces.length > 0 && allGroupIds.size === 1) {
      stopTimer();

      const { clientWidth: containerWidth, clientHeight: containerHeight } = containerRef.current;
      const scaledPieces = pieces.map((p) => {
        const pieceData = puzzleConfig.dimensions.find((pd) => pd.id === p.id)!;
        return { ...p, width: pieceData.width * scaleFactor, height: pieceData.height * scaleFactor };
      });

      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      scaledPieces.forEach((p) => {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x + p.width);
        maxY = Math.max(maxY, p.y + p.height);
      });

      const puzzleWidth = maxX - minX;
      const puzzleHeight = maxY - minY;
      const targetX = (containerWidth - puzzleWidth) / 2;
      const targetY = (containerHeight - puzzleHeight) / 2;
      const dx = targetX - minX;
      const dy = targetY - minY;

      const centeredPieces = pieces.map((p) => ({ ...p, x: p.x + dx, y: p.y + dy }));
      setPieces(centeredPieces);
      setIsCompleted(true);
      onComplete?.();
    }
  }, [pieces, onComplete, isCompleted, puzzleConfig.dimensions, scaleFactor, stopTimer]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  useEffect(() => {
    setPuzzleConfig(puzzleConfigs[puzzleId] || puzzle1Config);
  }, [puzzleId]);

  const getContainerProps = () => ({
    ref: containerRef,
    onMouseMove: (e: React.MouseEvent) => draggedPieceRef.current && handleDrag(e),
    onMouseUp: (e: React.MouseEvent) => handleDragEnd(e),
    onMouseLeave: (e: React.MouseEvent) => {
      if (draggedPieceRef.current) {
        handleDragEnd(e);
      }
    },
  });

  const getPieceProps = (piece: PieceState) => {
    const pieceData = puzzleConfig.dimensions.find((p) => p.id === piece.id)!;
    const isDragging =
      draggedPieceRef.current !== null &&
      pieces.find((p) => p.id === draggedPieceRef.current)?.groupId === piece.groupId;
    return {
      key: piece.id,
      style: {
        width: pieceData.width * scaleFactor,
        height: pieceData.height * scaleFactor,
        left: piece.x,
        top: piece.y,
        transition: isCompleted ? "left 0.5s ease-in-out, top 0.5s ease-in-out" : "none",
        zIndex: isDragging ? 10 : 1,
      },
      onMouseDown: (e: React.MouseEvent) => handleDragStart(e, piece.id),
      onTouchStart: (e: React.TouchEvent) => handleDragStart(e, piece.id),
    };
  };

  return {
    puzzleConfig,
    pieces,
    isCompleted,
    getContainerProps,
    getPieceProps,
  };
};
