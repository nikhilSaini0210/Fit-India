import React, { FC, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '../../../store';
import { fonts } from '../../../constants';
import type { ProgressLog } from '../../../types';
import { rs } from '../../../utils';

interface StreakCalendarProps {
  logs: ProgressLog[];
  weeks?: number;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const StreakCalendar: FC<StreakCalendarProps> = ({ logs, weeks = 12 }) => {
  const colors = useColors();

  const { grid, monthLabels } = useMemo(() => {
    const loggedDates = new Set(
      logs.map(l => new Date(l.logDate).toDateString()),
    );

    const today = new Date();
    const cells: {
      date: Date;
      logged: boolean;
      isToday: boolean;
      isFuture: boolean;
    }[][] = [];
    const months: { label: string; col: number }[] = [];

    // Build weeks grid (newest on right)
    const totalDays = weeks * 7;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - totalDays + 1);
    // Align to Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    let lastMonth = -1;
    let colIdx = 0;

    for (let w = 0; w < weeks; w++) {
      const week: (typeof cells)[0] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + w * 7 + d);
        const isToday = date.toDateString() === today.toDateString();
        const isFuture = date > today;
        const logged = loggedDates.has(date.toDateString()) && !isFuture;

        if (date.getMonth() !== lastMonth && d === 0) {
          months.push({
            label: date.toLocaleDateString('en-IN', { month: 'short' }),
            col: colIdx,
          });
          lastMonth = date.getMonth();
        }
        week.push({ date, logged, isToday, isFuture });
      }
      cells.push(week);
      colIdx++;
    }

    return { grid: cells, monthLabels: months };
  }, [logs, weeks]);

  const cellSize = Math.floor(
    (rs.screenWidth - rs.scale(32) - rs.scale(16)) / weeks,
  );

  return (
    <View>
      {/* Month labels */}
      <View style={s.monthRow}>
        {monthLabels.map((m, i) => (
          <Text
            key={i}
            style={[
              s.monthLabel,
              {
                color: colors.textTertiary,
                fontFamily: fonts.Regular,
                position: 'absolute',
                left: m.col * (cellSize + 2),
              },
            ]}
          >
            {m.label}
          </Text>
        ))}
      </View>

      <View style={s.grid}>
        {/* Day labels */}
        <View style={s.dayLabels}>
          {DAYS.map((d, i) => (
            <Text
              key={i}
              style={[
                s.dayLabel,
                {
                  color: colors.textTertiary,
                  fontFamily: fonts.Regular,
                  height: cellSize + 2,
                },
              ]}
            >
              {i % 2 === 1 ? d : ''}
            </Text>
          ))}
        </View>

        {/* Calendar cells */}
        <View style={s.cells}>
          {grid.map((week, wi) => (
            <View key={wi} style={s.weekCol}>
              {week.map((cell, di) => (
                <View
                  key={di}
                  style={[
                    s.cell,
                    {
                      width: cellSize,
                      height: cellSize,
                      borderRadius: Math.floor(cellSize * 0.25),
                      backgroundColor: cell.isFuture
                        ? 'transparent'
                        : cell.isToday
                        ? colors.primary + '40'
                        : cell.logged
                        ? colors.primary
                        : colors.backgroundMuted,
                      borderWidth: cell.isToday ? 1.5 : 0,
                      borderColor: cell.isToday
                        ? colors.primary
                        : 'transparent',
                      opacity: cell.isFuture ? 0 : 1,
                    },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Legend */}
      <View style={s.legend}>
        <Text
          style={[
            s.legendText,
            { color: colors.textTertiary, fontFamily: fonts.Regular },
          ]}
        >
          Less
        </Text>
        {[0, 0.25, 0.5, 0.75, 1].map((opacity, i) => (
          <View
            key={i}
            style={[
              s.legendCell,
              {
                borderRadius: Math.floor(cellSize * 0.2),
                backgroundColor:
                  opacity === 0 ? colors.backgroundMuted : colors.primary,
                opacity: opacity === 0 ? 1 : opacity,
              },
            ]}
          />
        ))}
        <Text
          style={[
            s.legendText,
            { color: colors.textTertiary, fontFamily: fonts.Regular },
          ]}
        >
          More
        </Text>
      </View>
    </View>
  );
};

export default StreakCalendar;

const s = StyleSheet.create({
  monthRow: {
    height: rs.verticalScale(16),
    position: 'relative',
    marginBottom: rs.verticalScale(4),
  },
  monthLabel: { fontSize: rs.font(10), top: 0 },
  grid: { flexDirection: 'row' },
  dayLabels: {
    justifyContent: 'space-between',
    marginRight: rs.scale(4),
    paddingTop: 0,
  },
  dayLabel: {
    fontSize: rs.font(9),
    width: rs.scale(10),
    textAlign: 'center',
    lineHeight: undefined,
  },
  cells: { flexDirection: 'row', gap: 2 },
  weekCol: { gap: 2 },
  cell: { margin: 0 },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(4),
    marginTop: rs.verticalScale(8),
    alignSelf: 'flex-end',
  },
  legendCell: { width: rs.scale(10), height: rs.scale(10) },
  legendText: { fontSize: rs.font(10) },
});
