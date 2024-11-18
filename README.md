
# 49ers Dashboard App

## Description
This app displays a dashboard with sample San Francisco 49ers player data. It uses a PHP backend to seed a MySQL database with example data. The PHP server then serves CRUD endpoints for Games and Players at `/games` and `/players`, respectively. These can be accessed at `https://localhost:443/{route}` by default. Each CRUD operation is sent to a Redis queue and subsequently picked up by a worker operating on the PHP server. This minimizes read/write conflicts for the database during high-volume operations. The frontend (React + Next.js) pulls data from the PHP server to populate the dashboard, communicating with the backend via a reverse proxy (set up using Caddy) to ensure HTTPS is used for all data transmission. Note that some configuration is required to run this project locally, as detailed below.

Specs doc: [Specs Document](https://docs.google.com/document/d/1AzoPwE1PqFS5TG1NZzAVQXbi1R4OwUr86Oh9yIKNeGg/edit?tab=t.0)

## Requirements
This project requires Docker and the Docker Compose plugin to run. To install, follow the instructions [here](https://docs.docker.com/compose/install/linux/).

## Instructions
To run, execute the following from the root directory of this project:

```bash
$> docker compose up
```

This will perform the following actions (in order):
1. Create the Docker network for secure cross-container communication
2. Create Docker storage volumes for the MySQL database and Redis cache
3. Create the Redis server
4. Create the MySQL database
5. Create the PHP server and seed the MySQL database
6. Create the Caddy server
7. Create the frontend

This will take a few minutes upon first run. Once the images are built, startup should take ~35 seconds.

For development purposes, or if you'd like to regenerate the seed data for the dashboard, you can run:

```bash
$> docker compose down -v && docker compose up -d --build --force-recreate
```

This will stop all Docker containers, remove any associated storage volumes, rebuild the containers, and restart them.

### Security Configuration
I’ve included security certificates to ensure HTTPS-based communication between the frontend and backend. However, I cannot register these as trusted certificates since we don’t own a domain for this dashboard. This requires some minor local configurations to interact with the system. Any direct backend interactions will require disabling SSL verification; software like Postman will notify you and guide you through the process. Viewing the frontend will require minor browser configuration to allow insecure certificates. Instructions are as follows, and the steps may be reversed once you're done viewing the site.

**Ignore Certificate Errors in Development (for Browsers)**:

_Google Chrome_:  
Navigate to `chrome://flags/#allow-insecure-localhost` and enable the setting.

_Mozilla Firefox_:  
In Firefox, you can manually accept the risk for self-signed certificates. When the certificate error occurs, there should be an option to "proceed anyway" after adding an exception.

## Backend
The PHP server runs CRUD endpoints for Games and Players at `/games` and `/players`, respectively. Upon startup, it seeds a MySQL database with example data, which can be found in the `backend/init_data` directory, and the process can be observed in the `backend/seed.php` file. Note that in order to minimize time and effort spent generating test data, Player Season Rankings are pre-set and randomized, Weekly Rankings are randomized, and player attributes are random/may not be accurate. Additionally, code comments are not up to my normal standard given time restrictions, but the format of the codebase should not be confusing in any regard.

The APIs can be accessed via `localhost:443/{route}`. Each CRUD operation is sent to a Redis queue and is subsequently picked up by a worker operating on the PHP server (located in `backend/utils/QueueWorker.php`). All interactions with the `/games` and `/players` endpoints are secured via the `/auth` endpoint and require a valid JWT bearer token. For local development, a hardcoded user (user: `admin`, pass: `pw12345`) is available to retrieve the JWT token. This is not suitable for a production-ready application.

## Redis/Queue
Each CRUD interaction with the database is sent to a Redis queue and picked up by a worker operating on the PHP server. This minimizes read/write conflicts for the database during high-volume operations. Note that read operations are not handled through the queue (this approach has been validated with Vaidhy).

## Database
The MySQL database contains data for Players (`players` table), Games (`games` table), and Users (`users` table). Player data also includes weekly Player Rankings (`player_rankings` table). All data is pre-seeded by the PHP server within the `dashboard_db` DB, but additional data can be added, updated, or removed. An init script can be found in at `config/db/init/init.sql`.

Since this is a simple relational model, there is minimal query optimization to discuss. The Players and Games tables are related to the Player Rankings table via foreign key, allowing quick lookups and simple joins from any of the three object models. I've added indexes on columns that may be frequently queried. Note that the backend uses "SELECT *" statements in some cases, which is not optimal but was quick to implement. Specifying the columns would improve performance and minimize unnecessary data transfer. Additional optimizations could include shrinking variable sizes for certain columns if they are larger than required. The backend could also implement batch operations where possible to minimize write operations.

## Caddy/Reverse Proxy
Caddy ensures HTTPS is used for all data transmission. Note that this uses a locally-generated self-signed SSL certificate, which introduces some complications. See the "Security Configuration" section above for details. A web-available or production application would use a properly-signed certificate that wouldn't require these workarounds.

## Frontend
The frontend displays Games and Players data from the PHP server in an aesthetic manner and can be accessed at `localhost:3000`. It is built using Next.js/React with some helper components from [shadcn/TanStack](https://ui.shadcn.com/docs/components/data-table). The frontend communicates with the backend via authenticated API routes that require a valid JWT token. Traditionally, this would require a basic login/authentication system. However, since this is a showcase project, I opted to avoid this step and simply hardcode a pre-allocated user with adequate privileges. This is not acceptable for a production system, but it saved time in the development process. A proper OAuth system would be preferable for a publicly available application.

I tried to model the frontend closely to the provided specs. However, I took some creative liberties to allocate time to showcase my abilities elsewhere. I used Tailwind CSS in most places to quickly prototype component designs. This has the drawback of limited style reusability, repetitive styling statements, and readability limitations. A production-level app should have properly-defined styles for each component in a manner that is easily readable and reusable.

You'll notice that some columns may not have full formatting, some icons and page layouts may differ, and I used the same stock player image for all example players. Additionally, the matching of icon images with teams/players is hardcoded. In a production app, I would prefer to store the images in the cloud and link to them in the database. All core functionality should work as expected, though!

Modeled after the specs here: [Specs Link](https://xd.adobe.com/view/1b1b3820-cef2-422d-a63d-cc19cc939368-4e48/specs/)

## Security
As discussed in previous sections, basic security practices are observed within this project, but a few compromises were made.

HTTPS is used for all data transmission. However, this uses a locally-generated self-signed SSL certificate, which introduces some complications. See the "Security Configuration" section above for details. A web-available or production application would have a properly-signed certificate that wouldn't need these workarounds.

A single admin user is created and used across the project for authentication purposes. This is not ideal for obvious reasons but allowed me to focus on other aspects of the project.

## Final Notes
I appreciate the guidance and flexibility of the team in helping me understand what was required and allowing me adequate time to complete this. The additional time enabled me to do things "right" rather than quickly. I hope the final product showcases how I approach problems as an engineer and what I can bring to the team!
