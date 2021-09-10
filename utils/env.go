package utils

const (
	EndpointError     = "/error"
	EndpointDashboard = "/"
)

const (
	// must be 32 bytes
	EnvPasetoKey    = "PASETO_KEY"
	EnvMasterKey    = "MASTER_KEY"
	EnvBaseURL      = "CONNCTD_BASE_URL"
	EnvClientID     = "CONNCTD_CLIENT_ID"
	EnvClientSecret = "CONNCTD_CLIENT_SECRET"

	// set by vercel
	EnvVercelURL = "VERCEL_URL"
)

const (
	// failed to encrypt token
	ErrorCodeFailedEncrypt = 1
	ErrorCodeForbidden     = 403
)

var (
	AllowedOrigins = map[string]struct{}{
		"http://localhost:8080": {},
		"http://localhost:3000": {},
	}
)
