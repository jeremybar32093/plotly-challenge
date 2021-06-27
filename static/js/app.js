//1.) Declare variables
//    Will be read in with d3.json, but used in subsequent downstream functions
var names;
var subjectMetadata;


// 1.) Read in dataset using d3.json()
d3.json("data/samples.json").then((incomingData) => {
    // 1a.) Create list of Subject IDs to include in dropdown list
    names = incomingData.names;
    
    // 1b.) Find select element using d3, then append 'option' tags
    var selectorList = d3.select("select");
    names.forEach((currValue) => {
        var selectorOption = selectorList.append("option");
        selectorOption.property("textContent", currValue);
    });

    // 1c.) Read in subject metadata to be used for updating demographic info card
    subjectMetadata = incomingData.metadata;
});

//2. Function to update demographic info based on selected subject ID
function updateDemographicInfo(subjectID) {
    //2b. Filter on subjectID passed in to be used to read in proper metadata attributes
    // Filter function comes back as list, so need to just pull 0 index
    var filteredMetadata = subjectMetadata.filter((row) => row.id === subjectID)[0];
    //2a. Use D3 to read in span IDs and update text property
        // subject ID #
    var subjectID = d3.select("#subjectID");
    subjectID.property("textContent",filteredMetadata.id);
        // subject ethnicity
    var subjectEthnicity = d3.select("#subjectEthnicity");
    subjectEthnicity.property("textContent", filteredMetadata.ethnicity);
        // subject gender
    var subjectGender = d3.select("#subjectGender");
    subjectGender.property("textContent", filteredMetadata.gender);
        // subject age
    var subjectAge = d3.select("#subjectAge");
    subjectAge.property("textContent", filteredMetadata.age);
        // subject location
    var subjectLocation = d3.select("#subjectLocation");
    subjectLocation.property("textContent", filteredMetadata.location);
        // subject BBType
    var subjectBBType = d3.select("#subjectBBType");
    subjectBBType.property("textContent", filteredMetadata.bbtype);
        // subject wfreq
    var subjectWFreq = d3.select("#subjectWFreq");
    subjectWFreq.property("textContent", filteredMetadata.wfreq);
};