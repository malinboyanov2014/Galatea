import { useRef } from 'react';
import { FlatList, View } from 'react-native';
import { TableEmpty } from './TableEmpty';
import { TableFooter } from './TableFooter';
import { TableHeader } from './TableHeader';
import { TableLoading } from './TableLoading';
import { TableRow } from './TableRow';
import type { TableListProps } from './types';

export { TableLoading } from './TableLoading';
export type { Column, TableListProps } from './types';

export function TableList<T>({
	columns = [],
	data = [],
	actions,
	actionsHeader,
	actionsWidth,
	style,
	showHeader = false,
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
				ListHeaderComponent={showHeader ? (
					<TableHeader
						columns={columns}
						actions={!!actions}
						actionsHeader={actionsHeader}
						actionsWidth={actionsWidth}
						isExpandable={isExpandable}
					/>
				) : null}
				ListEmptyComponent={!isLoading ? <TableEmpty /> : <></>}
				ListFooterComponent={isLoading ? <TableLoading /> : null}
				renderItem={({ item }) => (
					<TableRow
						item={item}
						columns={columns}
						actions={actions}
						actionsWidth={actionsWidth}
					/>
				)}
			/>
			{showFooter && stickyHeader ? (
				<TableFooter onScrollToTop={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })} />
			) : null}
		</View>
	);
}
