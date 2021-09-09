package api

import (
	"encoding/json"
	"net/http"
	"strconv"

	"sthh.eu/graphql/connctd"
)

const DEFAULT_NUMBER_OF_WEEKS = 6

func HandleAggregateWeekCall(w http.ResponseWriter, r *http.Request) {
	handleCors(w, r)

	switch r.Method {
	case http.MethodOptions:
	case http.MethodGet:
		handleWeekData(w, r)
	default:
		handleNotFound(w)
	}
}

func handleWeekData(w http.ResponseWriter, r *http.Request) {
	toQuery := r.URL.Query().Get("to")
	nQuery := r.URL.Query().Get("n")

	resp := AggregatedDataResponse{
		Errors: make([]string, 0),
	}

	n, err := strconv.Atoi(nQuery)
	if err != nil && nQuery != "" {
		resp.Errors = append(resp.Errors, "Failed to parse request. n should be a integer")
	}
	if nQuery == "" {
		n = DEFAULT_NUMBER_OF_WEEKS
	}

	to, err := toTime(toQuery)
	if err != nil {
		resp.Errors = append(resp.Errors, "Failed to parse request. from should be in RFC 3338 format")
	}

	if len(resp.Errors) > 0 {
		respJson, _ := json.Marshal(resp)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(respJson)
		return
	}

	aggregatedData, err := connctd.WeeklyData(to, n)
	if err != nil {
		resp.Errors = append(resp.Errors, err.Error())
		w.WriteHeader(http.StatusInternalServerError)
	}
	resp.Data = aggregatedData
	json.NewEncoder(w).Encode(resp)
}
