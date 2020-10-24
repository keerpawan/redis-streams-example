# Express Redis Docker app

Requirements: [Docker Community Edition](https://www.docker.com/community-edition)

To start the app run: `yarn dev`.

Will start producer on port 3000 and consumer on port 3001.

# Endpoints

## Sending Data

```sh
curl curl http://localhost:3000?some=value&some-other=other-value
```

## Fetching Data

```sh
curl http://localhost:3001
```
