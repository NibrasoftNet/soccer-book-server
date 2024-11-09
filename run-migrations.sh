#!/bin/sh

# Run TypeORM migrations
npm run typeorm -- --dataSource=dist/database/data-source.js migration:run