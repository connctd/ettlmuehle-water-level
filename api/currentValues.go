package api

import (
	"encoding/json"
	"net/http"

	"sthh.eu/graphql/connctd"
)

func HandleCurrentValuesCall(w http.ResponseWriter, r *http.Request) {
	// handleCors(w, r)

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
	json.NewEncoder(w).Encode(response)
}
