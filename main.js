const api = "https://jb-yt.greenwaystart.com/api";
const tokent =
  "perm:0JXQs9C+0YBf0KjQsNGA0YvQv9C40L0=.NDgtMTI=.6aZq26jpCTzmNyqZbvNSEq2dihcgwS";
//query= "?query=for:%20me%20%23Unresolved%20&fields=id,summary,title,created,resolved"
const pagination = "&$skip=0&$top=300"
//const props  = "&fields=$type,id,summary,value($type,avatarUrl,buildLink,color(id),fullName,id,isResolved,localizedName,login,minutes,name,presentation,text))"//?fields=$type,id,summary,customFields($type,id,projectCustomField($type,id,field($type,id,name)),value($type,avatarUrl,buildLink,color(id),fullName,id,isResolved,localizedName,login,minutes,name,presentation,text))'"
const props = `&fields=id,summary,title,created,project(name),resolved,description,updater(id,login,email),reporter(id,login,email)`;
const query = `?query=project:GreenWay&for:%20all%20%23Unresolved%20` + props;
const url = api + "/issues" + query + pagination
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
    const Weeks4 = Date.now() - 2419200000;
    let filtredTasks = data.filter((task) => {
      return task.created >= Weeks4
    })

    filtredTasks = filtredTasks.map((task) => {
      gantt.templates.leftside_text = function(start, end, task){
        return  "<b>"+task.updater.login+"</b>";
      };
      //gantt.getLightboxSection('description').setValue(task.description);
      return {
        id: task.id,
        start_date: formatDate(task.created),
        end_date: formatDate(task.resolved), //formatDate(Date.now()),
        text: task.summary,
        description: getObject(task.description)[0].text,
        project: {
          $type: task.project.$type,
          name: task.project.name,
        },
        resolved: formatDate(task.resolved),
        updater: task.updater,
        $type: task.$type,
      }
    })

    gantt.config.date_format = "%Y.%n.%j %H:%i:%s";
    //    gantt.i18n.setLocale("ru");
    //gantt.config.readonly = true;
    gantt.init("gantt", new Date(2023, 8, 1), new Date());

    gantt.config.columns = [
      { name: "text", label: "Task name", tree: true, width: '*' },
      { name: "duration", label: "Duration", align: "center", width: 50 },
    ];
    gantt.config.lightbox.sections=[
      {name:"description", height:370, map_to:"description", type:"textarea", focus:true},
      {name:"time",        height:72, map_to:"auto", type:"duration"}
  ];
    gantt.parse({ "data": filtredTasks })
  })
  .catch((error) => console.error("Error:", error));

function formatDate(date) {
  return `${new Date(date).getFullYear()}.${new Date(date).getMonth() + 1}.${new Date(date).getDate()} ${new Date(date).getHours()}:${new Date(date).getMinutes()}:${new Date(date).getSeconds()}`
};

function getObject(str) {
  let bold = false, italics = false;
  let output = [];
  let text = str.split('').reduce((a, b) => {
    if (b == '*') {
      if (bold) {
        if (a != '') {
          if (italics)
            output.push({ text: a, bold: true, italics: true });
          else
            output.push({ text: a, bold: true });
        }
        bold = false;
      }
      else {
        if (italics)
          output.push({ text: a, italics: true })
        else
          output.push({ text: a })
        bold = true;
      }
      return '';
    }
    else if (b == '_') {
      if (italics) {
        if (a != '') {
          if (bold)
            output.push({ text: a, bold: true, italics: true });
          else
            output.push({ text: a, italics: true });
        }
        italics = false;
      }
      else {
        if (bold)
          output.push({ text: a, bold: true })
        else
          output.push({ text: a })
        italics = true;
      }
      return '';
    }
    else {
      return a + b;
    }
  }, '');
  if (text != '')
    output.push({ text: text });
  return output;
}
