# Installation

---

## Table of Contents <!-- omit in toc -->

- [Comfortable development](#comfortable-development)
- [Video guideline](#video-guideline)
- [Links](#links)

---

## Comfortable development

1. Clone repository

   ```bash
   git clone --depth 1 https://github.com/NibrasoftNet/soccer-book-server
   cd soccer-book-server/
   ```

2. Go to folder, and copy `env.example` as `.env`.

   ```bash
   cp env.example .env
   ```

3. Change `DATABASE_HOST=postgres` to `DATABASE_HOST=localhost`

   Change `MAIL_HOST=maildev` to `MAIL_HOST=localhost`

4. Run container dev mode:

   ```bash
   docker compose up -d --build
   ```

5. Install dependency

   ```bash
   npm install
   ```

6. Run app in dev mode

   ```bash
   npm run start:dev
   ```

7. Open <http://localhost:5001>


### Video guideline

<https://user-images.githubusercontent.com/6001723/235758846-d7d97de8-dea9-46d8-ae12-8cc6b76df03d.mp4>

---

## Links

- Swagger (API docs): <http://localhost:5001/docs>
- Adminer (client for DB): <http://localhost:8085>
- Maildev: <http://localhost:1080>

---

Previous: [Introduction](introduction.md)

Next: [Working with database](database.md)
