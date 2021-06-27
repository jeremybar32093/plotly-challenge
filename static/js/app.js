//1.) Declare variables
//    Will be read in with d3.json, but used in subsequent downstream functions
var names;
var subjectMetadata;
var samples;
var selectedSubjectID;

// 1.) Read in dataset using d3.json() and create variables to be used downstream
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

    // 1d.) Read in subject samples
    samples = incomingData.samples;

    // Call function to update all graphs after initial load - same function executed for "onchange" event on selector dropdown
    // defined at end of script
    handleChange();
});

//2.) Function to update demographic info based on selected subject ID
function updateDemographicInfo(subjectID) {
    //2a). Filter on subjectID passed in to be used to read in proper metadata attributes
    // Filter function comes back as list, so need to just pull 0 index
    var filteredMetadata = subjectMetadata.filter((row) => row.id === subjectID)[0];
    //2b). Use D3 to read in span IDs and update text property
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

// 3. Function to create top 10 bar chart based on select subject ID
function updateTop10BarChart(subjectID) {
    // 3a.) Filter samples on appropriate subject ID
    // NOTE: use parseInt() because within samples, row id is stored as string 
    var filteredSamples = samples.filter((row) => parseInt(row.id) === subjectID)[0];
    
    // 3b.) Create separate array that can be sorted and facilitated into top 10 bar chart
    var sortArray = [];
        // loop through length of otu_ids
        // use regular loop syntax rather than forEach because for each otu_id need to add corresponding index of sample value
    for(i=0; i < filteredSamples.otu_ids.length; i++) {
        // declare empty dictionary to be appended into array defined above
        var sortArrayDict = {};
        // Add key value pair = matching indexes of otu_ids and sample values
        sortArrayDict["otu_id"] = filteredSamples.otu_ids[i];
        sortArrayDict["sample_value"] = filteredSamples.sample_values[i];
        // Append to sortArray defined above
        sortArray.push(sortArrayDict);
    };

    // 3c.) Sort array created from loop above and slice to obtain top 10
    var sortArrayFinal = sortArray.sort((a, b) => b.sample_value - a.sample_value);
    var top10Array = sortArrayFinal.slice(0, 10);
    // Reverse the array to accommodate Plotly's defaults
    reversedData = top10Array.reverse();
    
    // 3d.) Create trace and new plotly object
    var barChartTrace = {
        x: reversedData.map(object => object.sample_value),
        y: reversedData.map(object => `OTU ${object.otu_id}`),
        name: `Subject ID ${subjectID}`,
        type: "bar",
        orientation: "h"
    }

    var data = [barChartTrace];

    var layout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 100
        }
      };

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", data, layout);
        
};

// 4.) Function to create gauge chart based on selected subject ID
function updateGaugeChart(subjectID) {
    //4a). Filter on subjectID passed in to be used to read in proper metadata attributes
    // Filter function comes back as list, so need to just pull 0 index
    var filteredMetadata = subjectMetadata.filter((row) => row.id === subjectID)[0];

    var scrubsPerWeek = filteredMetadata.wfreq;

    // 4b.) Update plotly gauge chart - update ticks if possible
    // Adapted from https://plotly.com/javascript/gauge-charts/
    var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: scrubsPerWeek, // **to be dynamic**
          title: { text: "Belly Button Washing Frequency" },
          type: "indicator",
          mode: "gauge",
          gauge: {
            axis: { range: [null, 9] },
            steps: [
              { range: [0, 1], color: "#f4f8f8"},
              { range: [1, 2], color: "#e9f2f2" },
              { range: [2, 3], color: "#d4e6e5" },
              { range: [3, 4], color: "#bed9d8" },
              { range: [4, 5], color: "#a8cccd" },
              { range: [5, 6], color: "#92bfc0" },
              { range: [6, 7], color: "#7bb4b3" },
              { range: [7, 8], color: "#64a6a6" },
              { range: [8, 9], color: "#4b9a9a" },
            ],
            threshold: {
              line: { color: "purple", width: 10 },
              thickness: 0.75,
              value: scrubsPerWeek //**to be dynamic** 
            }
          }
        }
      ];
      
      var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
      Plotly.newPlot('gauge', data, layout);
};

// 5.) Function to update bubble chart based on selected subjectID
function updateBubbleChart(subjectID) {
    // 5a.) Filter samples on appropriate subject ID
    // NOTE: use parseInt() because within samples, row id is stored as string 
    var filteredSamples = samples.filter((row) => parseInt(row.id) === subjectID)[0];

    // 5b.) Create trace and new plotly object
    var bubbleChartTrace = {
        x: filteredSamples.otu_ids,
        y: filteredSamples.sample_values,
        text: filteredSamples.otu_labels,
        mode:'markers',
        marker:{
            color: filteredSamples.otu_ids,
            size: filteredSamples.sample_values,
        }
    };

    var data = [bubbleChartTrace];

    var layout = {
        title: 'Sample Values by OTU ID',
        showlegend: false,
        xaxis: {
            title: {
                text: "OTU ID"
            }       
        }
    };

    Plotly.newPlot('bubble', data, layout);
};

// Define handleChange function for when user changes selected subject ID
function handleChange() {
    // Use ID defined on select tag to pull dropdown value
    var dropDownMenu = d3.select("#selectData");
    selectedSubjectID = parseInt(dropDownMenu.property("value"));
    
    // Call all functions to update graphs
    updateDemographicInfo(selectedSubjectID);
    updateGaugeChart(selectedSubjectID);
    updateTop10BarChart(selectedSubjectID);
    updateBubbleChart(selectedSubjectID);

    // console.log(selectedSubjectID);

};

// Add event listener for changing subject ID - call all functions to refresh graphs
d3.selectAll("#selectData").on("change", handleChange);