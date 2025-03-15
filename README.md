### 1. Install dependencies
```
npm install
```

### 2. Start the Docker containers
```
docker-compose up -d
```

### 3. Run Prisma migrations:
```
npm run prisma:migrate
```

### 4. To create migrations
```
npx prisma migrate dev --name init
```

### 5. Start the application
```
npm run dev
```