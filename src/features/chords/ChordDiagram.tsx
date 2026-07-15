import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Rect, Text as SvgText } from 'react-native-svg';

import { tokens } from '../../theme/tokens';
import {
  buildDiagramLayout,
  type DiagramChordShape,
} from './diagramLayout';

type ChordDiagramProps = {
  chord: DiagramChordShape;
};

export function ChordDiagram({ chord }: ChordDiagramProps) {
  const layout = buildDiagramLayout(chord);
  const stroke = tokens.colors.text;
  const muted = tokens.colors.textSecondary;

  return (
    <View style={styles.root}>
      <View style={styles.labelRow}>
        {layout.stringLabels.map((label) => (
          <Text key={label} style={styles.label}>
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.diagramRow}>
        {layout.baseFretLabel ? (
          <Text style={styles.baseFret}>{layout.baseFretLabel.text}</Text>
        ) : (
          <View style={styles.baseFretSpacer} />
        )}

        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel={`Chord diagram for ${chord.displayName}`}
        >
          <Svg width={layout.width} height={layout.height}>
            <Rect
              x={layout.nut.x1}
              y={layout.nut.y - 2}
              width={layout.nut.x2 - layout.nut.x1}
              height={4}
              fill={stroke}
            />

            {layout.fretLines.map((line, index) => (
              <Line
                key={`fret-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={stroke}
                strokeWidth={1}
              />
            ))}

            {layout.stringLines.map((line, index) => (
              <Line
                key={`string-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={stroke}
                strokeWidth={1.5}
              />
            ))}

            {layout.barres.map((barre, index) => (
              <Line
                key={`barre-${index}`}
                x1={barre.x1}
                y1={barre.y}
                x2={barre.x2}
                y2={barre.y}
                stroke={stroke}
                strokeWidth={10}
                strokeLinecap="round"
              />
            ))}

            {layout.dots.map((dot) => (
              <Circle
                key={`circle-${dot.stringIndex}-${dot.fret}`}
                cx={dot.x}
                cy={dot.y}
                r={10}
                fill={stroke}
              />
            ))}

            {layout.dots.map((dot) => (
              <SvgText
                key={`finger-svg-${dot.stringIndex}-${dot.fret}`}
                x={dot.x}
                y={dot.y + 4}
                fill={tokens.colors.background}
                fontSize={11}
                fontWeight="700"
                textAnchor="middle"
              >
                {String(dot.finger)}
              </SvgText>
            ))}

            {layout.openMarkers.map((marker) => (
              <Circle
                key={`open-${marker.stringIndex}`}
                cx={marker.x}
                cy={marker.y}
                r={5}
                stroke={muted}
                strokeWidth={1.5}
                fill="none"
              />
            ))}

            {layout.muteMarkers.map((marker) => (
              <SvgText
                key={`mute-${marker.stringIndex}`}
                x={marker.x}
                y={marker.y + 4}
                fill={muted}
                fontSize={12}
                fontWeight="700"
                textAnchor="middle"
              >
                ×
              </SvgText>
            ))}
          </Svg>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    width: 28 + 28 * 3 + 16,
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    marginBottom: tokens.spacing.xs,
  },
  label: {
    color: tokens.colors.text,
    fontSize: tokens.typography.caption.fontSize,
    fontWeight: '600',
  },
  diagramRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  baseFret: {
    color: tokens.colors.text,
    fontSize: tokens.typography.caption.fontSize,
    fontWeight: '600',
    marginTop: 40,
    marginRight: tokens.spacing.xs,
    minWidth: 24,
  },
  baseFretSpacer: {
    width: 0,
  },
});
