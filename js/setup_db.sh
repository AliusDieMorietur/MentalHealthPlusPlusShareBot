docker-compose down && docker volume rm $(docker volume ls -q) 
docker-compose up -d
sleep 5
docker exec -it js_db_1 psql -U postgres -d postgres -c "$(cat ./db/init.sql)"
DATABASE_URL=postgres://postgres:password@localhost:5432/mhpp npm run migrate up 

