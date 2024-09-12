import React from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import RenderHtml from 'react-native-render-html';

const HtmlContentRenderer = ({ htmlContent, textSettings }) => {
  const { width } = useWindowDimensions();
  
  // Define base text styles from the textSettings prop
  const baseTextStyle = {
    textAlign: textSettings.textAlign,
    fontWeight: textSettings.fontWeight,
    lineHeight: textSettings.lineHeight,
    fontFamily: textSettings.fontFamily,
    color: textSettings.color,
    fontSize: textSettings.fontSize,
    backgroundColor: textSettings.backgroundColor,
  };

  // Function to clean HTML content and wrap plain text in <p> tags
  const cleanHtmlContent = (content) => {
    if (!content) return '';
    
    // Remove unwanted inline styles (example: background-color, color)
    let cleanedContent = content
      .replace(/background-color\s*:\s*[^;]+;?/gi, '') 
      .replace(/color\s*:\s*[^;]+;?/gi, '');

    // Check if the content is plain text (i.e., it doesn't contain any HTML tags)
    const hasHtmlTags = /<[^>]+>/.test(cleanedContent);
    if (!hasHtmlTags) {
      // Wrap plain text in <p> tags
      cleanedContent = `<p>${cleanedContent}</p>`;
    }
    
    return cleanedContent;
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
          ul: baseTextStyle,
          '*': baseTextStyle
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
