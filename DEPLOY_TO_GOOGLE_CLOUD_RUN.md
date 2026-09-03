# 🚀 Google Cloud Run & Webhook orqali Botni 24/7 To'xtovsiz Ishlatish Yo'riqnomasi

Ushbu loyiha Google Cloud Run va Telegram Webhook bilan **100% integratsiya qilingan**. Brauzerni yopsangiz ham, kompyuterni o'chirsangiz ham bot butunlay to'xtovsiz (24/7) ishlaydi.

---

## 1-USUL: AI Studio orqali 1 marta bosish bilan Deploy qilish ⭐️ (Eng tezkor)

1. AI Studio boshqaruv panelining yuqori o'ng burchagidagi **"Deploy"** (yoki **"Settings" -> "Deploy to Cloud Run"**) tugmasini bosing.
2. O'zingizning Google Cloud hisobingizni tanlang.
3. Kerakli muhit o'zgaruvchilarini (`Environment Variables`) kiriting:
   - `TELEGRAM_BOT_TOKEN`: `8692749017:AAGkpzAkuYLTAN40Utc3XsdFqvs9HT9Nj5I`
   - `GEMINI_API_KEY`: Google Gemini API kalitingiz
4. **Deploy** tugmasini bosing.
5. Deploy yakunlangach, Google sizga doimiy ochiq URL beradi (masalan: `https://davr-academy-bot-xxxx.a.run.app`).

---

## 2-USUL: Google Cloud CLI (Terminal) orqali Deploy qilish 💻

Agar terminaldan foydalansangiz:

```bash
# 1. Google Cloud hisobingizga kiring
gcloud auth login

# 2. Loyiha papkasidan turib to'g'ridan-to'g'ri Cloud Run'ga chiqaring
gcloud run deploy davr-telegram-bot \
  --source . \
  --port 3000 \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars TELEGRAM_BOT_TOKEN="8692749017:AAGkpzAkuYLTAN40Utc3XsdFqvs9HT9Nj5I",GEMINI_API_KEY="SIZNING_GEMINI_KALITINGIZ"
```

---

## 3. Telegram Webhook'ni Ulash (Avtomatik) ⚡️

Cloud Run manzilingizni olganingizdan so'ng, Telegram Webhook'ni ulash uchun atigi 1 ta buyruq yetarli:

### Brauzer orqali yoki curl orqali:
```bash
curl -X POST https://SIZNING-CLOUD-RUN-URL.run.app/api/bot/connect-cloud-run \
  -H "Content-Type: application/json" \
  -d '{"cloudRunUrl": "https://SIZNING-CLOUD-RUN-URL.run.app"}'
```

Yoki to'g'ridan-to'g'ri Telegram API orqali:
```
https://api.telegram.org/bot8692749017:AAGkpzAkuYLTAN40Utc3XsdFqvs9HT9Nj5I/setWebhook?url=https://SIZNING-CLOUD-RUN-URL.run.app/api/telegram-webhook
```

---

## 4. Bepul Render.com yoki Railway.app orqali Ulash (Muqobil)

Agar Google Cloud Run o'rniga boshqa 24/7 bepul server kerak bo'lsa:
1. **AI Studio** -> **Export to GitHub** qiling.
2. [Render.com](https://render.com) ga kiring -> **New Web Service** -> GitHub repozitoriyangizni tanlang.
3. Sozlamalar:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start` (yoki `node dist/server.cjs`)
   - **Environment Variables:** `TELEGRAM_BOT_TOKEN` va `GEMINI_API_KEY`
4. Render sizga bepul `https://sizning-bot.onrender.com` manzilini beradi.
5. Bot avtomatik 365 kun 24/7 ishlaydi!
