/**
 * Simple action to parse the data from promotional item_in_season
 */
export default ({dataKey, data}) => {

	// More null/empty checks might be needed
	if ('promotions' in data) {
		data = data.promotions; // Get one more level of data
	}

	for (var i = 0; i < data.length; i++) {
		const item = data[i];

		if ("key" in item && item.key === dataKey) {
			return item;
		}
	}

	return null;
}
