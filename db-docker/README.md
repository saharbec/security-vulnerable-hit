# How to run the database

To run the database you must run the following commands:

```sh
# 1. Build the docker image based on the Dockerfile
$ docker build -t security-db .

# 2. Run the container from the built image
$ docker run -d -p 3306:3306 --name security-sqldb security-db

# 3. Any time you want to restart the db use the
#    existing container.
$ docker start|stop|restart security-sqldb
```
