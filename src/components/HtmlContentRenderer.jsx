import React from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import RenderHtml from 'react-native-render-html';

const HtmlContentRenderer = ({ htmlContent, textSettings }) => {
  const { width } = useWindowDimensions();
  const baseTextStyle = {
    textAlign: textSettings.textAlign,
    fontWeight: textSettings.fontWeight,
    lineHeight: textSettings.lineHeight,
    fontFamily: textSettings.fontFamily,
    color: textSettings.color,
    fontSize: textSettings.fontSize,
    backgroundColor: textSettings.backgroundColor,
  };

  const cleanHtmlContent = (content) => {
    if (!content) return '';
    return content
      .replace(/background-color\s*:\s*[^;]+;?/gi, '') // Remove background-color styles
      .replace(/color\s*:\s*[^;]+;?/gi, ''); // Remove color styles
  };

  return (
    <View style={styles.container}>
      <RenderHtml
        contentWidth={width}
        source={{ html: cleanHtmlContent(htmlContent) }}
        tagsStyles={{
          div: baseTextStyle,
          h1: baseTextStyle,
          h2: baseTextStyle,
          h3: baseTextStyle,
          p: baseTextStyle,
          span: baseTextStyle,
          strong: baseTextStyle,
          li: baseTextStyle,
          ol: baseTextStyle,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HtmlContentRenderer;
