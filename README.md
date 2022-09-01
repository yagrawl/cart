# cart

A minimalist custom cart implementation for e-commerce. 

# usage instructions

(Assuming that Node is installed on your machine) From the root directory, start the client:
```
cd client && npm i && npm run start
```

run the server:
```
cd server && npm i && npm start
```

Under the `server` directory, create a new file `.env` and copy the following variables:
```
BOLT_API_KEY=<API_KEY>
```

Under the `client` directory, replace the following instances of "publishable key" with yours:
- `client/public/index.html` : replace both instances of `data-publishable-key`. 
- `client/src/container/checkout.tsx` : replace `PUBLISHABLE_KEY`

NOTE: Bolt modal requires the host to be on `https` so tunnel port `3000` (or your client's port) with ngrok.io