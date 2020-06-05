
d3.json('data/samples.json').then(function(samplesData) {
  function init(){
    //grabs data from samples.json and adds options to dropdown menu on page
    var samplesArray = samplesData.samples.map(rows => rows.id);
  
    // loop to add dropdown menu values for each sample
    for (let i = 0; i < samplesArray.length; i++) {
      var option = d3.select('#selDataset')
        .append('option')
        .attr('value',i);
      option.text(`${samplesArray[i]}`);
    }
  
    // calls functions to initialize barchart and metadata for default sample
    buildBarChart();
    showMetadata();
    bubbleChart();
  }

    // bubblechart function
  function bubbleChart(){
    var sampleData = grabData();
    // * Use `otu_ids` for the x values.
    var xvalues = sampleData.otu_id;
    // * Use `sample_values` for the y values.
    var yvalues = sampleData.sampleValues;
    // * Use `sample_values` for the marker size.
    var markerSize = sampleData.sampleValues;
    // * Use `otu_ids` for the marker colors.
    var markerColor = sampleData.otu_id;
    // * Use `otu_labels` for the text values.
    var textValues = sampleData.otuLabels;

    var trace1 = {
      x: xvalues,
      y: yvalues,
      mode: 'markers',
      marker: {
        size: markerSize,
        color: xvalues
      },
      text: textValues
    };

    var data = [trace1];



    Plotly.newPlot('bubble', data);
  }

  // // // -----------------------bar chart based on dropdown value-----------------------
  // // // function changes visualizations based on dropdown menu value chosen

  d3.select('#selDataset').on('change',optionChanged)

  function optionChanged(){
    // calls function to build appropriate bar chart
    buildBarChart();
    // metadata part
    d3.select('#sample-metadata').html('')
    showMetadata();

  }

  // // -----------------------metadata function-----------------------
  // // function to grab metadata and displays it based on dropdown value
  function showMetadata(){
    var dropdownMenu = d3.select('#selDataset');
    var dataset = dropdownMenu.property('value');
    // locates metadata section on page
    var metadata = d3.select('div.panel-body');

    // var for all metadata object needed to show on page
    var metadataObject = samplesData.metadata[dataset];
    
    // second try
    var obj = Object.entries(metadataObject);
    // console.log(obj);

    // loop to add metadata
    obj.forEach(element => {
      metadata.append('p').text(`${element[0]}: ${element[1]}`);
    });

  } ; 

  // // -----------------------bar chart builder function-----------------------
  // // function builds chart based off grabData() function
  function buildBarChart(){
    var results = grabData();

    // Sample Values for x axis
    var xValues = results.sampleValues.slice(0,10);

    // OTU IDs for Y axis
    var yValues = results.otu_id
      .slice(0,10)
      .map(rows => 'OTU ' + rows.toString());
    
    // values for hover text
    var hoverText = results.otuLabels.slice(0,10);

    // build trace
    var trace1 = {
      x: xValues.reverse(),
      y: yValues.reverse(),
      orientation: 'h',
      type: 'bar',
      text: hoverText
      };

    var barData = [trace1];
    
    // plot bar chart
    Plotly.newPlot("bar", barData);
  };

  // -----------------------data grab function-----------------------
  // function grabs data based off dropdown menu option selected
  function grabData(){
    // var to select dropdown menu and value
    var dropdownMenu = d3.select('#selDataset');
    var dataset = dropdownMenu.property('value');
    
    // use dataset var to get the needed values from samplearray
    var sampleValues = samplesData.samples[dataset].sample_values;

    // get values needed for outid
    var otu_id = samplesData.samples[dataset].otu_ids;
    
    // values for otu_labels
    var otuLabels = samplesData.samples[dataset].otu_labels;

    var dataResults = {
      sampleValues : sampleValues,
      otu_id: otu_id,
      otuLabels: otuLabels
    };
    
    return dataResults;
  }

  init();
});
