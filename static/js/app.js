// 1.) Read in dataset using d3.json()
d3.json("data/samples.json").then((incomingData) => {
    // 1a.) Create list of Subject IDs to include in dropdown list
    var names = incomingData.names;
    // 1b.) Find select element using d3, then append 'option' tags
    var selectorList = d3.select("select");
    names.forEach((currValue) => {
        var selectorOption = selectorList.append("option");
        selectorOption.property("textContent", currValue);
        console.log(currValue);
    });
});