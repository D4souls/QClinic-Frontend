# CONFIGURE XAMPP TO RESPONSE API GET
1. Go to httpd-vhosts.conf
2. Add this code:
   ``` <Directory "route/to/your/project/api">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        Header set Access-Control-Allow-Origin "*"
        Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Header set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept"
    </Directory>
```