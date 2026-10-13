import {StyleSheet, Text, View, StatusBar} from 'react-native';
import {showMessage, hideMessage} from 'react-native-flash-message';
export const FlashAlert = (
  type,
  title = 'Provide Title',
  description = 'Provide description',
  onclick = null,
  duration = 3000,
) =>
  showMessage({
    message: title,
    description: description,
    type: type,
    onPress: onclick,
    duration: duration,
    textStyle: styles.descriptionStyle,
    titleStyle: styles.titleStyle,
    style: [
      styles.containerStyle,
      {
        backgroundColor:
          type === 'S' ? 'green' : type === 'E' ? '#DC3545' : '#0D6EFD',
      },
    ],
  });
const styles = StyleSheet.create({
  containerStyle: {
    marginTop: StatusBar.currentHeight,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 5,
    borderRadius: 8,
  },
  titleStyle: {
    color: 'white',
    fontSize: 17,
  },
  descriptionStyle: {
    color: 'white',
    // fontSize: 24,
  },
});
