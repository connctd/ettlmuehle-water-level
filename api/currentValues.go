package api

import (
	"encoding/json"
	"net/http"
	"os"

	"sthh.eu/graphql/connctd"
	"sthh.eu/graphql/utils"
)

func handleNotFound(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNotFound)
}

func handleCors(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")

	if origin == "" {
		// request probably not send by browser
		w.Header().Set("Access-Control-Allow-Origin", "*")
	} else {
		// request needs to be either from localhost or same domain
		if _, found := utils.AllowedOrigins[origin]; found {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		} else {
			key := os.Getenv(utils.EnvVercelURL)
			if origin == key {
				w.Header().Set("Access-Control-Allow-Origin", origin)
			}
		}
	}

	w.Header().Set("Access-Control-Allow-Headers", "*")
}

func HandleCurrentValuesCall(w http.ResponseWriter, r *http.Request) {
	handleCors(w, r)

	switch r.Method {
	case http.MethodOptions:
	case http.MethodGet:
		handleCurrentValues(w, r)
	default:
		handleNotFound(w)
	}
}

type CurrentDataResponse struct {
	Errors []string                `json:"errors"`
	Data   connctd.LevelBySensorId `json:"data"`
}

func handleCurrentValues(w http.ResponseWriter, r *http.Request) {
	currentValues, err := connctd.GetCurrentData()
	response := CurrentDataResponse{
		Errors: make([]string, 0),
		Data:   currentValues,
	}
	if err != nil {
		response.Errors = append(response.Errors, err.Error())
		w.WriteHeader(http.StatusInternalServerError)
	}
	w.Header().Add("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
