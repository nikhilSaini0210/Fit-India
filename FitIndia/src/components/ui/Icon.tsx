import React, { FC } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export type IconFamily =
  | 'Ionicons'
  | 'MaterialCommunityIcons'
  | 'MaterialIcons'
  | 'FontAwesome';

interface IconProps {
  color?: string;
  size: number;
  name: string;
  iconFamily: IconFamily;
  style?: object;
}

const Icon: FC<IconProps> = ({ color, size, name, iconFamily, style }) => {
  return (
    <>
      {iconFamily === 'Ionicons' && (
        <Ionicons name={name} color={color} size={size} style={style} />
      )}
      {iconFamily === 'MaterialIcons' && (
        <MaterialIcons name={name} color={color} size={size} style={style} />
      )}
      {iconFamily === 'MaterialCommunityIcons' && (
        <MaterialCommunityIcons
          name={name}
          color={color}
          size={size}
          style={style}
        />
      )}
      {iconFamily === 'FontAwesome' && (
        <FontAwesome name={name} color={color} size={size} style={style} />
      )}
    </>
  );
};

export default Icon;
