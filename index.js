const config = require("./config.json");
const request = require("request");
const baseUrl = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?";
const { Telegraf } = require("telegraf");

let bot;
let districtToProcess = 0;

async function main() {
  console.log("Starting the script. Please do not close it if you want to get notified.");
  if (config.telegram_bot_token) {
    bot = new Telegraf(config.telegram_bot_token);
    bot.command("start", (ctx) => {
      bot.telegram.sendMessage(ctx.chat.id, "This chat's id is: " + ctx.chat.id, {});
    });
    bot.on("message", (ctx) => {
      bot.telegram.sendMessage(ctx.chat.id, "This chat's id is: " + ctx.chat.id, {});
    });
    bot.launch();
  }
  // 100 Requests allowed per 5 min -> A request can be made every 3 seconds (Ignoring burst)
  // To play it safe, we'll be making a request every 5 seconds
  setInterval(processDistrict, 5000);
}

function processDistrict() {
  const requestUrl = baseUrl + "district_id=" + config.districts[districtToProcess] + "&date=" + getDate();
  console.log("Checking district", config.districts[districtToProcess]);
  request(requestUrl, { json: true }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }

    body.centers.forEach((center) => {
      let sessionFound = false;
      center.sessions.forEach((session) => {
        const availableSlots = sessionAvailability(session);
        if (availableSlots > 0) {
          if (!sessionFound) {
            console.log(center.name);
            console.log(center.address);
            console.log(center.district_name + ", " + center.state_name + " - " + center.pincode);
            sessionFound = true;
          }
          console.log(availableSlots + " slots available on " + session.date);
          console.log(session.slots);

          if (bot && config.telegram_chat_id) {
            bot.telegram.sendMessage(
              config.telegram_chat_id,
              `Found ${availableSlots} slots on ${session.date} at ${center.name}, ${center.district_name}, ${center.state_name} - ${center.pincode}`
            );
          }
        }
      });
    });
  });

  districtToProcess++;
  if (districtToProcess >= config.districts.length) {
    districtToProcess = 0;
  }
}

function getDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();

  return dd + "-" + mm + "-" + yyyy;
}

function sessionAvailability(session) {
  if (!session.vaccine.toLowerCase().includes(config.vaccine.toLowerCase())) {
    return 0;
  }
  if ((session.min_age_limit && session.min_age_limit > config.age) || (session.max_age_limit && session.max_age_limit < config.age)) {
    return 0;
  }
  if (config.dose == 1) {
    return session.available_capacity_dose1;
  } else {
    return session.available_capacity_dose2;
  }
}

main();
