# CoWIN Slot Notifier

I've been trying to book a vaccine slot for a week but it takes forever to search all districts (need to search one by one) and they're apparently always booked. So, I created a script to notify me whenever a slot is available.

## Instructions

To use the script, rename `config.json.sample` to `config.json`, and fill your data in it. Afterwards, run `node index.js`.

### Config

| Property name | Details |
| - | - |
| districts | List of district IDs that you want to search. Get your relevant district IDs from `districts.csv` file in this repo. |
| vaccine | The vaccine that you want. Select one from Sputnik, Covaxin, and Covishield. |
| dose | The dose you want to get. Enter 1 for first dose, and 2 for second dose |
| age | Your age. It is used to filter out slots that you are not eligible for. |
| telegram_bot_token | If you want to get notified by telegram, message @botfather to create a telegram bot and get a token |
| telegram_chat_id | Telegram chat id where you want notifications. To get this, start the script after filling `telegram_bot_token` but without this field in the config. Message your bot while the script is running and it'll give you your chat id. Put that in the config and restart |

## Notes

- Only run one instance of this app at a time or else risk getting banned by CoWIN.
- You can use something like pm2 to run this in background and auto restart on any unexpected errors.
- This script is meant for personal use.
- I can add detailed instructions if there's demand :)
