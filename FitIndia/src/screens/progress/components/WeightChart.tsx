import React, { useRef, useEffect, useMemo, FC } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useColors } from '../../../store';
import { fonts } from '../../../constants';
import type { ProgressLog } from '../../../types';
import { rs } from '../../../utils';

interface WeightChartProps {
  logs: ProgressLog[];
  width?: number;
  height?: number;
}

const PAD_H = rs.scale(40);
const PAD_V = rs.verticalScale(24);

 const WeightChart: FC<WeightChartProps> = ({
  logs,
  width = rs.screenWidth - rs.scale(32),
  height = rs.verticalScale(180),
}) => {
  const colors = useColors();
  const drawAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    drawAnim.setValue(0);
    Animated.timing(drawAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs.length]);

  const chartW = width - PAD_H * 2;
  const chartH = height - PAD_V * 2;

  const { points, minW, maxW, labels } = useMemo(() => {
    if (!logs.length) return { points: [], minW: 0, maxW: 0, labels: [] };

    const weights = logs.map(l => l.weight);
    const minW = Math.min(...weights) - 1;
    const maxW = Math.max(...weights) + 1;
    const range = maxW - minW || 1;

    const points = logs.map((log, i) => ({
      x: PAD_H + (i / Math.max(logs.length - 1, 1)) * chartW,
      y: PAD_V + chartH - ((log.weight - minW) / range) * chartH,
      weight: log.weight,
      date: new Date(log.logDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      }),
    }));

    // Labels: show max 5 evenly
    const step = Math.max(1, Math.floor(logs.length / 5));
    const labels = points.filter(
      (_, i) => i % step === 0 || i === points.length - 1,
    );

    return { points, minW, maxW, labels };
  }, [logs, chartW, chartH]);

  if (!points.length) {
    return (
      <View
        style={[
          s.empty,
          {
            width,
            height,
            backgroundColor: colors.backgroundSurface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            s.emptyText,
            { color: colors.textTertiary, fontFamily: fonts.Regular },
          ]}
        >
          Log your weight to see the chart
        </Text>
      </View>
    );
  }

  // Build polyline path string
  const pathStr = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');
  const areaStr = `${pathStr} L ${points[points.length - 1].x.toFixed(1)} ${(
    PAD_V + chartH
  ).toFixed(1)} L ${PAD_H.toFixed(1)} ${(PAD_V + chartH).toFixed(1)} Z`;

  // Y-axis grid labels
  const yTicks = [minW, (minW + maxW) / 2, maxW].map((val, i) => ({
    val: val.toFixed(1),
    y: PAD_V + chartH - (i / 2) * chartH,
  }));

  return (
    <View style={{ width, height }}>
      {/* SVG-like grid lines using Views */}
      {yTicks.map((tick, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: PAD_H,
            right: rs.scale(8),
            top: tick.y,
            height: 0.5,
            backgroundColor: colors.border + '60',
          }}
        />
      ))}

      {/* Y-axis labels */}
      {yTicks.map((tick, i) => (
        <Text
          key={i}
          style={[
            s.axisLabel,
            {
              position: 'absolute',
              left: 0,
              top: tick.y - rs.verticalScale(8),
              color: colors.textTertiary,
              fontFamily: fonts.Regular,
            },
          ]}
        >
          {tick.val}
        </Text>
      ))}

      {/* Area fill (simulated with absolute divs) */}
      {points.slice(0, -1).map((p, i) => {
        const next = points[i + 1];
        const midX = (p.x + next.x) / 2;
        const midY = (p.y + next.y) / 2;
        const segH = PAD_V + chartH - Math.min(p.y, next.y);
        const segW = next.x - p.x;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: p.x,
              top: Math.min(p.y, next.y),
              width: segW,
              height: segH,
              backgroundColor: colors.primary + '15',
            }}
          />
        );
      })}

      {/* Line segments */}
      {points.slice(0, -1).map((p, i) => {
        const next = points[i + 1];
        const dx = next.x - p.x;
        const dy = next.y - p.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y - 1.5,
              width: drawAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, len],
              }),
              height: 3,
              backgroundColor: colors.primary,
              borderRadius: 2,
              transformOrigin: 'left center',
              transform: [{ rotate: `${angle}deg` }],
            }}
          />
        );
      })}

      {/* Data points */}
      {points.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: p.x - rs.scale(5),
            top: p.y - rs.scale(5),
            width: rs.scale(10),
            height: rs.scale(10),
            borderRadius: rs.scale(5),
            backgroundColor:
              i === points.length - 1 ? colors.primary : colors.backgroundCard,
            borderWidth: 2,
            borderColor: colors.primary,
            opacity: drawAnim,
          }}
        />
      ))}

      {/* X-axis date labels */}
      {labels.map((p, i) => (
        <Text
          key={i}
          style={[
            s.axisLabel,
            {
              position: 'absolute',
              top: PAD_V + chartH + rs.verticalScale(6),
              left: p.x - rs.scale(18),
              color: colors.textTertiary,
              fontFamily: fonts.Regular,
              width: rs.scale(40),
              textAlign: 'center',
            },
          ]}
        >
          {p.date}
        </Text>
      ))}

      {/* Latest weight label */}
      {points.length > 0 && (
        <Text
          style={[
            s.latestLabel,
            {
              position: 'absolute',
              left: points[points.length - 1].x - rs.scale(20),
              top: points[points.length - 1].y - rs.verticalScale(22),
              color: colors.primary,
              fontFamily: fonts.Bold,
            },
          ]}
        >
          {points[points.length - 1].weight}kg
        </Text>
      )}
    </View>
  );
};

export default WeightChart;

const s = StyleSheet.create({
  empty: {
    borderRadius: rs.scale(12),
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: { fontSize: rs.font(13) },
  axisLabel: { fontSize: rs.font(10), position: 'absolute' },
  latestLabel: { fontSize: rs.font(12), position: 'absolute' },
});
