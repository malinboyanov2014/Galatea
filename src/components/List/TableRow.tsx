import GText from '@/src/common/GText';
import type { ReactNode } from 'react';
import type { DimensionValue } from 'react-native';
import { View } from 'react-native';
import type { Column } from './types';

interface TableRowProps<T> {
	item: T;
	columns: Column<T>[];
	actions?: (row: T) => ReactNode;
	actionsWidth?: DimensionValue;
}

export function TableRow<T>({ item, columns, actions, actionsWidth }: TableRowProps<T>) {
	return (
		<View className='my-1 rounded-md shadow-sm'>
			<View className='flex-row overflow-hidden rounded-md p-3'>
				{columns.map((col, idx) => {
					const value = col.accessor
						? col.accessor(item)
						: col.key
							? (item as any)[col.key as any]
							: undefined;
					return (
						<View
							key={String(col.id ?? col.key ?? idx)}
							className='min-w-0 overflow-hidden'
							style={{ flex: col.flex ?? 1 }}
						>
							{col.render ? col.render(value, item) : <GText>{String(value ?? '')}</GText>}
						</View>
					);
				})}
				{actions ? (
					<View
						className="flex-none items-end justify-center"
						style={actionsWidth != null ? { width: actionsWidth } : undefined}
					>
						{actions(item)}
					</View>
				) : null}
			</View>
		</View>
	);
}
