import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { useColors } from '../../store';
import { fonts } from '../../constants';
import { rs } from '../../utils';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}

const Section: FC<SectionProps> = ({ title, children, colors }) => {
  return (
    <View style={styles.section}>
      {title && (
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textTertiary, fontFamily: fonts.SemiBold },
          ]}
        >
          {title}
        </Text>
      )}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: colors.backgroundCard,
            borderColor: colors.border,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

export default Section;

const styles = StyleSheet.create({
  section: {
    marginTop: rs.verticalScale(20),
    paddingHorizontal: rs.scale(16),
  },
  sectionTitle: {
    fontSize: rs.font(11),
    letterSpacing: 0.8,
    marginBottom: rs.verticalScale(6),
    paddingHorizontal: rs.scale(4),
  },
  sectionCard: {
    borderRadius: rs.scale(16),
    borderWidth: 0.5,
    overflow: 'hidden',
  },
});
