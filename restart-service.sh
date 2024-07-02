# resetservice.sh
#!/bin/bash
pm2 stop GPTTranslateTelegram
pm2 delete GPTTranslateTelegram
pm2 save
rm -rf ~/apps/GPTTranslateTelegram
mkdir ~/apps
mkdir ~/apps/GPTTranslateTelegram
cp -r ~/translate-runner/_work/GPTTranslateTelegram/GPTTranslateTelegram/* ~/apps/GPTTranslateTelegram
cp ~/translate.env ~/apps/GPTTranslateTelegram/.env
cd ~/apps/GPTTranslateTelegram
pm2 start ecosystem.config.js
pm2 save