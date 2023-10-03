const api = "https://jb-yt.greenwaystart.com/api";
const tokent =
  "perm:0JXQs9C+0YBf0KjQsNGA0YvQv9C40L0=.NDgtMTE=.5ImoKg9xf2bIqnRsbRMnhoG2SFCMxY";
//query= "?query=for:%20me%20%23Unresolved%20&fields=id,summary,title,created,resolved"
const pagination  ="&$skip=0&$top=400"
const query = "?query=project:GreenWay%20%23Unresolved%20&for:%20all&fields=id,summary,title,created,project(name),resolved";
const url = api + "/issues" + query +pagination
  fetch(url, {
    headers: {
      Authorization: "Bearer " + tokent,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Process the data and draw the chart
      drawGanttChart(data);
    })
    .catch((error) => console.error("Error:", error));


function drawGanttChart(data) {
  // Load the Google Charts library
  google.charts.load("current", { packages: ["gantt"],  language: "ru",});
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    // Create a new Gantt chart instance
    const chart = new google.visualization.Gantt(
      document.getElementById("gantt")
    );

    // Define the columns for the chart
    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn("string", "Task ID");
    dataTable.addColumn("string", "Task Name");
    dataTable.addColumn("date", "Start Date");
    dataTable.addColumn("date", "End Date");
    dataTable.addColumn("number", "Duration");
    dataTable.addColumn("number", "Percent Complete");
    dataTable.addColumn("string", "Dependencies");

    // Add data rows to the chart
    for (const task of data) {
      console.log(task.resolved)
      dataTable.addRow([
        task.id,
        task.summary,
        new Date(task.created),
        new Date(task.resolved?task.resolved:new Date()),
        null,
        task.progress,
        null,
      ]);
    }
console.log( data.length)
    const options = {
      height: data.length*50,
      tooltip: { isHtml: true },
      gantt: {
        //sortTasks: false,
        //defaultStartDate: new Date(2022, 3, 28),
        arrow: { color: "#55555555" },
        palette: [
          {
            color: "#ccc",
            dark: "#f98e3d",
            light: "#eee",
          },
        ],
      },
    };

    // Draw the chart with the data and options
    chart.draw(dataTable, options);
  }
}
