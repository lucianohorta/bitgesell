// GENERATE DUMMY ITEMS TO TEST PAGINATION
// run with:  node src/utils/generateDummyItems.js (inside frontend folder)
function generateDummyItems(count = 20) {
    const dummyItems = [];

    for (let i = 1; i <= count; i++) {
        dummyItems.push({
        id: i,
        name: `Item ${i}`,
        description: `Description for item ${i}`,
        });
    }

    return dummyItems;
}

export default generateDummyItems;
