# Sinppr API

## Adding Security

This branch deals with two security measures:

- encrypting the snippets
- creating user accounts

The big concepts at play are

- [encryption](https://swe-docs.netlify.app/backend/encryption)
- [hashing](https://swe-docs.netlify.app/backend/hashing)
- the [basic auth](https://swe-docs.netlify.app/backend/basic-auth.html)
  protocol

The primers linked to above are designed for colleagues to brush up on the
details, but it's fine to share them with apprentices to if you think they would
appreciate any of the details.

## Things to see and do

### encrypt.js

In `utils/encrypt.js` we can see the helper functions which encrypt and decrypt
data. There's quite a lot going on here and apprentices might want to search for
something simpler but less secure.

In order to use the functions, you will need to generate a 32-byte key. Recall
that **1 byte = 8 bits**, so 32 bytes is 256 bits, as required by the SHA256
algorithm that AES is based on. The function expects these 32 bytes as hex.

```bash
openssl rand -hex 32
```

would give us

```bash
df11c0c1d288a5dd9fc5e1aa0b06cca0b591244e8f033d47f23130dd2ac2c2a3
```

(You will notice that this is 64 characters long: 1 byte in hex is represented
by a pair of characters.)

Save your key in the `.env` file, then you can add some code to `encrypt.js`

```js
const text = 'Hello, world!'
const encrypted = encrypt(text)
const decrypted = decrypt(encrypted)

console.log(encrypted)
console.log(decrypted)
```

to demonstrate it. It is worth talking about why we put this in a `.env` file
and let them see you doing this step.

### Encrypting user data

In `snippet.js` we can see that new posts are now being encrypted!

Try adding `console.log` in the `POST /snippet` endpoint so you can see the data
which actually gets stored, then try:

```bash
curl -v -XPOST \
-H "Content-type: application/json" \
-d '{ "code" : "print(2 + 2)", "language" : "Python" }' \
'http://localhost:5000/snippet' | json_pp
```

Notice that the data is encrypted in the data store, but decrypted before being
returned by the API.

### Creating a user

To create a user, hit

```bash
curl -v -XPOST \
-H 'Authorization: Basic dGVzdEB1c2VyLmNvbTpwYXNzd29yZDEyMw==' \
'http://localhost:5000/user' | json_pp
```

Note that `dGVzdEB1c2VyLmNvbTpwYXNzd29yZDEyMw==` is the Base 64 encoding of the
string `'test@user.com:password123'`. This is the standard way of sending
credentials with basic auth. See
[basic auth](https://swe-docs.netlify.app/backend/basic-auth.html) for more
information.

You could add a `console.log(users)` in this endpoint to verify that the
password gets hashed and salted.

### basicAuth

Take a look at the `basicAuth.js` middleware. It parses out the credentials from
the auth header and saves them in the `req` object for use by other
middleware/controllers.

This is implemented in the `GET /user` endpoint, which checks the password
against the stored value before sending back the user's data. We can say that
the `GET /user` endpoint is password protected.

Try accessing it with the header (you need to `POST` this user first!)

```bash
curl -v -XGET \
-H 'Authorization: Basic dGVzdEB1c2VyLmNvbTpwYXNzd29yZDEyMw==' \
'http://localhost:5000/user' | json_pp
```

without the header

```bash
curl -v -XGET \
'http://localhost:5000/user' | json_pp
```

or with the wrong password

```bash
curl -v -XGET \
-H 'Authorization: Basic dGVzdEB1c2VyLmNvbTpwYXNzd29yZDEyNA==' \
'http://localhost:5000/user' | json_pp
```
