const api = "https://jb-yt.greenwaystart.com/api";
const tokent =
  "perm:0JXQs9C+0YBf0KjQsNGA0YvQv9C40L0=.NDgtMTI=.6aZq26jpCTzmNyqZbvNSEq2dihcgwS";
//query= "?query=for:%20me%20%23Unresolved%20&fields=id,summary,title,created,resolved"
const pagination  ="&$skip=0&$top=400"
const query = `?query=project:GreenWay%20%23Unresolved%20&for:%20all&fields=id,summary,title,created,project(name),resolved`;
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
    const twoWeeks = Date.now() - 1209600000;
    let filtredTasks = data.filter((task) => {
      return task.created >= twoWeeks
    })

    filtredTasks = filtredTasks.map((task) => { 
      return {
        id: task.id,
        start_date: formatDate(task.created),
        text: task.summary,
        project: {
          $type: task.project.$type,
          name: task.project.name,
        },
        resolved: task.resolved,
        $type: task.$type,
      }
    })

    gantt.config.date_format = "%Y.%n.%j %H:%i:%s";
    gantt.init("gantt", new Date(2023, 7, 1), new Date(2023, 9, 31));
    gantt.parse({"data": filtredTasks})
  })
  .catch((error) => console.error("Error:", error));

  function formatDate(date) {
    return `${new Date(date).getFullYear()}.${new Date(date).getMonth() + 1}.${new Date(date).getDate()} ${new Date(date).getHours()}:${new Date(date).getMinutes()}:${new Date(date).getSeconds()}`
  };