import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Keyboard } from 'react-native';
import { AppColors } from '@/constants/AppColors';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';

const OTPInput = ({ code = '', onChangeCode, errorMessage }) => {
  const inputsRef = useRef([]);
  const [focused, setFocused] = useState(-1);
  const length = 6;

  const handleChange = (text, index) => {
    const sanitized = text.replace(/[^0-9]/g, '').slice(-1);
    const codeArr = code.split('');
    codeArr[index] = sanitized;
    const newCode = codeArr.join('').padEnd(index + (sanitized ? 1 : 0), '').slice(0, length);
    onChangeCode(newCode);
    if (sanitized && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    } else if (sanitized && index === length - 1) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!code[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
        const codeArr = code.split('');
        codeArr[index - 1] = '';
        onChangeCode(codeArr.join(''));
      }
    }
  };

  return (
    <View>
      <View style={styles.container}>
        {Array.from({ length }).map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputsRef.current[index] = ref)}
            style={[
              styles.box,
              focused === index && styles.boxFocused,
              !!code[index] && styles.boxFilled,
            ]}
            value={code[index] || ''}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocused(index)}
            onBlur={() => setFocused(-1)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            selectionColor="#000000"
            autoFocus={index === 0}
          />
        ))}
      </View>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: widthPixel(20),
    marginTop: heightPixel(12),
  },
  box: {
    width: widthPixel(52),
    height: heightPixel(64),
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: widthPixel(12),
    backgroundColor: '#F9FAFB',
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(22),
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  boxFocused: {
    borderColor: '#16A34A',
    borderWidth: 2,
    backgroundColor: '#ECFDF5',
  },
  boxFilled: {
    borderWidth: 2,
    borderColor: '#16A34A',
    backgroundColor: '#ECFDF5',
  },
  error: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: AppColors.error,
    marginTop: heightPixel(8),
    marginHorizontal: widthPixel(20),
    textAlign: 'center',
  },
});

export default OTPInput;
