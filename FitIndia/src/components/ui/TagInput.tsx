import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { FC, useState } from 'react';
import { useColors } from '../../store';
import Icon from './Icon';
import Input from './Input';
import { rs } from '../../utils';
import { fonts } from '../../constants';

interface TagInputProps {
  label: string;
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder: string;
  colors: ReturnType<typeof useColors>;
}

const TagInput: FC<TagInputProps> = ({
  label,
  tags,
  onAdd,
  onRemove,
  placeholder,
  colors,
}) => {
  const [text, setText] = useState('');

  const add = () => {
    const trimmed = text.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onAdd(trimmed);
      setText('');
    }
  };

  return (
    <View style={styles.wrap}>
      <Text
        style={[
          styles.label,
          { color: colors.textSecondary, fontFamily: fonts.Medium },
        ]}
      >
        {label}
      </Text>
      <View style={styles.inputRow}>
        <Input
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          returnKeyType="done"
          onSubmitEditing={add}
          containerStyle={styles.input}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={add}
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
        >
          <Icon
            iconFamily="MaterialCommunityIcons"
            name="plus"
            size={rs.scale(16)}
            color={colors.white}
          />
        </TouchableOpacity>
      </View>
      {tags.length > 0 && (
        <View style={styles.tagsRow}>
          {tags.map(tag => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={tag}
              onPress={() => onRemove(tag)}
              style={[
                styles.tag,
                {
                  backgroundColor: colors.primary + '15',
                  borderColor: colors.primary + '30',
                },
              ]}
            >
              <Text
                style={[
                  styles.tagText,
                  { color: colors.primary, fontFamily: fonts.Medium },
                ]}
              >
                {tag}
              </Text>
              <Icon
                iconFamily="MaterialCommunityIcons"
                name="close"
                size={rs.scale(12)}
                color={colors.primary}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default TagInput;

const styles = StyleSheet.create({
  wrap: {
    marginBottom: rs.verticalScale(20),
  },
  label: {
    fontSize: rs.font(13),
    marginBottom: rs.verticalScale(8),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: rs.scale(8),
  },
  input: {
    flex: 1,
    marginBottom: 0,
  },
  addBtn: {
    width: rs.scale(44),
    height: rs.scale(44),
    borderRadius: rs.scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rs.verticalScale(4),
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rs.scale(6),
    marginTop: rs.verticalScale(8),
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(4),
    paddingHorizontal: rs.scale(10),
    paddingVertical: rs.verticalScale(5),
    borderRadius: rs.scale(20),
    borderWidth: 1,
  },
  tagText: {
    fontSize: rs.font(12),
  },
});
