Follow the steps to build and run your own Docker container of wassup.

The ready-to-serve Docker image will be online later.

0. (Optional) If you don't have a PostgreSQL server running, setup one with the command:

`docker run --name wassup_postgres -e POSTGRES_PASSWORD=password_here -d postgres`

1. Clone https://github.com/wassuphq/wassup.git

2. `cd wassup`

3. (Optional) Configure config/prod.exs. Here I just add the `https` key to configure SSL.
```
config :wassup_app, WassupAppWeb.Endpoint,
  url: [scheme: "https", host: app_hostname, port: 443],
  https: [
    :inet6,
    port: 443,
    cipher_suite: :strong,
    keyfile: System.get_env("SSL_KEY_PATH"),
    certfile: System.get_env("SSL_CERT_PATH")
  ],
  ...
```

4. Prepare your wassup's `data` folder. It can be anywhere, just make sure to put in there 2 SSL certificate files: privatekey file and cert file. Follow letsencrypt instructions to learn more about obtaining the files. If you already have, take note of the file names to put in the ENVs called WASSUP_SSL_KEY_PATH & WASSUP_SSL_CERT_PATH.

5. Now you're ready to build.

`docker build -t wassup .`

6. Run the built image. Remember to adjust the --mount path, all the environment variables -e, especially DATABASE_URL, along with the file names (privkey.pem & fullchain.pem, change those to your file names. Remember, file names, not location).

More infomation about the environment variables is available [here](https://github.com/wassuphq/wassup/blob/master/.env.example).

```
docker run -d -p 4000:443 --name wassup --network wassup --mount src=/path/to/wassup/data,dst=/root/wassup/data,type=bind \
-e APP_NAME=Wassup \
-e APP_URL=https://localhost:4000 \
-e APP_HOSTNAME=localhost \
-e MAIL_SENDER_EMAIL=support@wassupapp.com \
-e SECRET_KEY_BASE=XXXXX \
-e DATABASE_URL=postgres://postgres:password_here@localhost/wassup_app_prod \
-e GOOGLE_CLIENT_ID=XXXXXXX \
-e GOOGLE_CLIENT_SECRET=XXXXXXX \
-e GOOGLE_REDIRECT_URI=http://wassupapp.com/auth/google/callback \
-e REGISTRATION_DISABLED=false \
-e SMTP_PROVIDER_DOMAIN=XX \
-e SMTP_USERNAME=XXX \
-e SMTP_PASSWORD=XXXX \
-e SSL_KEY_PATH=/root/wassup/data/privkey.pem \
-e SSL_CERT_PATH=/root/wassup/data/fullchain.pem \
wassup
```
