import GView from "@/src/common/GView";
import { useRef } from "react";
import { FlatList } from "react-native";
import { TableEmpty } from "./TableEmpty";
import { TableFooter } from "./TableFooter";
import { TableHeader } from "./TableHeader";
import { TableLoading } from "./TableLoading";
import { TableRow } from "./TableRow";
import type { TableListProps } from "./types";

export { TableLoading } from "./TableLoading";
export type { Column, TableListProps } from "./types";

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
  styles,
  itemClassName,
}: TableListProps<T>) {
  const listRef = useRef<FlatList<any>>(null);
  const canLoadMore = data.length > 0;

  return (
    <GView style={[{ flex: 1 }, style]} className="relative">
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(_, i) => i.toString()}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingBottom: showFooter ? 32 : 8,
        }}
        stickyHeaderIndices={stickyHeader && showHeader ? [0] : undefined}
        removeClippedSubviews={false}
        initialNumToRender={Math.max(data.length, 10)}
        maxToRenderPerBatch={Math.max(data.length, 10)}
        windowSize={21}
        nestedScrollEnabled
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!isLoading && canLoadMore) {
            onNextPage?.([...data]);
          }
        }}
        ListHeaderComponent={
          showHeader ? (
            <TableHeader
              columns={columns}
              actions={!!actions}
              actionsHeader={actionsHeader}
              actionsWidth={actionsWidth}
              isExpandable={isExpandable}
              styles={styles?.header}
            />
          ) : null
        }
        ListEmptyComponent={!isLoading ? <TableEmpty /> : <></>}
        ListFooterComponent={isLoading ? <TableLoading /> : null}
        renderItem={({ item, index }) => (
          <TableRow
            item={item}
            index={index}
            size={data.length}
            columns={columns}
            actions={actions}
            actionsWidth={actionsWidth}
            styles={{
              item: styles?.item,
              row: styles?.row,
              itemStyle: styles?.itemStyle,
              rowStyle: styles?.rowStyle,
            }}
            itemClassName={itemClassName}
          />
        )}
      />
      {showFooter && stickyHeader ? (
        <TableFooter
          onScrollToTop={() =>
            listRef.current?.scrollToOffset({ offset: 0, animated: true })
          }
          styles={styles?.footer}
        />
      ) : null}
    </GView>
  );
}
