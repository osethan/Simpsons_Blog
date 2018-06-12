build-frontend:
	docker build -t osethan/blog-frontend -f ./client/Dockerfile .

build-backend:
	docker build -t osethan/blog-backend -f ./server/Dockerfile .

build-mysql:
	docker build -t osethan/blog-mysql -f ./data/Dockerfile .

sink:
	docker rm -f `docker ps -a -q`

no-none:
	docker rmi -f `docker images | grep 'none'`
