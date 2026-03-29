const { Moodle } = require("moodle-scrape");
const undici = require("undici");

var username, password;
// print process.argv
process.argv.forEach(function (val, index, array) {
 	//console.log(index + ': ' + val);
	if (index == 2){
		username = val;
		//console.log(username);
	}
	if (index == 3){
		password = val;
		//console.log(password);

	}
});

const url = "https://moodle.oakland.edu"; // https://example.com
const moodle = new Moodle(undici.fetch, url);

async function init() {
  //console.time("-- login() time");
  const success = await moodle.login(username, password, {
    refresh: false,
    loginFormPath: "login/index.php",
  });
  //console.timeEnd("-- login() time");

  if (!success) {
    return console.log("ERROR: Login failed.");
  }

  //console.time("-- getInfo() time");
  await moodle.refresh(undefined, { navCourses: false });
  //console.timeEnd("-- getInfo() time");

  console.log(moodle.user);
  console.log(moodle.courses);
  console.log(moodle.tasks);
}

init();
