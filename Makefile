client_sercret = 482Hy1lwzqXS
client_id = 2f8e46f9-fd09-4f54-8c32-5616d4e10d4d
base_url = https://api.connctd.io
run:
	CONNCTD_CLIENT_SECRET=$(client_sercret) CONNCTD_CLIENT_ID=$(client_id) CONNCTD_BASE_URL=$(base_url) go run server.go