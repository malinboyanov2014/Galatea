import { View } from 'react-native';
import MatrixLoadingProgressIndicator from '../MatrixLoadingProgressIndicator';

export function TableLoading() {
	return (
		<View>
			<MatrixLoadingProgressIndicator height={41} />
		</View>
	);
}
