client_sercret = YZShn6iwWz2~
client_id = f2075da6-e635-4dd6-9c2e-0f27d7f44c75
base_url = https://api.connctd.io
run:
	CONNCTD_CLIENT_SECRET=$(client_sercret) CONNCTD_CLIENT_ID=$(client_id) CONNCTD_BASE_URL=$(base_url) go run server.go