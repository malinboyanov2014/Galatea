import type { ReactNode } from 'react';
import { useRef } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';

interface Column<T> {
	id?: string;
	key?: keyof T;
	title: string;
	flex?: number;
	accessor?: (row: T) => any;
	render?: (value: any, row: T) => ReactNode;
	className?: string;
}

interface TableListProps<T> {
	columns: Column<T>[];
	data: T[];
	actions?: (row: T) => ReactNode;
	actionsHeader?: ReactNode;
	actionsWidth?: number | string;
	style?: StyleProp<ViewStyle>;
	stickyHeader?: boolean;
	showFooter?: boolean;
	isLoading?: boolean;
	onNextPage?: (lastItem: T[] | undefined) => void;
	isExpandable?: boolean;
	headerClassName?: string;
	rowClassName?: string;
}

export function TableList<T>({
	columns = [],
	data = [],
	actions,
	actionsHeader,
	actionsWidth,
	style,
	stickyHeader = true,
	showFooter = false,
	isLoading = false,
	onNextPage,
	isExpandable,
}: TableListProps<T>) {
	const listRef = useRef<FlatList<any>>(null);
	const canLoadMore = data.length > 0;

	return (
		<View style={[{ flex: 1 }, style]} className="relative">
			<FlatList
				ref={listRef}
				data={data}
				keyExtractor={(_, i) => i.toString()}
				style={{ flex: 1 }}
				contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: showFooter ? 32 : 8 }}
				stickyHeaderIndices={stickyHeader ? [0] : undefined}
				onEndReachedThreshold={0.5}
				onEndReached={() => {
					if (!isLoading && canLoadMore) {
						onNextPage?.([...data]);
					}
				}}
				ListHeaderComponent={
					<View className='z-10 flex-row p-3'>
						{columns.map((col, idx) => (
							<View
								key={String(col.id ?? col.key ?? idx)}
								className='min-w-0'
								style={{ flex: col.flex ?? 1 }}
							>
								<Text className="font-semibold">{col.title}</Text>
							</View>
						))}
						{actions ? (
							<View
								className="flex-none items-end justify-center"
								style={actionsWidth != null ? { width: actionsWidth } : undefined}
							>
								{typeof actionsHeader === 'string' ? (
									<Text className="font-semibold">{actionsHeader}</Text>
								) : (
									actionsHeader
								)}
							</View>
						) : null}
						{isExpandable && <View className="ml-3 w-[18]"></View>}
					</View>
				}
				ListEmptyComponent={(!isLoading && <Text className="h-10">No results</Text>) || null}
				ListFooterComponent={
					isLoading ? (
						<View className="items-center p-4">
							<ActivityIndicator />
						</View>
					) : null
				}
				renderItem={({ item }) => (
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
										{col.render ? col.render(value, item) : <Text>{String(value ?? '')}</Text>}
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
				)}
			/>
			{showFooter && stickyHeader ? (
				<View className='absolute bottom-0 left-0 right-0'>
					<View className="flex-row items-center gap-1 p-3">
						<Pressable
							className="ml-auto"
							onPress={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
						>
							<Text>Back to top</Text>
						</Pressable>
					</View>
				</View>
			) : null}
		</View>
	);
}
