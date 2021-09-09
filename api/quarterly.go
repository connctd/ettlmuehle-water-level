package api

import (
	"encoding/json"
	"net/http"
	"time"

	"sthh.eu/graphql/connctd"
)

func HandleQuarterlyHourCall(w http.ResponseWriter, r *http.Request) {
	handleCors(w, r)

	switch r.Method {
	case http.MethodOptions:
	case http.MethodGet:
		handleQuarterlyHour(w, r)
	default:
		handleNotFound(w)
	}
}

type QuarterlyDataResponse struct {
	Errors []string                              `json:"errors"`
	Data   map[time.Time]connctd.LevelBySensorId `json:"data"`
}

func handleQuarterlyHour(w http.ResponseWriter, r *http.Request) {
	fromQuery := r.URL.Query().Get("from")
	toQuery := r.URL.Query().Get("to")

	response := QuarterlyDataResponse{
		Errors: make([]string, 0),
	}
	from, err := toTime(fromQuery)
	to, err2 := toTime(toQuery)

	if err != nil || err2 != nil {
		response.Errors = append(response.Errors, "Failed to parse request. Dates should be in RFC 3338 format")
		respJson, _ := json.Marshal(response)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(respJson)
		return
	}

	aggregatedData, err := connctd.QuarterlyHourData(from, to)
	if err != nil {
		response.Errors = append(response.Errors, err.Error())
		w.WriteHeader(http.StatusInternalServerError)
	}
	response.Data = aggregatedData
	json.NewEncoder(w).Encode(response)
}
