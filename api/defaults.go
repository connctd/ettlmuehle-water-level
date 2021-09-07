package api

import "net/http"

func handleNotFound(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNotFound)
}
