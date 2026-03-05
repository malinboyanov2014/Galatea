import GText from '@/src/common/GText';
import { Pressable, View } from 'react-native';

interface TableFooterProps {
	onScrollToTop: () => void;
}

export function TableFooter({ onScrollToTop }: TableFooterProps) {
	return (
		<View className='absolute bottom-0 left-0 right-0'>
			<View className="flex-row items-center gap-1 p-3">
				<Pressable className="ml-auto" onPress={onScrollToTop}>
					<GText>Back to top</GText>
				</Pressable>
			</View>
		</View>
	);
}
