Deployment steps for cPanel

1. Upload the project folder to your cPanel account (via File Manager or git). Place it outside the public_html directory if you prefer, and set the Document Root to the `public/` directory.
2. SSH into your cPanel account or use the Terminal in cPanel.
3. Run: `composer install` to install dependencies.
4. Copy `.env.example` to `.env` and configure your PostgreSQL database details (host, port, database, username, password) provided by cPanel.
5. Ensure PHP version >= 8.1 is selected in cPanel's PHP Selector.
6. If migrations present, run: `php artisan migrate`.
7. Point your domain/subdomain to the `public/` folder or set an .htaccess redirect to `public/index.php`.
8. For background workers or queue, configure cPanel's cron or supervisor equivalent.

Notes about PostgreSQL on cPanel:
- cPanel commonly provides MySQL/MariaDB; if your host supports PostgreSQL, use the Postgres credentials. Otherwise you can switch DB driver to mysql and adapt `.env` accordingly.
- If you cannot run composer via SSH, generate `vendor/` locally and upload it along with the code.
