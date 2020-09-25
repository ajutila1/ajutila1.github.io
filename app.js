// Create function to make bar and bubble graphs
function graphs(id) {

    // Import data from json file
    d3.json("./data/samples.json").then((importedData) => {
        console.log(importedData);

        // Filter to get specific ID
        var personData = importedData.samples.filter(sample => sample.id.toString() === id)[0];
        console.log(personData);

        // Collect only the top ten samples
        var sampleValues = personData.sample_values.slice(0,10).reverse();
        console.log(sampleValues);

        // Collect the names
        var otuIDs = personData.otu_ids.slice(0,10).reverse();
        console.log(otuIDs);

        // Reformat names
        var otuIDsFinal = otuIDs.map(base => "OTU" + base)

        // Collect labels
        var otuLabels = personData.otu_labels.slice(0,10).reverse();
        console.log(otuLabels);

        // Create trace for bar graph
        var trace1 = {
            x: sampleValues,
            y: otuIDsFinal,
            text: otuLabels,
            type: "bar",
            orientation: "h",
        };

        var data1 = [trace1]

        // Graph data
        Plotly.newPlot("bar", data1);

        // Using same data, create trace for bubble graph
        var trace2 = { 
            x: personData.otu_ids,
            y: personData.sample_values,
            mode: "markers",
            marker: {
                size: personData.sample_values,
                color: personData.otu_ids
            },
            text: personData.otu_labels

            };

        var data2 = [trace2];

        // Add title to bubble graph
        var layout = {
            xaxis: {title: "OTU ID"},
        };

        // Create bubble graph
        Plotly.newPlot("bubble", data2, layout);
    }
)};

// Create function for demographic information panel
function demographicInfo(id) {

    // Import data from json file
    d3.json("./data/samples.json").then((importedData) => {

        // Collect the metadata from json data
        var rawData = importedData.metadata;
        console.log(rawData);

        // Filter data to specific ID
        var filteredData = rawData.filter(person => person.id.toString() === id)[0];

        // Select html panel for demographic data display
        var demoData = d3.select("#sample-metadata");

        // Clear panel for updated data
        demoData.html("");

        // Append the data into the panel
        Object.entries(filteredData).forEach((key) => {
            demoData.append("h5").text(key[0] + ": " + key[1]);
        });
    });
};

// Function for change event
function optionChanged(id) {
    graphs(id);
    demographicInfo(id);
}

// Initial data rendering
function init() {

    // Select the ID dropdown
    var dataSelect = d3.select("#selDataset");

    // Import data from json file 
    d3.json("./data/samples.json").then((importedData) => {
        console.log(importedData);

        // Display IDs in dropdown menu
        importedData.names.forEach(function(name) {
            dataSelect.append("option").text(name).property("value");
        });

        // Run graphing and demo panel functions
        graphs(importedData.names[0]);
        demographicInfo(importedData.names[0]);
        
    });
}

init();