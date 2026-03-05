import type { ReactNode } from 'react';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';

export interface Column<T> {
	id?: string;
	key?: keyof T;
	title: string;
	flex?: number;
	accessor?: (row: T) => any;
	render?: (value: any, row: T) => ReactNode;
	className?: string;
}

export interface TableListProps<T> {
	columns: Column<T>[];
	data: T[];
	actions?: (row: T) => ReactNode;
	actionsHeader?: ReactNode;
	actionsWidth?: DimensionValue;
	style?: StyleProp<ViewStyle>;
	showHeader?: boolean;
	stickyHeader?: boolean;
	showFooter?: boolean;
	isLoading?: boolean;
	onNextPage?: (lastItem: T[] | undefined) => void;
	isExpandable?: boolean;
	headerClassName?: string;
	rowClassName?: string;
}
