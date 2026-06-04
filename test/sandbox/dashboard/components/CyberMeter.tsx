import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from './RetroCard';

interface CyberMeterProps {
  value: number;
  max: number;
  title?: string;
  prefix?: string;
  suffix?: string;
  theme: Theme;
}

export default function CyberMeter({
  value,
  max,
  title,
  prefix = '',
  suffix = '',
  theme,
}: CyberMeterProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 150);
  const percentRounded = Math.round(percentage);
  
  const isDark = theme.mode === 'dark';
  
  // Vibrant colors based on theme
  let activeColor = isDark ? '#00ff66' : '#008080'; // Teal vs CRT Green
  let textStyle = isDark ? styles.textGreenDark : styles.textTealLight;
  
  if (percentRounded >= 100) {
    activeColor = theme.accentRed;
    textStyle = styles.textRed;
  } else if (percentRounded >= 80) {
    activeColor = theme.accentOrange;
    textStyle = styles.textOrange;
  }

  const totalSegments = 10;
  const filledSegments = Math.min(Math.round((percentage / 100) * totalSegments), totalSegments);

  return (
    <View style={styles.container}>
      {/* Label and Value */}
      <View style={styles.labelRow}>
        <Text style={[styles.titleText, { color: isDark ? theme.textColorMuted : '#595959' }]}>
          {title}
        </Text>
        <Text style={[styles.valueText, textStyle, isDark && { color: activeColor }]}>
          {prefix}{value.toFixed(2)}{suffix} / {prefix}{max.toFixed(2)}{suffix} ({percentRounded}%)
        </Text>
      </View>

      {/* Retro segment bar */}
      <View 
        style={[
          styles.meterTrack, 
          { 
            backgroundColor: theme.controlBg, 
            borderColor: theme.borderColor,
            borderWidth: isDark ? 1.5 : 2,
          }
        ]}
      >
        {Array.from({ length: totalSegments }).map((_, idx) => {
          const isFilled = idx < filledSegments;
          return (
            <View
              key={idx}
              style={[
                styles.segment,
                {
                  backgroundColor: isFilled ? activeColor : (isDark ? '#0c0a09' : '#ffffff'),
                  borderColor: isFilled ? theme.borderColor : (isDark ? '#00ff6620' : '#d9d9d9'),
                  borderWidth: isDark ? 0.5 : 1,
                }
              ]}
            />
          );
        })}
      </View>

      {/* Overflow warning */}
      {percentRounded >= 100 && (
        <View style={styles.warningContainer}>
          <Text style={[styles.warningText, { color: theme.accentRed }]}>
            [ ! ALERT: EXCEEDED SET THRESHOLD LIMIT ! ]
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleText: {
    fontFamily: 'monospace',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  valueText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
  },
  textGreenDark: {
    color: '#00ff66',
  },
  textTealLight: {
    color: '#008080',
  },
  textOrange: {
    color: '#fa8c16',
  },
  textRed: {
    color: '#cf1322',
  },
  meterTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 4,
    shadowColor: '#121212',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 0,
  },
  segment: {
    flex: 1,
    height: 12,
    marginHorizontal: 1,
    borderRadius: 2,
  },
  warningContainer: {
    marginTop: 6,
  },
  warningText: {
    fontFamily: 'monospace',
    fontSize: 8,
    fontWeight: 'bold',
  },
});
