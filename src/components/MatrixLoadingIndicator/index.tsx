import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789!@#$%^&*<>';
const CHAR_W = 14;
const CHAR_H = 18;

interface Column {
    chars: string[];
    head: number;
    tail: number;
    speed: number;
    tick: number;
}

interface Props {
    width?: number;
    height?: number;
}

function randomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function makeColumn(numRows: number): Column {
    return {
        chars: Array.from({ length: numRows }, randomChar),
        head: -Math.floor(Math.random() * numRows),
        tail: Math.floor(Math.random() * 10) + 5,
        speed: Math.floor(Math.random() * 3) + 1,
        tick: 0,
    };
}

export default function MatrixLoadingIndicator({ width: widthProp, height: heightProp }: Props) {
    const theme = useTheme();
    const [size, setSize] = useState({ width: widthProp ?? 0, height: heightProp ?? 0 });

    const width = widthProp ?? size.width;
    const height = heightProp ?? size.height;

    const numCols = Math.max(1, Math.floor(width / CHAR_W));
    const numRows = Math.max(1, Math.floor(height / CHAR_H));

    const [columns, setColumns] = useState<Column[]>(() =>
        Array.from({ length: numCols }, () => makeColumn(numRows))
    );

    // Rebuild columns when dimensions change
    useEffect(() => {
        if (width === 0 || height === 0) return;
        setColumns(Array.from({ length: numCols }, () => makeColumn(numRows)));
    }, [numCols, numRows]);

    const { primary, onPrimary, background } = theme.colors;

    useEffect(() => {
        if (width === 0 || height === 0) return;
        const interval = setInterval(() => {
            setColumns(prev =>
                prev.map(col => {
                    const nextTick = col.tick + 1;
                    if (nextTick % col.speed !== 0) {
                        return { ...col, tick: nextTick };
                    }
                    const newHead = col.head + 1;
                    const newChars = col.chars.map((c, i) => {
                        if (i <= newHead && i >= newHead - col.tail && Math.random() > 0.85) {
                            return randomChar();
                        }
                        return c;
                    });
                    if (newHead - col.tail > numRows) {
                        return { ...makeColumn(numRows), tick: 0 };
                    }
                    return { ...col, chars: newChars, head: newHead, tick: nextTick };
                })
            );
        }, 50);

        return () => clearInterval(interval);
    }, [numRows, width, height]);

    const onLayout = (e: LayoutChangeEvent) => {
        if (widthProp !== undefined && heightProp !== undefined) return;
        const { width: w, height: h } = e.nativeEvent.layout;
        setSize(prev => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
    };

    return (
        <View
            onLayout={onLayout}
            style={[
                { overflow: 'hidden', backgroundColor: background, flexDirection: 'row' },
                widthProp !== undefined || heightProp !== undefined
                    ? { width: widthProp, height: heightProp }
                    : { flex: 1, alignSelf: 'stretch' },
            ]}
        >
            {columns.map((col, colIdx) => (
                <View key={colIdx} style={{ width: CHAR_W }}>
                    {col.chars.map((char, rowIdx) => {
                        const { head, tail } = col;
                        const isHead = rowIdx === head;
                        const inTrail = rowIdx < head && rowIdx >= head - tail;
                        const visible = isHead || inTrail;

                        if (!visible) {
                            return <View key={rowIdx} style={{ width: CHAR_W, height: CHAR_H }} />;
                        }

                        const opacity = isHead ? 1 : 1 - (head - rowIdx) / tail;

                        return (
                            <Text
                                key={rowIdx}
                                style={{
                                    width: CHAR_W,
                                    height: CHAR_H,
                                    fontSize: CHAR_W - 2,
                                    fontFamily: 'monospace',
                                    textAlign: 'center',
                                    lineHeight: CHAR_H,
                                    color: isHead ? onPrimary : primary,
                                    opacity,
                                }}
                            >
                                {char}
                            </Text>
                        );
                    })}
                </View>
            ))}
        </View>
    );
}
