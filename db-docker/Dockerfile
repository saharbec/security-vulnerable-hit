FROM mysql:5.7

ENV MYSQL_DATABASE=test_db
ENV MYSQL_ROOT_PASSWORD=pass

COPY tables.sql /docker-entrypoint-initdb.d/tables.sql
