import GText from '@/src/common/GText';
import type { ReactNode } from 'react';
import type { DimensionValue } from 'react-native';
import { View } from 'react-native';
import type { Column } from './types';

interface TableHeaderProps<T> {
	columns: Column<T>[];
	actions?: boolean;
	actionsHeader?: ReactNode;
	actionsWidth?: DimensionValue;
	isExpandable?: boolean;
}

export function TableHeader<T>({
	columns,
	actions,
	actionsHeader,
	actionsWidth,
	isExpandable,
}: TableHeaderProps<T>) {
	return (
		<View className='z-10 flex-row p-3'>
			{columns.map((col, idx) => (
				<View
					key={String(col.id ?? col.key ?? idx)}
					className='min-w-0'
					style={{ flex: col.flex ?? 1 }}
				>
					<GText className="font-semibold">{col.title}</GText>
				</View>
			))}
			{actions ? (
				<View
					className="flex-none items-end justify-center"
					style={actionsWidth != null ? { width: actionsWidth } : undefined}
				>
					{typeof actionsHeader === 'string' ? (
						<GText className="font-semibold">{actionsHeader}</GText>
					) : (
						actionsHeader
					)}
				</View>
			) : null}
			{isExpandable && <View className="ml-3 w-[18]" />}
		</View>
	);
}
