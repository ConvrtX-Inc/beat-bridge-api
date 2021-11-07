# Beat Bridge Backend

## Description

Beat Bridge Project


## Links

- API Documentation: http://localhost:3000/docs
- API : http://localhost:3000/api/v1


## Comfortable development

```bash
cp env-example .env
```

Run additional container:

```bash
npm install

npm run migration:run

npm run seed:run

npm run start:dev
```

## Database utils

Generate migration

```bash
npm run migration:generate -- CreateNameTable
```

Run migration

```bash
npm run migration:run
```

Revert migration

```bash
npm run migration:revert
```

Drop all tables in database

```bash
npm run schema:drop
```

Run seed

```bash
npm run seed:run
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e
```
